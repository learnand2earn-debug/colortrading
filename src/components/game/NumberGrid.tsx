"use client";

import React from "react";
import { NumberBall } from "./NumberBall";
import { useGame } from "@/context/GameContext";

export const NumberGrid: React.FC = () => {
  const { openBetModal, isLocked } = useGame();

  const handleBallClick = (num: number) => {
    if (isLocked) return;
    openBetModal("number", String(num), `Select Number ${num}`, "bg-slate-800 text-white");
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 sm:p-4 my-3 shadow-sm">
      <div className="flex items-center justify-between mb-3 px-1">
        <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
          Direct Numbers (0-9)
        </span>
        <span className="text-xs font-extrabold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
          9x Payout
        </span>
      </div>

      <div className="grid grid-cols-5 gap-2.5 sm:gap-3.5 place-items-center">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <div key={num} className="flex flex-col items-center">
            <NumberBall number={num} onClick={() => handleBallClick(num)} />
          </div>
        ))}
      </div>
    </div>
  );
};
