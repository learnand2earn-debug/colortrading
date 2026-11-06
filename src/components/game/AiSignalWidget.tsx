"use client";

import React, { useMemo } from "react";
import { useGame } from "@/context/GameContext";
import { Zap, TrendingUp, Sparkles, Flame, Check } from "lucide-react";

export const AiSignalWidget: React.FC = () => {
  const { periodId, history, openBetModal, isLocked } = useGame();

  // Calculate dynamic AI signals based on recent history
  const signal = useMemo(() => {
    const recent = history.slice(0, 10);
    const greenCount = recent.filter(
      (r) => r.result_number !== null && [1, 3, 7, 9, 5].includes(r.result_number)
    ).length;
    const redCount = 10 - greenCount;

    const recommendedColor: "green" | "red" = greenCount <= redCount ? "green" : "red";
    const confidence = 70 + Math.floor(Math.random() * 18);

    const bigCount = recent.filter(
      (r) => r.result_number !== null && r.result_number >= 5
    ).length;
    const recommendedBigSmall: "big" | "small" = bigCount >= 5 ? "small" : "big";

    return {
      color: recommendedColor,
      confidence,
      bigSmall: recommendedBigSmall,
      hotNumbers: [8, 7, 3],
      coldNumbers: [0, 2],
      pattern: greenCount >= 6 ? "Green Momentum Trend" : "Mean Reversion Pivot",
    };
  }, [history]);

  const handleApplySignal = () => {
    if (isLocked) return;
    openBetModal(
      "color",
      signal.color,
      `AI Signal: Join ${signal.color.toUpperCase()}`,
      signal.color === "green" ? "bg-game-green text-white" : "bg-game-red text-white"
    );
  };

  return (
    <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-amber-50 border border-emerald-200/90 rounded-2xl p-3.5 sm:p-4 shadow-sm space-y-2.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <div className="w-6 h-6 rounded-lg bg-game-green text-white flex items-center justify-center">
            <Zap className="w-3.5 h-3.5 fill-white" />
          </div>
          <span className="text-xs font-black text-slate-900 tracking-tight">
            92 Lucky Smart AI Signal
          </span>
        </div>

        <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-white/80 px-2 py-0.5 rounded-full border border-emerald-200">
          <span className="w-2 h-2 rounded-full bg-game-green animate-pulse" />
          <span>Period: {periodId ? periodId.slice(-5) : "..."}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-center">
        {/* Recommended Color */}
        <div className="bg-white p-2 rounded-xl border border-slate-200/80 shadow-xs">
          <span className="text-[10px] text-slate-500 font-semibold uppercase block">
            Color Forecast
          </span>
          <span
            className={`text-sm font-black uppercase ${
              signal.color === "green" ? "text-game-green" : "text-game-red"
            }`}
          >
            {signal.color} ({signal.confidence}%)
          </span>
        </div>

        {/* Big / Small Forecast */}
        <div className="bg-white p-2 rounded-xl border border-slate-200/80 shadow-xs">
          <span className="text-[10px] text-slate-500 font-semibold uppercase block">
            Size Forecast
          </span>
          <span className="text-sm font-black text-amber-600 uppercase">
            {signal.bigSmall}
          </span>
        </div>

        {/* Hot Numbers */}
        <div className="bg-white p-2 rounded-xl border border-slate-200/80 shadow-xs">
          <span className="text-[10px] text-slate-500 font-semibold uppercase block flex items-center justify-center gap-1">
            <Flame className="w-3 h-3 text-rose-500 fill-rose-500" />
            Hot Balls
          </span>
          <span className="text-xs font-black text-slate-800">
            {signal.hotNumbers.join(", ")}
          </span>
        </div>

        {/* Trend Pattern */}
        <div className="bg-white p-2 rounded-xl border border-slate-200/80 shadow-xs">
          <span className="text-[10px] text-slate-500 font-semibold uppercase block">
            Chart Pattern
          </span>
          <span className="text-xs font-bold text-slate-800 truncate block">
            {signal.pattern}
          </span>
        </div>
      </div>

      {/* 1-Click Apply AI Prediction Button */}
      <button
        type="button"
        disabled={isLocked}
        onClick={handleApplySignal}
        className="w-full py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-emerald-300 text-slate-900 font-black text-xs shadow-xs flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-40"
      >
        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
        <span>
          1-Click Apply AI Signal: Predict{" "}
          <strong className="text-game-green uppercase">{signal.color}</strong>
        </span>
      </button>
    </div>
  );
};

