"use client";

import React, { useState } from "react";
import { useGame } from "@/context/GameContext";
import { GameModeId } from "@/types";
import { formatCountdown } from "@/lib/utils";
import { Clock, ShieldCheck, HelpCircle, Volume2, VolumeX, Sparkles, X } from "lucide-react";

export const RoundHeader: React.FC = () => {
  const {
    gameId,
    setGameId,
    periodId,
    secondsRemaining,
    isLocked,
    soundMuted,
    toggleSound,
    history,
  } = useGame();

  const [showRules, setShowRules] = useState<boolean>(false);
  const [showFairness, setShowFairness] = useState<boolean>(false);

  const currentRound = history[0];
  const { minutes, seconds } = formatCountdown(secondsRemaining);

  const gameModes: { id: GameModeId; label: string; sub: string }[] = [
    { id: "wingo_30s", label: "Win Go 30s", sub: "30 sec" },
    { id: "wingo_1m", label: "Win Go 1Min", sub: "1 min" },
    { id: "wingo_3m", label: "Win Go 3Min", sub: "3 min" },
    { id: "wingo_5m", label: "Win Go 5Min", sub: "5 min" },
  ];

  return (
    <div className="w-full">
      {/* Game Mode Tab Bar */}
      <div className="grid grid-cols-4 gap-1.5 p-1.5 bg-white rounded-2xl border border-slate-200/90 shadow-sm mb-3">
        {gameModes.map((mode) => {
          const isActive = gameId === mode.id;
          return (
            <button
              key={mode.id}
              type="button"
              onClick={() => setGameId(mode.id)}
              className={`flex flex-col items-center py-2 px-1 rounded-xl text-xs font-bold transition-all ${
                isActive
                  ? "bg-gradient-to-b from-emerald-500 to-game-green text-white shadow-neon-green"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <span className="truncate">{mode.label}</span>
              <span className={`text-[10px] ${isActive ? "text-emerald-100 font-semibold" : "text-slate-400"}`}>
                {mode.sub}
              </span>
            </button>
          );
        })}
      </div>

      {/* Period & Countdown Display Card */}
      <div className="relative overflow-hidden bg-white border border-slate-200/90 rounded-2xl p-4 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          {/* Left: Period & Tools */}
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Period</span>
              <button
                type="button"
                onClick={() => setShowRules(true)}
                className="text-slate-400 hover:text-game-green transition-colors"
                title="How to Play"
              >
                <HelpCircle className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setShowFairness(true)}
                className="text-slate-400 hover:text-game-green transition-colors"
                title="Provably Fair Verification"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-game-green" />
              </button>
              <button
                type="button"
                onClick={toggleSound}
                className="text-slate-400 hover:text-slate-700 transition-colors ml-1"
                title={soundMuted ? "Unmute Sound" : "Mute Sound"}
              >
                {soundMuted ? (
                  <VolumeX className="w-3.5 h-3.5 text-rose-500" />
                ) : (
                  <Volume2 className="w-3.5 h-3.5 text-game-green" />
                )}
              </button>
            </div>
            <div className="font-mono text-sm sm:text-base font-black text-slate-900 tracking-wider">
              {periodId || "Loading..."}
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-[11px] text-slate-500">
              <span className="w-2 h-2 rounded-full bg-game-green animate-pulse" />
              <span>Realtime Verified</span>
            </div>
          </div>

          {/* Right: Digital LED Countdown Box */}
          <div className="flex flex-col items-end">
            <span className="text-xs font-semibold text-slate-500 mb-1 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-game-green" />
              Time Remaining
            </span>

            <div
              className={`flex items-center gap-1 px-3 py-1.5 rounded-xl font-mono text-lg sm:text-xl font-black border transition-all ${
                isLocked
                  ? "bg-rose-50 border-rose-300 text-rose-600 shadow-sm animate-pulse"
                  : "bg-slate-900 border-slate-800 text-emerald-400 shadow-inner"
              }`}
            >
              <span className={`${isLocked ? "bg-rose-100 text-rose-700" : "bg-black/40 text-white"} px-2 py-0.5 rounded`}>
                {minutes}
              </span>
              <span className={isLocked ? "text-rose-600 font-bold" : "text-emerald-400 font-bold"}>
                :
              </span>
              <span
                className={`${
                  isLocked ? "bg-rose-100 text-rose-600" : "bg-black/40 text-emerald-400"
                } px-2 py-0.5 rounded`}
              >
                {seconds}
              </span>
            </div>

            {isLocked ? (
              <span className="text-[10px] font-black text-rose-600 mt-1 uppercase tracking-wider animate-pulse">
                Predictions Locked (≤ 5s)
              </span>
            ) : (
              <span className="text-[10px] text-slate-400 mt-1 font-medium">Accepting predictions</span>
            )}
          </div>
        </div>

        {/* 5-second Lock banner overlay bar */}
        {isLocked && (
          <div className="mt-3 py-2 px-3 rounded-xl bg-rose-50 border border-rose-200 text-center text-xs font-bold text-rose-600 flex items-center justify-center gap-2 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            <span>Calculating provably fair round outcome...</span>
          </div>
        )}
      </div>

      {/* Rules Modal */}
      {showRules && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-5 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-game-green" />
                92 Lucky - Rules & Payouts
              </h3>
              <button
                type="button"
                onClick={() => setShowRules(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs sm:text-sm text-slate-600">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <p className="font-bold text-game-green mb-1">Color Predictions:</p>
                <ul className="list-disc pl-4 space-y-1 text-xs">
                  <li><strong className="text-emerald-600">Green:</strong> Win if 1, 3, 7, 9 appears (2x payout). If 5 appears, win 1.5x payout.</li>
                  <li><strong className="text-rose-600">Red:</strong> Win if 2, 4, 6, 8 appears (2x payout). If 0 appears, win 1.5x payout.</li>
                  <li><strong className="text-purple-600">Violet:</strong> Win if 0 or 5 appears (4.5x payout).</li>
                </ul>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
                <p className="font-bold text-amber-600 mb-1">Direct Numbers (0 - 9):</p>
                <p>Pick exact number. If correct, payout is <strong>9x</strong> your simulated points!</p>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
                <p className="font-bold text-blue-600 mb-1">Big / Small:</p>
                <p><strong>Small (0-4)</strong> or <strong>Big (5-9)</strong>. Correct payout is <strong>2x</strong>.</p>
              </div>

              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-800 font-medium">
                🔒 Free Simulation Platform: All points are purely virtual with zero monetary value.
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowRules(false)}
              className="w-full py-2.5 rounded-xl bg-game-green text-white font-bold text-xs hover:brightness-105"
            >
              I Understand
            </button>
          </div>
        </div>
      )}

      {/* Provably Fair Info Modal */}
      {showFairness && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-game-green" />
                Provably Fair Verification
              </h3>
              <button
                type="button"
                onClick={() => setShowFairness(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600">
              <p>
                Every round outcome is generated cryptographically using a server seed salt and published hash prior to player predictions.
              </p>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
                <span className="text-[11px] text-slate-500 font-bold block">Current Round Seed Hash:</span>
                <p className="font-mono text-game-green break-all text-[11px]">
                  {currentRound?.seed_hash || "2a9b4f7e10cd83ea56bb8972fa90123c..."}
                </p>
              </div>

              {currentRound?.secret_salt && (
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-[11px] text-slate-500 font-bold block">Previous Round Secret Salt:</span>
                  <p className="font-mono text-amber-600 break-all text-[11px]">
                    {currentRound.secret_salt}
                  </p>
                </div>
              )}

              <p className="text-[11px] text-slate-400">
                Formula: <code className="text-slate-800">deriveNumber(salt) = sum(charCodes) % 10</code>.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowFairness(false)}
              className="w-full py-2.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-200"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
