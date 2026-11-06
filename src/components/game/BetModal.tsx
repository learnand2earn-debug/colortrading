"use client";

import React, { useState, useEffect } from "react";
import { useGame } from "@/context/GameContext";
import { Coins, X, AlertCircle } from "lucide-react";
import { ColorSelection, BigSmallSelection, NumberSelection } from "@/types";

export const BetModal: React.FC = () => {
  const { activeBetModal, closeBetModal, placeBet, user, isLocked } = useGame();

  const [baseAmount, setBaseAmount] = useState<number>(10);
  const [multiplier, setMultiplier] = useState<number>(1);
  const [agreed, setAgreed] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string>("");

  useEffect(() => {
    if (activeBetModal) {
      setBaseAmount(10);
      setMultiplier(1);
      setErrorMsg("");
    }
  }, [activeBetModal]);

  if (!activeBetModal || !activeBetModal.isOpen) return null;

  const totalPoints = baseAmount * multiplier;
  const isInsufficient = totalPoints > user.virtual_points;

  let odds = 2.0;
  if (activeBetModal.betType === "number") odds = 9.0;
  else if (activeBetModal.betType === "color" && activeBetModal.selection === "violet") odds = 4.5;

  const potentialWin = Math.round(totalPoints * odds);

  const baseAmounts = [10, 50, 100, 500, 1000, 5000];
  const multipliers = [1, 5, 10, 20, 50, 100];

  const handleConfirm = () => {
    if (isInsufficient) {
      setErrorMsg("Insufficient virtual points balance.");
      return;
    }
    if (isLocked) {
      setErrorMsg("Round is locked. Please wait for the next period.");
      return;
    }
    if (!agreed) {
      setErrorMsg("Please accept the free simulator rules.");
      return;
    }

    const res = placeBet({
      betType: activeBetModal.betType,
      selection: activeBetModal.selection as ColorSelection | BigSmallSelection | NumberSelection,
      amount: baseAmount,
      multiplier,
    });

    if (!res.success) {
      setErrorMsg(res.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white border-t sm:border border-slate-200 rounded-t-3xl sm:rounded-3xl max-w-md w-full p-5 sm:p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <span
              className={`px-3 py-1 rounded-full text-xs font-black uppercase text-white shadow-sm ${activeBetModal.badgeColor}`}
            >
              {activeBetModal.selection}
            </span>
            <h3 className="text-base font-black text-slate-900">
              {activeBetModal.title}
            </h3>
          </div>
          <button
            type="button"
            onClick={closeBetModal}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Balance Display */}
        <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200">
          <span className="text-xs text-slate-600 font-semibold flex items-center gap-1.5">
            <Coins className="w-4 h-4 text-amber-500" />
            Available Virtual Points:
          </span>
          <span className="font-mono font-black text-game-green text-sm">
            {new Intl.NumberFormat("en-US").format(user.virtual_points)} pts
          </span>
        </div>

        {/* Base Points Selector */}
        <div>
          <label className="text-xs font-bold text-slate-700 block mb-2">
            Select Base Points:
          </label>
          <div className="grid grid-cols-3 gap-2">
            {baseAmounts.map((amt) => {
              const isSelected = baseAmount === amt;
              return (
                <button
                  key={amt}
                  type="button"
                  onClick={() => {
                    setBaseAmount(amt);
                    setErrorMsg("");
                  }}
                  className={`py-2 px-1 text-xs font-black rounded-xl border transition-all ${
                    isSelected
                      ? "bg-game-green text-white border-game-green shadow-sm"
                      : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {amt} pts
                </button>
              );
            })}
          </div>
        </div>

        {/* Multiplier Selector */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold text-slate-700">
              Multiplier (X):
            </label>
            <span className="text-xs font-mono font-black text-amber-600">
              X{multiplier}
            </span>
          </div>
          <div className="grid grid-cols-6 gap-1.5">
            {multipliers.map((m) => {
              const isSelected = multiplier === m;
              return (
                <button
                  key={m}
                  type="button"
                  onClick={() => {
                    setMultiplier(m);
                    setErrorMsg("");
                  }}
                  className={`py-1.5 text-xs font-black rounded-xl border transition-all ${
                    isSelected
                      ? "bg-amber-500 text-white border-amber-500 shadow-sm"
                      : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  X{m}
                </button>
              );
            })}
          </div>
        </div>

        {/* Summary Card */}
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs">
          <div className="flex justify-between text-slate-700">
            <span className="font-medium">Total Simulated Wager:</span>
            <span className="font-mono font-black text-slate-900 text-sm">
              {new Intl.NumberFormat("en-US").format(totalPoints)} pts
            </span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span className="font-medium">Potential Payout ({odds}x):</span>
            <span className="font-mono font-black text-game-green text-sm">
              ~{new Intl.NumberFormat("en-US").format(potentialWin)} pts
            </span>
          </div>
        </div>

        {/* Error Message */}
        {errorMsg && (
          <div className="flex items-center gap-1.5 text-xs text-rose-600 bg-rose-50 p-2.5 rounded-xl border border-rose-200">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Free Simulator Acknowledgment */}
        <label className="flex items-start gap-2 cursor-pointer text-[11px] text-slate-500 select-none">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-0.5 rounded border-slate-300 text-game-green focus:ring-0"
          />
          <span>
            I acknowledge this is a free educational simulation with zero cash value.
          </span>
        </label>

        {/* Confirm Action Button */}
        <button
          type="button"
          disabled={isInsufficient || isLocked || !agreed}
          onClick={handleConfirm}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-game-green to-emerald-600 text-white font-black text-sm shadow-neon-green hover:brightness-105 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {isLocked
            ? "Period Locked"
            : isInsufficient
            ? "Insufficient Points"
            : `Confirm Prediction (${new Intl.NumberFormat("en-US").format(totalPoints)} pts)`}
        </button>
      </div>
    </div>
  );
};
