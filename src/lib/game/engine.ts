import { ColorResult, BigSmallSelection, GameModeId, GameRound, Prediction } from "@/types";
import { generatePeriodId } from "../utils";

export const GAME_DURATIONS: Record<GameModeId, number> = {
  wingo_30s: 30,
  wingo_1m: 60,
  wingo_3m: 180,
  wingo_5m: 300,
};

// Generates provable pseudo-random hash for demonstration & verification
export function generateSeedHash(periodId: string, salt: string): string {
  let hash = 0;
  const str = `${periodId}-${salt}-lumina-provably-fair`;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash).toString(16).padStart(16, "0") + "a7f9c2e4b8d1";
}

// Derive deterministic 0-9 number from secret salt
export function deriveResultNumber(salt: string): number {
  let sum = 0;
  for (let i = 0; i < salt.length; i++) {
    sum += salt.charCodeAt(i);
  }
  return sum % 10;
}

export function calculateRoundDetails(num: number): {
  color: ColorResult;
  bigSmall: BigSmallSelection;
} {
  const bigSmall: BigSmallSelection = num >= 5 ? "big" : "small";
  let color: ColorResult;

  if (num === 0) {
    color = "red_violet";
  } else if (num === 5) {
    color = "green_violet";
  } else if ([1, 3, 7, 9].includes(num)) {
    color = "green";
  } else {
    color = "red";
  }

  return { color, bigSmall };
}

// Generate realistic period sequence counter based on current wall clock
export function getCurrentPeriodInfo(gameId: GameModeId): {
  periodId: string;
  secondsRemaining: number;
  totalDuration: number;
  isLocked: boolean;
} {
  const duration = GAME_DURATIONS[gameId] || 30;
  const now = Math.floor(Date.now() / 1000);
  const cycleIndex = Math.floor(now / duration);
  const secondsElapsed = now % duration;
  const secondsRemaining = duration - secondsElapsed;
  const isLocked = secondsRemaining <= 5;

  // Format period id: YYYYMMDD + sequence
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  const sequenceNum = 100010000 + (cycleIndex % 10000);
  const periodId = `${yyyy}${mm}${dd}${sequenceNum}`;

  return {
    periodId,
    secondsRemaining,
    totalDuration: duration,
    isLocked,
  };
}

// Evaluates a bet against the winning outcome
export function evaluatePrediction(
  bet: Prediction,
  resultNum: number,
  resultColor: ColorResult,
  resultBigSmall: BigSmallSelection
): {
  isWin: boolean;
  payoutPoints: number;
} {
  let isWin = false;
  let payout = 0;

  if (bet.bet_type === "number") {
    if (bet.selection === String(resultNum)) {
      isWin = true;
      payout = Math.round(bet.total_bet_points * 9.0);
    }
  } else if (bet.bet_type === "big_small") {
    if (bet.selection.toLowerCase() === resultBigSmall.toLowerCase()) {
      isWin = true;
      payout = Math.round(bet.total_bet_points * 2.0);
    }
  } else if (bet.bet_type === "color") {
    const sel = bet.selection.toLowerCase();
    if (sel === "violet" && (resultNum === 0 || resultNum === 5)) {
      isWin = true;
      payout = Math.round(bet.total_bet_points * 4.5);
    } else if (sel === "green") {
      if ([1, 3, 7, 9].includes(resultNum)) {
        isWin = true;
        payout = Math.round(bet.total_bet_points * 2.0);
      } else if (resultNum === 5) {
        // Half payout when green + violet hit
        isWin = true;
        payout = Math.round(bet.total_bet_points * 1.5);
      }
    } else if (sel === "red") {
      if ([2, 4, 6, 8].includes(resultNum)) {
        isWin = true;
        payout = Math.round(bet.total_bet_points * 2.0);
      } else if (resultNum === 0) {
        // Half payout when red + violet hit
        isWin = true;
        payout = Math.round(bet.total_bet_points * 1.5);
      }
    }
  }

  return { isWin, payoutPoints: isWin ? payout : 0 };
}

// Generate realistic initial game history (e.g. last 30 rounds)
export function generateInitialHistory(gameId: GameModeId, count: number = 25): GameRound[] {
  const history: GameRound[] = [];
  const duration = GAME_DURATIONS[gameId];
  const now = Math.floor(Date.now() / 1000);
  const currentCycle = Math.floor(now / duration);

  const predefinedResults = [
    8, 7, 6, 6, 7, 1, 2, 2, 9, 0, 5, 3, 4, 8, 9, 1, 6, 4, 5, 0, 7, 8, 3, 2, 9
  ];

  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");

  for (let i = 0; i < count; i++) {
    const cycle = currentCycle - (i + 1);
    const sequenceNum = 100010000 + (cycle % 10000);
    const periodId = `${yyyy}${mm}${dd}${sequenceNum}`;
    const resultNumber = predefinedResults[i % predefinedResults.length];
    const { color, bigSmall } = calculateRoundDetails(resultNumber);
    const salt = `salt_${periodId}_${resultNumber * 777}`;
    const seedHash = generateSeedHash(periodId, salt);

    history.push({
      id: `round_${periodId}`,
      game_id: gameId,
      period_id: periodId,
      start_time: new Date((cycle * duration) * 1000).toISOString(),
      end_time: new Date(((cycle + 1) * duration) * 1000).toISOString(),
      status: "completed",
      result_number: resultNumber,
      result_color: color,
      result_big_small: bigSmall,
      seed_hash: seedHash,
      secret_salt: salt,
      total_bets_count: 142 + (resultNumber * 23),
      total_points_wagered: 18400 + (resultNumber * 3500),
      total_points_payout: 16200 + (resultNumber * 3100),
      created_at: new Date((cycle * duration) * 1000).toISOString(),
      resolved_at: new Date(((cycle + 1) * duration) * 1000).toISOString(),
    });
  }

  return history;
}

