"use client";

import React from "react";
import Image from "next/image";
import { RoundHeader } from "./RoundHeader";
import { ColorButtons } from "./ColorButtons";
import { NumberGrid } from "./NumberGrid";
import { MultiplierQuickBar } from "./MultiplierQuickBar";
import { BigSmallButtons } from "./BigSmallButtons";
import { HistorySection } from "./HistorySection";
import { BetModal } from "./BetModal";
import { ResultPopupModal } from "./ResultPopupModal";
import { SupportWidget } from "@/components/support/SupportWidget";
import { AiSignalWidget } from "./AiSignalWidget";
import { useGame } from "@/context/GameContext";

export const WinGoArena: React.FC = () => {
  const { user } = useGame();

  return (
    <div className="w-full space-y-4">
      {/* Top Banner with 92 Lucky Logo & Virtual Balance */}
      <div className="flex flex-col sm:flex-row items-center justify-between p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-sm gap-2">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl overflow-hidden border border-amber-400 shrink-0 shadow-sm">
            <Image
              src="/logo.png"
              alt="92 Lucky"
              width={36}
              height={36}
              className="object-cover w-full h-full"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-slate-900 text-sm tracking-tight">
                92 LUCKY COLOR TRADING
              </span>
              <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-bold">
                100% Free Simulator
              </span>
            </div>
            <span className="text-[11px] text-slate-500">
              Provably Fair SHA-256 Outcomes · Zero Real Money Risk
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center">
          <div className="text-right">
            <span className="text-[10px] text-slate-400 block font-semibold uppercase">
              Virtual Wallet
            </span>
            <span className="font-mono font-black text-game-green text-base">
              {new Intl.NumberFormat("en-US").format(user.virtual_points)} pts
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: On desktop it's a 2-column layout (7 / 5), on mobile it stacks! */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Left Column: Round Countdown, AI Signal & Betting Controls */}
        <div className="lg:col-span-7 space-y-3">
          {/* Synchronized Round Header (Durations, Period ID, Live Countdown) */}
          <RoundHeader />

          {/* Smart AI Signal Forecast Widget */}
          <AiSignalWidget />

          {/* Main Betting Controls Board (White luxury card) */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-sm space-y-2">
            {/* Color Prediction Primary Buttons: Green, Violet, Red */}
            <ColorButtons />

            {/* Direct Number Grid: 0 to 9 in two rows with glossy 3D spheres */}
            <NumberGrid />

            {/* Multiplier Quick Chips: Random + X1..X100 */}
            <MultiplierQuickBar />

            {/* Big vs Small Buttons */}
            <BigSmallButtons />
          </div>
        </div>

        {/* Right Column: History, Trend Chart & Player Bets */}
        <div className="lg:col-span-5 space-y-3">
          <HistorySection />
        </div>
      </div>

      {/* Modals & Floating Widgets */}
      <BetModal />
      <ResultPopupModal />
      <SupportWidget />
    </div>
  );
};
