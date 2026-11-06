import { Metadata } from "next";
import { WinGoArena } from "@/components/game/WinGoArena";

export const metadata: Metadata = {
  title: "Win Go Arena - Lumina Colour Prediction Platform",
  description: "Live 30s, 1m, 3m, and 5m provably fair colour prediction rounds.",
};

export default function GamePage() {
  return <WinGoArena />;
}

