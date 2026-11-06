"use client";

import React, { useState } from "react";
import { useGame } from "@/context/GameContext";
import { Trophy, Crown } from "lucide-react";

export default function LeaderboardPage() {
  const { user } = useGame();
  const [timeframe, setTimeframe] = useState<"daily" | "weekly" | "monthly" | "allTime">("daily");

  const leaderboardData = [
    {
      rank: 1,
      username: "LuckyKing_92",
      points: 148500,
      accuracy: 81.4,
      wins: 164,
      avatar: "LK",
    },
    {
      rank: 2,
      username: "ZenithTrader",
      points: 112200,
      accuracy: 76.2,
      wins: 129,
      avatar: "ZT",
    },
    {
      rank: 3,
      username: "ApexMaster",
      points: 94400,
      accuracy: 72.9,
      wins: 112,
      avatar: "AM",
    },
    {
      rank: 4,
      username: "NeonStrike",
      points: 71100,
      accuracy: 70.5,
      wins: 89,
      avatar: "NS",
    },
    {
      rank: 5,
      username: "QuantumAce",
      points: 58300,
      accuracy: 68.8,
      wins: 71,
      avatar: "QA",
    },
    {
      rank: 6,
      username: user.username,
      points: user.virtual_points,
      accuracy: user.accuracy_percentage,
      wins: user.total_wins,
      avatar: "ME",
      isCurrentUser: true,
    },
    {
      rank: 7,
      username: "DragonRider",
      points: 44200,
      accuracy: 65.4,
      wins: 58,
      avatar: "DR",
    },
    {
      rank: 8,
      username: "ShadowFalcon",
      points: 39900,
      accuracy: 63.2,
      wins: 51,
      avatar: "SF",
    },
  ];

  const top1 = leaderboardData[0];
  const top2 = leaderboardData[1];
  const top3 = leaderboardData[2];

  return (
    <div className="w-full space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-1">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-300 text-amber-700 text-xs font-bold">
          <Trophy className="w-3.5 h-3.5" />
          <span>92 Lucky Points Hall of Fame</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Global Leaderboard</h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Top predictors ranked strictly by simulated virtual points
        </p>
      </div>

      {/* Timeframe Switcher */}
      <div className="grid grid-cols-4 gap-1.5 p-1.5 bg-slate-100 rounded-2xl border border-slate-200 max-w-md mx-auto">
        {(["daily", "weekly", "monthly", "allTime"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTimeframe(t)}
            className={`py-2 text-xs font-bold rounded-xl capitalize transition-all ${
              timeframe === t
                ? "bg-game-green text-white font-black shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            {t === "allTime" ? "All Time" : t}
          </button>
        ))}
      </div>

      {/* Top 3 Podium Cards */}
      <div className="grid grid-cols-3 gap-2.5 sm:gap-4 items-end pt-10 pb-2 max-w-2xl mx-auto">
        {/* #2 Silver Podium */}
        <div className="flex flex-col items-center bg-white border border-slate-300 rounded-3xl p-3 sm:p-4 text-center relative shadow-sm">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-tr from-slate-300 to-slate-100 text-slate-800 font-black text-sm flex items-center justify-center border-2 border-slate-300 shadow-md -mt-9 sm:-mt-11 mb-2">
            {top2.avatar}
          </div>
          <span className="text-[10px] font-black text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-300 mb-1">
            #2 SILVER
          </span>
          <span className="text-xs sm:text-sm font-bold text-slate-900 truncate max-w-[100px]">
            {top2.username}
          </span>
          <span className="font-mono text-xs sm:text-sm font-black text-game-green mt-1">
            {new Intl.NumberFormat("en-US").format(top2.points)} pts
          </span>
          <span className="text-[10px] text-slate-500">{top2.accuracy}% Win</span>
        </div>

        {/* #1 Gold Champion Podium */}
        <div className="flex flex-col items-center bg-gradient-to-b from-amber-50 to-white border-2 border-amber-400 rounded-3xl p-4 sm:p-5 text-center relative shadow-card-float scale-105 z-10">
          <Crown className="w-7 h-7 text-amber-500 absolute -top-12 animate-bounce" />
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-amber-400 via-yellow-300 to-amber-500 text-slate-900 font-black text-base flex items-center justify-center border-2 border-white shadow-md -mt-11 sm:-mt-13 mb-2">
            {top1.avatar}
          </div>
          <span className="text-[10px] font-black text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-300 mb-1">
            #1 GOLD
          </span>
          <span className="text-xs sm:text-sm font-black text-slate-900 truncate max-w-[110px]">
            {top1.username}
          </span>
          <span className="font-mono text-sm sm:text-base font-black text-amber-600 mt-1">
            {new Intl.NumberFormat("en-US").format(top1.points)} pts
          </span>
          <span className="text-[10px] text-slate-600 font-semibold">{top1.accuracy}% Win</span>
        </div>

        {/* #3 Bronze Podium */}
        <div className="flex flex-col items-center bg-white border border-amber-200 rounded-3xl p-3 sm:p-4 text-center relative shadow-sm">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-tr from-amber-600 to-amber-400 text-white font-black text-sm flex items-center justify-center border-2 border-amber-300 shadow-md -mt-9 sm:-mt-11 mb-2">
            {top3.avatar}
          </div>
          <span className="text-[10px] font-black text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 mb-1">
            #3 BRONZE
          </span>
          <span className="text-xs sm:text-sm font-bold text-slate-900 truncate max-w-[100px]">
            {top3.username}
          </span>
          <span className="font-mono text-xs sm:text-sm font-black text-game-green mt-1">
            {new Intl.NumberFormat("en-US").format(top3.points)} pts
          </span>
          <span className="text-[10px] text-slate-500">{top3.accuracy}% Win</span>
        </div>
      </div>

      {/* Ranks 4 to 8 Table */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-4 shadow-sm space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-slate-500 px-3 pb-2 border-b border-slate-100">
          <span>Rank & Player</span>
          <div className="flex gap-6">
            <span>Accuracy</span>
            <span>Virtual Points</span>
          </div>
        </div>

        {leaderboardData.slice(3).map((item) => (
          <div
            key={item.username}
            className={`flex items-center justify-between p-3 rounded-2xl border text-xs transition-colors ${
              item.isCurrentUser
                ? "bg-emerald-50 border-emerald-300 text-slate-900 shadow-sm"
                : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="w-6 text-center font-mono font-bold text-slate-500">
                #{item.rank}
              </span>
              <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center font-bold text-xs text-game-green shadow-sm">
                {item.avatar}
              </div>
              <div>
                <span className="font-bold text-slate-900 block">
                  {item.username}
                  {item.isCurrentUser && (
                    <span className="ml-1.5 text-[9px] bg-game-green text-white px-1.5 py-0.2 rounded font-black uppercase">
                      YOU
                    </span>
                  )}
                </span>
                <span className="text-[10px] text-slate-500">{item.wins} Wins</span>
              </div>
            </div>

            <div className="flex items-center gap-6 text-right">
              <span className="text-slate-600 font-semibold">{item.accuracy}%</span>
              <span className="font-mono font-black text-game-green text-sm sm:text-base">
                {new Intl.NumberFormat("en-US").format(item.points)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
