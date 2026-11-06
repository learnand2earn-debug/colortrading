"use client";

import React from "react";
import { useGame } from "@/context/GameContext";

export const BigSmallButtons: React.FC = () => {
  const { openBetModal, isLocked } = useGame();

  return (
    <div className="grid grid-cols-2 gap-3 my-2.5">
      {/* Big Button (Numbers 5 - 9) */}
      <button
        type="button"
        disabled={isLocked}
        onClick={() => openBetModal("big_small", "big", "Join Big (5 - 9)", "bg-amber-500 text-white")}
        className="relative group overflow-hidden py-3 px-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white font-bold shadow-neon-amber transition-all duration-200 active:scale-95 hover:brightness-105 disabled:opacity-50 disabled:cursor-not-allowed border border-amber-400"
      >
        <span className="absolute inset-0 bg-white/15 opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="flex items-center justify-between px-1">
          <div className="flex flex-col text-left">
            <span className="text-base sm:text-lg font-black tracking-wide drop-shadow-sm">Big</span>
            <span className="text-[10px] text-amber-100 font-medium">5, 6, 7, 8, 9</span>
          </div>
          <div className="text-xs font-black bg-black/20 px-2.5 py-1 rounded-lg border border-white/20">
            2x
          </div>
        </div>
      </button>

      {/* Small Button (Numbers 0 - 4) */}
      <button
        type="button"
        disabled={isLocked}
        onClick={() => openBetModal("big_small", "small", "Join Small (0 - 4)", "bg-blue-500 text-white")}
        className="relative group overflow-hidden py-3 px-3.5 rounded-2xl bg-gradient-to-r from-blue-500 via-indigo-600 to-cyan-600 text-white font-bold shadow-neon-blue transition-all duration-200 active:scale-95 hover:brightness-105 disabled:opacity-50 disabled:cursor-not-allowed border border-blue-400"
      >
        <span className="absolute inset-0 bg-white/15 opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="flex items-center justify-between px-1">
          <div className="flex flex-col text-left">
            <span className="text-base sm:text-lg font-black tracking-wide drop-shadow-sm">Small</span>
            <span className="text-[10px] text-blue-100 font-medium">0, 1, 2, 3, 4</span>
          </div>
          <div className="text-xs font-black bg-black/20 px-2.5 py-1 rounded-lg border border-white/20">
            2x
          </div>
        </div>
      </button>
    </div>
  );
};
