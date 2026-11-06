import { NextRequest, NextResponse } from "next/server";
import { generateInitialHistory, GAME_DURATIONS } from "@/lib/game/engine";
import { GameModeId } from "@/types";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const gameId = (searchParams.get("gameId") || "wingo_30s") as GameModeId;
  const count = parseInt(searchParams.get("count") || "25", 10);

  if (!GAME_DURATIONS[gameId]) {
    return NextResponse.json({ error: "Invalid game ID" }, { status: 400 });
  }

  const history = generateInitialHistory(gameId, Math.min(count, 50));

  return NextResponse.json({
    success: true,
    gameId,
    history,
  });
}

