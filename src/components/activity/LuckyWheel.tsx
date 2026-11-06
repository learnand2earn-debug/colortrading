"use client";

import React, { useState } from "react";
import { useGame } from "@/context/GameContext";
import { sound } from "@/lib/audio/sounds";
import { Sparkles, Trophy, Gift, ArrowRight } from "lucide-react";

const SLICES = [
  { label: "50 pts", points: 50, color: "#f59e0b", textColor: "#ffffff" },
  { label: "100 pts", points: 100, color: "#10b981", textColor: "#ffffff" },
  { label: "250 pts", points: 250, color: "#3b82f6", textColor: "#ffffff" },
  { label: "500 pts", points: 500, color: "#8b5cf6", textColor: "#ffffff" },
  { label: "1,000", points: 1000, color: "#ec4899", textColor: "#ffffff" },
  { label: "2,500", points: 2500, color: "#06b6d4", textColor: "#ffffff" },
  { label: "👑 5,000", points: 5000, color: "#eab308", textColor: "#000000" },
  { label: "75 pts", points: 75, color: "#64748b", textColor: "#ffffff" },
];

export const LuckyWheel: React.FC = () => {
  const { wheelSpinsRemaining, spinLuckyWheel } = useGame();
  const [spinning, setSpinning] = useState<boolean>(false);
  const [rotationDegrees, setRotationDegrees] = useState<number>(0);
  const [wonPrize, setWonPrize] = useState<number | null>(null);

  const numSlices = SLICES.length;
  const sliceAngle = 360 / numSlices;

  const handleSpin = () => {
    if (spinning || wheelSpinsRemaining <= 0) return;

    sound.playClick();
    setSpinning(true);
    setWonPrize(null);

    const result = spinLuckyWheel();
    if (!result.success) {
      setSpinning(false);
      return;
    }

    // Calculate rotation angle to land on result.sliceIndex
    // Target slice angle offset
    const targetSliceIndex = result.sliceIndex;
    const extraSpins = 5 + Math.floor(Math.random() * 3); // 5 to 7 full rotations
    // The top pointer is at 270 deg (or 0 deg top), slice index calculation:
    const targetAngle = 360 - (targetSliceIndex * sliceAngle + sliceAngle / 2);
    const finalRotation = rotationDegrees + (extraSpins * 360) + targetAngle - (rotationDegrees % 360);

    setRotationDegrees(finalRotation);

    setTimeout(() => {
      setSpinning(false);
      setWonPrize(result.prize);
    }, 4500);
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4 text-center">
      <div className="flex items-center justify-between">
        <div className="text-left">
          <span className="text-[10px] font-black text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full uppercase">
            Mini-Game Bonus
          </span>
          <h3 className="text-base sm:text-lg font-black text-slate-900 mt-1 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-500" />
            92 Lucky Wheel of Fortune
          </h3>
        </div>

        <span className="text-xs font-bold text-slate-500">
          Spins: <strong className="text-game-green">{wheelSpinsRemaining} left</strong>
        </span>
      </div>

      {/* The Visual Spinning Wheel */}
      <div className="relative w-64 h-64 sm:w-72 sm:h-72 mx-auto my-4 flex items-center justify-center">
        {/* Top Fixed Indicator Needle */}
        <div className="absolute -top-3 z-30 flex flex-col items-center">
          <div className="w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[22px] border-t-amber-500 drop-shadow-md" />
        </div>

        {/* Outer Golden Rim */}
        <div className="w-full h-full rounded-full border-8 border-amber-400 p-1.5 shadow-card-float bg-slate-900 overflow-hidden">
          {/* Rotating Canvas Disc */}
          <div
            style={{
              transform: `rotate(${rotationDegrees}deg)`,
              transition: spinning ? "transform 4.5s cubic-bezier(0.15, 0.9, 0.2, 1)" : "none",
            }}
            className="w-full h-full rounded-full relative overflow-hidden"
          >
            {/* SVG Wheel Slices */}
            <svg viewBox="0 0 100 100" className="w-full h-full">
              {SLICES.map((slice, i) => {
                const angle = (360 / numSlices) * i;
                const nextAngle = (360 / numSlices) * (i + 1);
                const x1 = 50 + 50 * Math.cos((Math.PI * (angle - 90)) / 180);
                const y1 = 50 + 50 * Math.sin((Math.PI * (angle - 90)) / 180);
                const x2 = 50 + 50 * Math.cos((Math.PI * (nextAngle - 90)) / 180);
                const y2 = 50 + 50 * Math.sin((Math.PI * (nextAngle - 90)) / 180);

                const textAngle = angle + sliceAngle / 2;
                const textRadius = 32;
                const tx = 50 + textRadius * Math.cos((Math.PI * (textAngle - 90)) / 180);
                const ty = 50 + textRadius * Math.sin((Math.PI * (textAngle - 90)) / 180);

                return (
                  <g key={i}>
                    <path
                      d={`M 50 50 L ${x1} ${y1} A 50 50 0 0 1 ${x2} ${y2} Z`}
                      fill={slice.color}
                      stroke="#ffffff"
                      strokeWidth="0.8"
                    />
                    <text
                      x={tx}
                      y={ty}
                      fill={slice.textColor}
                      fontSize="5"
                      fontWeight="900"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      transform={`rotate(${textAngle}, ${tx}, ${ty})`}
                    >
                      {slice.label}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Center Spin Hub Button */}
        <button
          type="button"
          disabled={spinning || wheelSpinsRemaining <= 0}
          onClick={handleSpin}
          className="absolute z-20 w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-600 border-4 border-white shadow-neon-amber flex flex-col items-center justify-center font-black text-slate-900 active:scale-95 hover:scale-105 transition-transform disabled:opacity-75 disabled:cursor-not-allowed select-none"
        >
          <span className="text-[10px] font-extrabold uppercase leading-none">92</span>
          <span className="text-xs font-black tracking-tight leading-none mt-0.5">SPIN</span>
        </button>
      </div>

      {/* Won Prize Banner */}
      {wonPrize !== null && (
        <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 text-sm font-black flex items-center justify-center gap-2 animate-bounce">
          <Trophy className="w-5 h-5 text-amber-500" />
          <span>You Won +{new Intl.NumberFormat("en-US").format(wonPrize)} Virtual Points!</span>
        </div>
      )}

      {/* Action Footer */}
      <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
        <span>1 Free daily spin resets every 24 hours</span>
        <button
          type="button"
          disabled={spinning || wheelSpinsRemaining <= 0}
          onClick={handleSpin}
          className="px-4 py-2 rounded-xl bg-game-green text-white font-bold hover:brightness-105 disabled:opacity-40"
        >
          {spinning ? "Spinning..." : "Spin Wheel"}
        </button>
      </div>
    </div>
  );
};

