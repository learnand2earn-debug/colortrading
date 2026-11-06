import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { ColorResult } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPoints(points: number): string {
  return new Intl.NumberFormat("en-US").format(points);
}

export function generatePeriodId(date: Date = new Date(), sequence: number = 100010001): string {
  const yyyy = date.getFullYear().toString();
  const mm = (date.getMonth() + 1).toString().padStart(2, "0");
  const dd = date.getDate().toString().padStart(2, "0");
  const seqStr = sequence.toString().padStart(9, "0");
  return `${yyyy}${mm}${dd}${seqStr}`;
}

export function getColorForNumber(num: number): {
  type: ColorResult;
  label: string;
  bgClass: string;
  dotColor: string;
} {
  if (num === 0) {
    return {
      type: "red_violet",
      label: "Red + Violet",
      bgClass: "bg-gradient-to-r from-game-red via-game-red to-game-violet",
      dotColor: "#ff2a4b",
    };
  }
  if (num === 5) {
    return {
      type: "green_violet",
      label: "Green + Violet",
      bgClass: "bg-gradient-to-r from-game-green via-game-green to-game-violet",
      dotColor: "#00e676",
    };
  }
  if ([1, 3, 7, 9].includes(num)) {
    return {
      type: "green",
      label: "Green",
      bgClass: "bg-game-green",
      dotColor: "#00e676",
    };
  }
  return {
    type: "red",
    label: "Red",
    bgClass: "bg-game-red",
    dotColor: "#ff2a4b",
  };
}

export function getBigSmall(num: number): "Big" | "Small" {
  return num >= 5 ? "Big" : "Small";
}

export function formatCountdown(secondsRemaining: number): {
  minutes: string;
  seconds: string;
} {
  const safeSec = Math.max(0, Math.floor(secondsRemaining));
  const mins = Math.floor(safeSec / 60);
  const secs = safeSec % 60;
  return {
    minutes: mins.toString().padStart(2, "0"),
    seconds: secs.toString().padStart(2, "0"),
  };
}

