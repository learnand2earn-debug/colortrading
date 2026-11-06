"use client";

import React, { useState } from "react";
import { useGame } from "@/context/GameContext";
import { Shuffle } from "lucide-react";

interface MultiplierQuickBarProps {
  selectedMultiplier?: number;
  onSelectMultiplier?: (multiplier: number) => void;
}

export const MultiplierQuickBar: React.FC<MultiplierQuickBarProps> = ({
  selectedMultiplier = 1,
  onSelectMultiplier,
}) => {
  const { openBetModal, isLocked } = useGame();
  const [activeMult, setActiveMult] = useState<number>(selectedMultiplier);

  const multipliers = [1, 5, 10, 20, 50, 100];

  const handleRandomPick = () => {
    if (isLocked) return;
    const randomNum = Math.floor(Math.random() * 10);
    openBetModal(
      "number",
      String(randomNum),
      `Lucky Random: Number ${randomNum}`,
      "bg-amber-500 text-white"
    );
  };

  const handleMultClick = (m: number) => {
    setActiveMult(m);
    if (onSelectMultiplier) {
      onSelectMultiplier(m);
    }
  };

  return (
    <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto py-2 scrollbar-none my-1">
      {/* Random Button */}
      <button
        type="button"
        disabled={isLocked}
        onClick={handleRandomPick}
        className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-rose-300 bg-rose-50 text-rose-600 text-xs font-bold hover:bg-rose-100 active:scale-95 transition-all whitespace-nowrap shadow-sm disabled:opacity-40"
      >
        <Shuffle className="w-3.5 h-3.5" />
        <span>Random</span>
      </button>

      {/* Multiplier tags */}
      {multipliers.map((m) => {
        const isCurrent = activeMult === m;
        return (
          <button
            key={m}
            type="button"
            onClick={() => handleMultClick(m)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap border ${
              isCurrent
                ? "bg-game-green text-white border-game-green shadow-sm scale-105"
                : "bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200"
            }`}
          >
            X{m}
          </button>
        );
      })}
    </div>
  );
};
