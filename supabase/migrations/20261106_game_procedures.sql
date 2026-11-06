-- ====================================================================
-- STORED PROCEDURES & SECURE FUNCTIONS FOR COLOUR PREDICTION
-- Atomic Bet Deductions, Provably Fair Calculation, and Round Payouts
-- ====================================================================

-- Function: Place a Prediction (Atomic Virtual Points Deduction & Lock Check)
CREATE OR REPLACE FUNCTION public.place_prediction(
    p_user_id UUID,
    p_round_id UUID,
    p_game_id VARCHAR(50),
    p_bet_type public.bet_category_type,
    p_selection VARCHAR(20),
    p_points_amount BIGINT,
    p_multiplier INTEGER
)
RETURNS JSONB AS $$
DECLARE
    v_round public.game_rounds%ROWTYPE;
    v_user public.profiles%ROWTYPE;
    v_total_points BIGINT;
    v_odds NUMERIC(5,2);
    v_prediction_id UUID;
    v_new_balance BIGINT;
    v_seconds_remaining NUMERIC;
BEGIN
    v_total_points := p_points_amount * p_multiplier;

    -- Validate user profile and status
    SELECT * INTO v_user FROM public.profiles WHERE id = p_user_id;
    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'message', 'User account not found');
    END IF;

    IF v_user.status <> 'active' THEN
        RETURN jsonb_build_object('success', false, 'message', 'Account is suspended or inactive');
    END IF;

    IF v_user.virtual_points < v_total_points THEN
        RETURN jsonb_build_object('success', false, 'message', 'Insufficient virtual points');
    END IF;

    -- Fetch round and verify it is currently in 'betting' phase
    SELECT * INTO v_round FROM public.game_rounds WHERE id = p_round_id;
    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'message', 'Round not found');
    END IF;

    -- Check if locked (within 5 seconds of end_time)
    v_seconds_remaining := EXTRACT(EPOCH FROM (v_round.end_time - NOW()));
    IF v_round.status <> 'betting' OR v_seconds_remaining <= 5 THEN
        RETURN jsonb_build_object('success', false, 'message', 'Round is locked. Bets are closed for this period.');
    END IF;

    -- Calculate standard odds based on selection
    IF p_bet_type = 'number' THEN
        v_odds := 9.0; -- 9x multiplier for exact number 0-9
    ELSIF p_bet_type = 'color' THEN
        IF p_selection = 'violet' THEN
            v_odds := 4.5; -- Violet occurs on 0 and 5 (odds 4.5x)
        ELSE
            v_odds := 2.0; -- Red or Green (standard 2x minus commission or 1.5x on split)
        END IF;
    ELSIF p_bet_type = 'big_small' THEN
        v_odds := 2.0; -- Big (5-9) or Small (0-4) 2x
    ELSE
        v_odds := 2.0;
    END IF;

    -- Deduct virtual points atomically
    UPDATE public.profiles
    SET virtual_points = virtual_points - v_total_points,
        total_rounds_played = total_rounds_played + 1
    WHERE id = p_user_id
    RETURNING virtual_points INTO v_new_balance;

    -- Record in Ledger
    INSERT INTO public.virtual_points_ledger (
        user_id,
        tx_type,
        amount,
        balance_after,
        reference_id,
        notes
    ) VALUES (
        p_user_id,
        'bet_placed',
        -v_total_points,
        v_new_balance,
        v_round.period_id,
        'Placed ' || p_bet_type::text || ' prediction on ' || p_selection
    );

    -- Insert Prediction Record
    INSERT INTO public.predictions (
        user_id,
        round_id,
        period_id,
        game_id,
        bet_type,
        selection,
        points_amount,
        multiplier,
        total_bet_points,
        odds,
        status
    ) VALUES (
        p_user_id,
        p_round_id,
        v_round.period_id,
        p_game_id,
        p_bet_type,
        p_selection,
        p_points_amount,
        p_multiplier,
        v_total_points,
        v_odds,
        'pending'
    ) RETURNING id INTO v_prediction_id;

    -- Update round summary stats
    UPDATE public.game_rounds
    SET total_bets_count = total_bets_count + 1,
        total_points_wagered = total_points_wagered + v_total_points
    WHERE id = p_round_id;

    RETURN jsonb_build_object(
        'success', true,
        'message', 'Prediction placed successfully',
        'prediction_id', v_prediction_id,
        'new_balance', v_new_balance
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Resolve Round & Distribute Simulated Winnings
CREATE OR REPLACE FUNCTION public.resolve_round(
    p_round_id UUID,
    p_result_number INTEGER,
    p_secret_salt VARCHAR(64)
)
RETURNS JSONB AS $$
DECLARE
    v_round public.game_rounds%ROWTYPE;
    v_pred RECORD;
    v_color public.color_result_type;
    v_big_small public.big_small_type;
    v_is_win BOOLEAN;
    v_payout BIGINT;
    v_total_payout BIGINT := 0;
    v_new_bal BIGINT;
BEGIN
    SELECT * INTO v_round FROM public.game_rounds WHERE id = p_round_id;
    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'message', 'Round not found');
    END IF;

    IF v_round.status = 'completed' THEN
        RETURN jsonb_build_object('success', false, 'message', 'Round already completed');
    END IF;

    -- Determine Big / Small: 0-4 Small, 5-9 Big
    IF p_result_number >= 5 THEN
        v_big_small := 'big';
    ELSE
        v_big_small := 'small';
    END IF;

    -- Determine Color:
    -- 0: Red + Violet
    -- 5: Green + Violet
    -- 1, 3, 7, 9: Green
    -- 2, 4, 6, 8: Red
    IF p_result_number = 0 THEN
        v_color := 'red_violet';
    ELSIF p_result_number = 5 THEN
        v_color := 'green_violet';
    ELSIF p_result_number IN (1, 3, 7, 9) THEN
        v_color := 'green';
    ELSE
        v_color := 'red';
    END IF;

    -- Loop through each prediction for this round
    FOR v_pred IN SELECT * FROM public.predictions WHERE round_id = p_round_id AND status = 'pending' LOOP
        v_is_win := false;
        v_payout := 0;

        IF v_pred.bet_type = 'number' THEN
            IF v_pred.selection = p_result_number::text THEN
                v_is_win := true;
                v_payout := ROUND(v_pred.total_bet_points * v_pred.odds);
            END IF;
        ELSIF v_pred.bet_type = 'big_small' THEN
            IF v_pred.selection = v_big_small::text THEN
                v_is_win := true;
                v_payout := ROUND(v_pred.total_bet_points * v_pred.odds);
            END IF;
        ELSIF v_pred.bet_type = 'color' THEN
            IF v_pred.selection = 'violet' AND (p_result_number = 0 OR p_result_number = 5) THEN
                v_is_win := true;
                v_payout := ROUND(v_pred.total_bet_points * 4.5);
            ELSIF v_pred.selection = 'green' AND (p_result_number IN (1, 3, 7, 9)) THEN
                v_is_win := true;
                v_payout := ROUND(v_pred.total_bet_points * 2.0);
            ELSIF v_pred.selection = 'green' AND p_result_number = 5 THEN
                -- Half win payout for color when violet combination hit (standard rule 1.5x)
                v_is_win := true;
                v_payout := ROUND(v_pred.total_bet_points * 1.5);
            ELSIF v_pred.selection = 'red' AND (p_result_number IN (2, 4, 6, 8)) THEN
                v_is_win := true;
                v_payout := ROUND(v_pred.total_bet_points * 2.0);
            ELSIF v_pred.selection = 'red' AND p_result_number = 0 THEN
                -- Half win payout for color when violet combination hit (standard rule 1.5x)
                v_is_win := true;
                v_payout := ROUND(v_pred.total_bet_points * 1.5);
            END IF;
        END IF;

        IF v_is_win THEN
            UPDATE public.predictions
            SET status = 'won', payout_points = v_payout
            WHERE id = v_pred.id;

            -- Credit user virtual points
            UPDATE public.profiles
            SET virtual_points = virtual_points + v_payout,
                total_wins = total_wins + 1,
                accuracy_percentage = ROUND(((total_wins + 1)::numeric / GREATEST(total_rounds_played, 1)::numeric) * 100, 2)
            WHERE id = v_pred.user_id
            RETURNING virtual_points INTO v_new_bal;

            -- Record in ledger
            INSERT INTO public.virtual_points_ledger (
                user_id,
                tx_type,
                amount,
                balance_after,
                reference_id,
                notes
            ) VALUES (
                v_pred.user_id,
                'bet_won',
                v_payout,
                v_new_bal,
                v_round.period_id,
                'Won ' || v_payout || ' points on ' || v_pred.selection
            );

            -- Notify user
            INSERT INTO public.notifications (
                user_id,
                title,
                message,
                type
            ) VALUES (
                v_pred.user_id,
                'Round Victory! 🎉',
                'Your prediction on ' || UPPER(v_pred.selection) || ' won ' || v_payout || ' virtual points in Period ' || v_round.period_id || '!',
                'win'
            );

            v_total_payout := v_total_payout + v_payout;
        ELSE
            UPDATE public.predictions
            SET status = 'lost', payout_points = 0
            WHERE id = v_pred.id;

            UPDATE public.profiles
            SET total_losses = total_losses + 1,
                accuracy_percentage = ROUND((total_wins::numeric / GREATEST(total_rounds_played, 1)::numeric) * 100, 2)
            WHERE id = v_pred.user_id;
        END IF;
    END LOOP;

    -- Update round completion
    UPDATE public.game_rounds
    SET status = 'completed',
        result_number = p_result_number,
        result_color = v_color,
        result_big_small = v_big_small,
        secret_salt = p_secret_salt,
        total_points_payout = v_total_payout,
        resolved_at = NOW()
    WHERE id = p_round_id;

    RETURN jsonb_build_object(
        'success', true,
        'result_number', p_result_number,
        'result_color', v_color,
        'result_big_small', v_big_small,
        'total_payout', v_total_payout
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

