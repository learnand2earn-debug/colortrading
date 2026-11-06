"use client";

import React from "react";
import { useGame } from "@/context/GameContext";

export const ColorButtons: React.FC = () => {
  const { openBetModal, isLocked } = useGame();

  return (
    <div className="grid grid-cols-3 gap-2.5 sm:gap-3 my-2.5">
      {/* Green Button */}
      <button
        type="button"
        disabled={isLocked}
        onClick={() => openBetModal("color", "green", "Join Green", "bg-game-green text-white")}
        className="relative group overflow-hidden py-3 px-2 rounded-2xl bg-gradient-to-r from-emerald-500 via-game-green to-emerald-600 text-white font-black shadow-neon-green transition-all duration-200 active:scale-95 hover:brightness-105 disabled:opacity-50 disabled:cursor-not-allowed border border-emerald-400"
      >
        <span className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="flex flex-col items-center">
          <span className="text-base sm:text-lg font-black tracking-wide drop-shadow-sm">Green</span>
          <span className="text-[11px] font-bold text-emerald-100 tracking-tight">2x Payout</span>
        </div>
      </button>

      {/* Violet Button */}
      <button
        type="button"
        disabled={isLocked}
        onClick={() => openBetModal("color", "violet", "Join Violet", "bg-game-violet text-white")}
        className="relative group overflow-hidden py-3 px-2 rounded-2xl bg-gradient-to-r from-purple-600 via-game-violet to-fuchsia-600 text-white font-black shadow-neon-violet transition-all duration-200 active:scale-95 hover:brightness-105 disabled:opacity-50 disabled:cursor-not-allowed border border-purple-400"
      >
        <span className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="flex flex-col items-center">
          <span className="text-base sm:text-lg font-black tracking-wide drop-shadow-sm">Violet</span>
          <span className="text-[11px] font-bold text-purple-100 tracking-tight">4.5x Payout</span>
        </div>
      </button>

      {/* Red Button */}
      <button
        type="button"
        disabled={isLocked}
        onClick={() => openBetModal("color", "red", "Join Red", "bg-game-red text-white")}
        className="relative group overflow-hidden py-3 px-2 rounded-2xl bg-gradient-to-r from-rose-500 via-game-red to-red-600 text-white font-black shadow-neon-red transition-all duration-200 active:scale-95 hover:brightness-105 disabled:opacity-50 disabled:cursor-not-allowed border border-rose-400"
      >
        <span className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="flex flex-col items-center">
          <span className="text-base sm:text-lg font-black tracking-wide drop-shadow-sm">Red</span>
          <span className="text-[11px] font-bold text-rose-100 tracking-tight">2x Payout</span>
        </div>
      </button>
    </div>
  );
};
