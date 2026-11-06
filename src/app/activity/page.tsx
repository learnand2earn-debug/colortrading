"use client";

import React from "react";
import { useGame } from "@/context/GameContext";
import { Gift, Sparkles, CheckCircle2, Flame, Award, Calendar } from "lucide-react";
import { LuckyWheel } from "@/components/activity/LuckyWheel";

export default function ActivityPage() {
  const { user, streakCount, dailyClaimedToday, claimDailyReward } = useGame();

  const streakDays = [
    { day: 1, points: 100 },
    { day: 2, points: 150 },
    { day: 3, points: 250 },
    { day: 4, points: 350 },
    { day: 5, points: 500 },
    { day: 6, points: 750 },
    { day: 7, points: 1000, special: true },
  ];

  const currentActiveDay = (streakCount % 7) || 7;

  return (
    <div className="w-full space-y-5 max-w-4xl mx-auto">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-50 via-orange-50 to-yellow-50 border border-amber-200/80 p-5 sm:p-7 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-400 text-amber-700 text-xs font-bold mb-2">
              <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span>{streakCount} Day Streak Active</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">Activity & Rewards</h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Claim free virtual points every 24 hours & spin the Lucky Wheel!
            </p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-md">
            <Gift className="w-7 h-7" />
          </div>
        </div>
      </div>

      {/* 92 Lucky Wheel of Fortune Mini-Game */}
      <LuckyWheel />

      {/* 7-Day Streak Calendar */}
      <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-game-green" />
            <span>7-Day Daily Sign-in Streak</span>
          </h2>
          <span className="text-xs font-mono font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
            Day {currentActiveDay} / 7
          </span>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-7 gap-2.5">
          {streakDays.map((s) => {
            const isCompleted = s.day < currentActiveDay;
            const isCurrent = s.day === currentActiveDay;

            return (
              <div
                key={s.day}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition-all ${
                  isCompleted
                    ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                    : isCurrent
                    ? "bg-amber-100 border-amber-400 shadow-md text-amber-900 scale-105"
                    : "bg-slate-50 border-slate-200 text-slate-400"
                }`}
              >
                <span className="text-[10px] font-bold uppercase mb-1">
                  Day {s.day}
                </span>

                <div className="my-1">
                  {isCompleted ? (
                    <CheckCircle2 className="w-5 h-5 text-game-green" />
                  ) : s.special ? (
                    <Award className="w-5 h-5 text-amber-500 animate-bounce" />
                  ) : (
                    <Gift className={`w-5 h-5 ${isCurrent ? "text-amber-600" : "text-slate-400"}`} />
                  )}
                </div>

                <span className="text-xs font-mono font-black mt-0.5">
                  +{s.points}
                </span>
              </div>
            );
          })}
        </div>

        {/* Claim Action Button */}
        <button
          type="button"
          disabled={dailyClaimedToday}
          onClick={claimDailyReward}
          className={`w-full py-4 rounded-2xl font-black text-sm transition-all flex items-center justify-center gap-2 ${
            dailyClaimedToday
              ? "bg-slate-100 border border-slate-200 text-slate-400 cursor-not-allowed"
              : "bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 text-slate-900 shadow-md hover:brightness-105 active:scale-95 animate-pulse"
          }`}
        >
          <Gift className="w-4 h-4" />
          <span>
            {dailyClaimedToday
              ? "Today's Bonus Already Claimed · Check Back Tomorrow"
              : "Claim Today's Free Virtual Points!"}
          </span>
        </button>
      </div>

      {/* Daily Simulation Quests */}
      <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-3">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-game-green" />
          <span>Daily Virtual Missions</span>
        </h3>

        <div className="space-y-2.5">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
            <div>
              <div className="font-bold text-slate-900">Play 3 Win Go rounds</div>
              <div className="text-[11px] text-slate-500">Progress: 2 / 3 rounds completed</div>
            </div>
            <span className="font-mono font-bold text-amber-700 bg-amber-100 px-2.5 py-1 rounded-lg border border-amber-300">
              +100 pts
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
            <div>
              <div className="font-bold text-slate-900">Win 1 Big or Small prediction</div>
              <div className="text-[11px] text-game-green font-bold">Completed!</div>
            </div>
            <span className="font-mono font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-lg border border-emerald-300">
              Claimed
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
            <div>
              <div className="font-bold text-slate-900">Pick a Lucky Random number</div>
              <div className="text-[11px] text-slate-500">Progress: 0 / 1</div>
            </div>
            <span className="font-mono font-bold text-amber-700 bg-amber-100 px-2.5 py-1 rounded-lg border border-amber-300">
              +50 pts
            </span>
          </div>
        </div>
      </div>

      {/* VIP Tier Progression */}
      <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-game-green border border-emerald-200 flex items-center justify-center font-black text-xs">
              VIP
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">Tier Level 2 Member</h4>
              <span className="text-[10px] text-slate-500">Level up by playing more rounds</span>
            </div>
          </div>
          <span className="text-xs font-mono font-bold text-game-green">
            {user.total_rounds_played} / 100 Rounds
          </span>
        </div>

        <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
          <div
            style={{ width: `${Math.min(100, (user.total_rounds_played / 100) * 100)}%` }}
            className="h-full bg-gradient-to-r from-emerald-500 to-game-green"
          />
        </div>
      </div>
    </div>
  );
}
