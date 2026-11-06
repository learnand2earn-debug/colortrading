import { NextRequest, NextResponse } from "next/server";
import { getCurrentPeriodInfo, GAME_DURATIONS } from "@/lib/game/engine";
import { GameModeId, BetType } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, gameId, betType, selection, amount, multiplier } = body;

    if (!userId || !gameId || !betType || !selection || !amount) {
      return NextResponse.json(
        { success: false, message: "Missing required bet parameters" },
        { status: 400 }
      );
    }

    if (!GAME_DURATIONS[gameId as GameModeId]) {
      return NextResponse.json(
        { success: false, message: "Invalid game mode" },
        { status: 400 }
      );
    }

    const periodInfo = getCurrentPeriodInfo(gameId as GameModeId);

    // Validate that betting is not locked
    if (periodInfo.isLocked) {
      return NextResponse.json(
        {
          success: false,
          message: "Period is locked. Please wait for the next round.",
        },
        { status: 423 }
      );
    }

    const totalPoints = Number(amount) * Number(multiplier || 1);
    if (isNaN(totalPoints) || totalPoints <= 0) {
      return NextResponse.json(
        { success: false, message: "Invalid prediction point amount" },
        { status: 400 }
      );
    }

    // In a fully deployed Supabase environment, this would execute `public.place_prediction`
    return NextResponse.json({
      success: true,
      message: "Prediction successfully validated and accepted",
      prediction: {
        id: `pred_srv_${Date.now()}`,
        user_id: userId,
        period_id: periodInfo.periodId,
        game_id: gameId,
        bet_type: betType,
        selection,
        points_amount: amount,
        multiplier: multiplier || 1,
        total_bet_points: totalPoints,
        status: "pending",
        created_at: new Date().toISOString(),
      },
    });
  } catch (err: unknown) {
    const error = err as Error;
    return NextResponse.json(
      { success: false, message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

