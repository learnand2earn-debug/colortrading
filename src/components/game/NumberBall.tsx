"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface NumberBallProps {
  number: number;
  isSelected?: boolean;
  onClick?: () => void;
  size?: "sm" | "md" | "lg";
}

export const NumberBall: React.FC<NumberBallProps> = ({
  number,
  isSelected = false,
  onClick,
  size = "md",
}) => {
  const sizeClasses = {
    sm: "w-8 h-8 text-xs",
    md: "w-11 h-11 text-base sm:w-13 sm:h-13 sm:text-lg",
    lg: "w-16 h-16 text-xl",
  };

  const isGreen = [1, 3, 7, 9].includes(number);
  const isRed = [2, 4, 6, 8].includes(number);
  const isZero = number === 0;
  const isFive = number === 5;

  let gradientBg = "";
  let glowColor = "";
  let ringClasses = "";

  if (isZero) {
    // Red + Violet split
    gradientBg = "bg-gradient-to-tr from-purple-600 via-game-violet to-game-red";
    glowColor = "shadow-[0_4px_12px_rgba(139,92,246,0.4)]";
    ringClasses = "border-2 border-white/80";
  } else if (isFive) {
    // Green + Violet split
    gradientBg = "bg-gradient-to-tr from-purple-600 via-game-violet to-game-green";
    glowColor = "shadow-[0_4px_12px_rgba(0,184,92,0.4)]";
    ringClasses = "border-2 border-white/80";
  } else if (isGreen) {
    gradientBg = "bg-gradient-to-br from-emerald-400 via-game-green to-emerald-600";
    glowColor = "shadow-[0_4px_12px_rgba(0,184,92,0.4)]";
    ringClasses = "border-2 border-white/80";
  } else {
    gradientBg = "bg-gradient-to-br from-rose-400 via-game-red to-red-600";
    glowColor = "shadow-[0_4px_12px_rgba(239,68,68,0.4)]";
    ringClasses = "border-2 border-white/80";
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative rounded-full flex items-center justify-center font-bold tracking-wider transition-all duration-200 select-none",
        sizeClasses[size],
        gradientBg,
        glowColor,
        ringClasses,
        "hover:scale-110 active:scale-95 cursor-pointer shadow-md",
        isSelected && "ring-4 ring-amber-400 scale-110 animate-pulse"
      )}
    >
      {/* 3D Glossy Specular Light Reflection Highlight */}
      <span className="absolute top-1 left-2 w-3/5 h-2/5 rounded-full bg-gradient-to-b from-white/70 to-transparent pointer-events-none transform -rotate-12" />

      {/* Subtle inner edge bevel */}
      <span className="absolute inset-1 rounded-full border border-white/30 pointer-events-none" />

      {/* Number text with shadow */}
      <span className="relative z-10 text-white font-black drop-shadow-[0_2px_3px_rgba(0,0,0,0.6)]">
        {number}
      </span>

      {/* Bottom curvature shadow */}
      <span className="absolute bottom-1 w-3/4 h-1/4 rounded-full bg-black/20 blur-[1px] pointer-events-none" />
    </button>
  );
};
