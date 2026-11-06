"use client";

import React from "react";
import { useGame } from "@/context/GameContext";
import { NumberBall } from "./NumberBall";
import { Trophy, Frown, X, ArrowRight } from "lucide-react";

export const ResultPopupModal: React.FC = () => {
  const { lastResultPopup, closeLastResultPopup } = useGame();

  if (!lastResultPopup || !lastResultPopup.isOpen || !lastResultPopup.round) {
    return null;
  }

  const { round, userWonAmount, userLostAmount } = lastResultPopup;
  const isWinner = userWonAmount > 0;
  const num = round.result_number ?? 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative overflow-hidden bg-white border border-slate-200 rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl">
        {/* Close Button */}
        <button
          type="button"
          onClick={closeLastResultPopup}
          className="absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icon Header */}
        <div className="flex justify-center mb-3">
          {isWinner ? (
            <div className="w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-400 flex items-center justify-center shadow-neon-green animate-bounce">
              <Trophy className="w-8 h-8 text-game-green" />
            </div>
          ) : (
            <div className="w-16 h-16 rounded-full bg-rose-50 border-2 border-rose-300 flex items-center justify-center">
              <Frown className="w-8 h-8 text-rose-500" />
            </div>
          )}
        </div>

        {/* Title */}
        <h3 className="text-xl font-black text-slate-900 mb-1">
          {isWinner ? "Prediction Victory! 🎉" : "Round Result"}
        </h3>
        <p className="text-xs text-slate-500 font-mono mb-4">
          Period: {round.period_id}
        </p>

        {/* Winning Number Chip */}
        <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-50 border border-slate-200 mb-4">
          <span className="text-[11px] text-slate-500 uppercase font-bold mb-2">
            Winning Outcome
          </span>
          <NumberBall number={num} size="lg" />
          <div className="flex items-center gap-2 mt-3">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-white border border-slate-200 text-slate-800 capitalize shadow-sm">
              {round.result_color?.replace("_", " + ")}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-white border border-slate-200 text-amber-600 capitalize shadow-sm">
              {round.result_big_small}
            </span>
          </div>
        </div>

        {/* Points Result Tag */}
        <div className="mb-5">
          {isWinner ? (
            <div className="py-2.5 px-3 rounded-2xl bg-emerald-50 border border-emerald-300 text-game-green font-black text-lg">
              +{new Intl.NumberFormat("en-US").format(userWonAmount)} Virtual Points!
            </div>
          ) : (
            <div className="py-2.5 px-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 font-semibold text-sm">
              Lost {new Intl.NumberFormat("en-US").format(userLostAmount)} Points. Keep practicing!
            </div>
          )}
        </div>

        {/* Continue Button */}
        <button
          type="button"
          onClick={closeLastResultPopup}
          className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-game-green text-white font-black text-sm shadow-neon-green hover:brightness-105 active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          <span>Continue Trading</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
