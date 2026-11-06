import { NextRequest, NextResponse } from "next/server";
import { getCurrentPeriodInfo, GAME_DURATIONS, generateSeedHash } from "@/lib/game/engine";
import { GameModeId } from "@/types";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const gameId = (searchParams.get("gameId") || "wingo_30s") as GameModeId;

  if (!GAME_DURATIONS[gameId]) {
    return NextResponse.json({ error: "Invalid game ID" }, { status: 400 });
  }

  const info = getCurrentPeriodInfo(gameId);
  const seedHash = generateSeedHash(info.periodId, `salt_${info.periodId}_server`);

  return NextResponse.json({
    success: true,
    gameId,
    periodId: info.periodId,
    secondsRemaining: info.secondsRemaining,
    totalDuration: info.totalDuration,
    isLocked: info.isLocked,
    seedHash,
    serverTime: new Date().toISOString(),
  });
}

