-- ====================================================================
-- COLOUR PREDICTION GAMING PLATFORM (PROVABLY FAIR SIMULATOR)
-- PostgreSQL + Supabase Schema with Row Level Security (RLS)
-- Strictly Virtual Points Only - Never redeemable for real currency
-- ====================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. User Roles Enum & Profiles Table
CREATE TYPE user_role_type AS ENUM ('user', 'moderator', 'admin');
CREATE TYPE user_status_type AS ENUM ('active', 'suspended', 'banned');

CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) NOT NULL,
    avatar_url TEXT DEFAULT '',
    virtual_points BIGINT DEFAULT 1000 NOT NULL CHECK (virtual_points >= 0),
    role user_role_type DEFAULT 'user' NOT NULL,
    status user_status_type DEFAULT 'active' NOT NULL,
    total_rounds_played INTEGER DEFAULT 0 NOT NULL,
    total_wins INTEGER DEFAULT 0 NOT NULL,
    total_losses INTEGER DEFAULT 0 NOT NULL,
    accuracy_percentage NUMERIC(5,2) DEFAULT 0.00 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 3. Games Catalog Table
CREATE TABLE IF NOT EXISTS public.games (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    duration_seconds INTEGER NOT NULL,
    lock_before_seconds INTEGER DEFAULT 5 NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Insert Default Games
INSERT INTO public.games (id, name, description, duration_seconds, lock_before_seconds, is_active)
VALUES 
    ('wingo_30s', 'Win Go 30s', 'Lightning-fast 30 seconds color and number prediction', 30, 5, true),
    ('wingo_1m', 'Win Go 1Min', 'Classic 1 minute high precision color trading round', 60, 5, true),
    ('wingo_3m', 'Win Go 3Min', 'Strategic 3 minutes color prediction round', 180, 5, true),
    ('wingo_5m', 'Win Go 5Min', 'Analytical 5 minutes grand color prediction round', 300, 5, true)
ON CONFLICT (id) DO UPDATE SET 
    name = EXCLUDED.name,
    duration_seconds = EXCLUDED.duration_seconds;

-- 4. Game Rounds Table
CREATE TYPE round_status_type AS ENUM ('betting', 'locked', 'completed', 'cancelled');
CREATE TYPE color_result_type AS ENUM ('green', 'red', 'violet', 'green_violet', 'red_violet');
CREATE TYPE big_small_type AS ENUM ('big', 'small');

CREATE TABLE IF NOT EXISTS public.game_rounds (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    game_id VARCHAR(50) NOT NULL REFERENCES public.games(id) ON DELETE CASCADE,
    period_id VARCHAR(50) NOT NULL,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    status round_status_type DEFAULT 'betting' NOT NULL,
    result_number SMALLINT CHECK (result_number >= 0 AND result_number <= 9),
    result_color color_result_type,
    result_big_small big_small_type,
    seed_hash VARCHAR(64) NOT NULL,
    secret_salt VARCHAR(64),
    total_bets_count INTEGER DEFAULT 0 NOT NULL,
    total_points_wagered BIGINT DEFAULT 0 NOT NULL,
    total_points_payout BIGINT DEFAULT 0 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    resolved_at TIMESTAMPTZ,
    CONSTRAINT unique_game_period UNIQUE (game_id, period_id)
);

CREATE INDEX IF NOT EXISTS idx_game_rounds_game_period ON public.game_rounds(game_id, period_id DESC);
CREATE INDEX IF NOT EXISTS idx_game_rounds_status ON public.game_rounds(status);

-- 5. Predictions (Bets) Table
CREATE TYPE bet_category_type AS ENUM ('color', 'number', 'big_small');
CREATE TYPE prediction_status_type AS ENUM ('pending', 'won', 'lost', 'cancelled');

CREATE TABLE IF NOT EXISTS public.predictions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    round_id UUID NOT NULL REFERENCES public.game_rounds(id) ON DELETE CASCADE,
    period_id VARCHAR(50) NOT NULL,
    game_id VARCHAR(50) NOT NULL REFERENCES public.games(id),
    bet_type bet_category_type NOT NULL,
    selection VARCHAR(20) NOT NULL, -- 'green', 'red', 'violet', '0'..'9', 'big', 'small'
    points_amount BIGINT NOT NULL CHECK (points_amount > 0),
    multiplier INTEGER DEFAULT 1 NOT NULL CHECK (multiplier >= 1),
    total_bet_points BIGINT NOT NULL CHECK (total_bet_points > 0),
    odds NUMERIC(5,2) NOT NULL CHECK (odds > 0),
    status prediction_status_type DEFAULT 'pending' NOT NULL,
    payout_points BIGINT DEFAULT 0 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_predictions_user ON public.predictions(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_predictions_round ON public.predictions(round_id);
CREATE INDEX IF NOT EXISTS idx_predictions_game_period ON public.predictions(game_id, period_id);

-- 6. Virtual Points Transaction Ledger
CREATE TYPE ledger_tx_type AS ENUM (
    'signup_bonus',
    'daily_reward',
    'bet_placed',
    'bet_won',
    'admin_adjustment',
    'system_refund'
);

CREATE TABLE IF NOT EXISTS public.virtual_points_ledger (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    tx_type ledger_tx_type NOT NULL,
    amount BIGINT NOT NULL, -- positive for credits, negative for debits
    balance_after BIGINT NOT NULL CHECK (balance_after >= 0),
    reference_id VARCHAR(100), -- round_id, prediction_id, ticket_id
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_ledger_user ON public.virtual_points_ledger(user_id, created_at DESC);

-- 7. Daily Free Rewards Table
CREATE TABLE IF NOT EXISTS public.daily_rewards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    claim_date DATE NOT NULL DEFAULT CURRENT_DATE,
    points_rewarded INTEGER NOT NULL CHECK (points_rewarded > 0),
    streak_count INTEGER DEFAULT 1 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    CONSTRAINT unique_user_daily_claim UNIQUE (user_id, claim_date)
);

-- 8. Notifications Table
CREATE TYPE notification_type AS ENUM ('system', 'win', 'reward', 'support');

CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    type notification_type DEFAULT 'system' NOT NULL,
    is_read BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id, is_read, created_at DESC);

-- 9. Customer Support Tickets & Replies
CREATE TYPE ticket_status_type AS ENUM ('open', 'in_progress', 'resolved', 'closed');
CREATE TYPE ticket_priority_type AS ENUM ('low', 'medium', 'high');

CREATE TABLE IF NOT EXISTS public.support_tickets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    subject VARCHAR(200) NOT NULL,
    category VARCHAR(50) DEFAULT 'general' NOT NULL,
    priority ticket_priority_type DEFAULT 'medium' NOT NULL,
    status ticket_status_type DEFAULT 'open' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.support_replies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_id UUID NOT NULL REFERENCES public.support_tickets(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    is_admin BOOLEAN DEFAULT FALSE NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_support_replies_ticket ON public.support_replies(ticket_id, created_at ASC);

-- 10. Announcements & Banners
CREATE TABLE IF NOT EXISTS public.announcements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    banner_type VARCHAR(50) DEFAULT 'info' NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 11. Admin Audit Logs
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    target_type VARCHAR(50) NOT NULL,
    target_id VARCHAR(100) NOT NULL,
    details JSONB DEFAULT '{}'::jsonb,
    ip_address VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.games ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_rounds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.virtual_points_ledger ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can view own profile or public leaderboard fields. Admins can view all.
CREATE POLICY "Public can view usernames and rankings" ON public.profiles
    FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile avatar/username" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- Games: Publicly readable
CREATE POLICY "Games readable by all authenticated and anon" ON public.games
    FOR SELECT USING (true);

-- Game Rounds: Publicly readable
CREATE POLICY "Rounds readable by all" ON public.game_rounds
    FOR SELECT USING (true);

-- Predictions: Users view their own predictions. Admins can view all.
CREATE POLICY "Users view own predictions" ON public.predictions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users insert own predictions" ON public.predictions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Virtual Points Ledger: Users view their own transactions
CREATE POLICY "Users view own ledger" ON public.virtual_points_ledger
    FOR SELECT USING (auth.uid() = user_id);

-- Daily Rewards: Users view their own claims
CREATE POLICY "Users view own claims" ON public.daily_rewards
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users insert own claim" ON public.daily_rewards
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Notifications: Users view and update own notifications
CREATE POLICY "Users manage own notifications" ON public.notifications
    FOR ALL USING (auth.uid() = user_id);

-- Support Tickets: Users can view and create their own
CREATE POLICY "Users manage own tickets" ON public.support_tickets
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users view and insert replies on own tickets" ON public.support_replies
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.support_tickets 
            WHERE id = support_replies.ticket_id AND user_id = auth.uid()
        )
    );

-- Announcements: Publicly readable
CREATE POLICY "Public view active announcements" ON public.announcements
    FOR SELECT USING (is_active = true);

-- Helper Function: Check if user is Admin
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = user_id AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile when auth.users signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    gen_username VARCHAR(50);
BEGIN
    gen_username := COALESCE(
        NEW.raw_user_meta_data->>'username', 
        'Player_' || SUBSTRING(NEW.id::text FROM 1 FOR 6)
    );

    INSERT INTO public.profiles (id, username, email, virtual_points, role, status)
    VALUES (
        NEW.id,
        gen_username,
        NEW.email,
        1000, -- Free 1,000 virtual starter points
        'user',
        'active'
    )
    ON CONFLICT (id) DO NOTHING;

    -- Record initial signup credit in ledger
    INSERT INTO public.virtual_points_ledger (user_id, tx_type, amount, balance_after, notes)
    VALUES (
        NEW.id,
        'signup_bonus',
        1000,
        1000,
        'Welcome free virtual points bonus'
    );

    -- Welcome notification
    INSERT INTO public.notifications (user_id, title, message, type)
    VALUES (
        NEW.id,
        'Welcome to Lumina WinGo!',
        'You have received 1,000 free virtual points to explore color and number predictions. Have fun and play responsibly!',
        'reward'
    );

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION public.set_current_timestamp_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();

