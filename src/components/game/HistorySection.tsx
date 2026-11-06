"use client";

import React, { useState } from "react";
import { useGame } from "@/context/GameContext";
import { getColorForNumber, getBigSmall } from "@/lib/utils";
import { GameRound, Prediction } from "@/types";
import { ChevronLeft, ChevronRight, TrendingUp, History, UserCheck } from "lucide-react";

export const HistorySection: React.FC = () => {
  const { history, userBets } = useGame();
  const [activeTab, setActiveTab] = useState<"history" | "chart" | "myBets">("history");
  const [page, setPage] = useState<number>(1);
  const itemsPerPage = 10;

  const totalPages = Math.ceil(history.length / itemsPerPage);
  const paginatedHistory = history.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  // Statistics calculation for chart tab
  const totalRounds = history.length;
  const redCount = history.filter(
    (h) => h.result_number !== null && [2, 4, 6, 8, 0].includes(h.result_number)
  ).length;
  const greenCount = history.filter(
    (h) => h.result_number !== null && [1, 3, 7, 9, 5].includes(h.result_number)
  ).length;
  const violetCount = history.filter(
    (h) => h.result_number === 0 || h.result_number === 5
  ).length;
  const bigCount = history.filter(
    (h) => h.result_number !== null && h.result_number >= 5
  ).length;
  const smallCount = totalRounds - bigCount;

  const redPct = totalRounds > 0 ? Math.round((redCount / totalRounds) * 100) : 50;
  const greenPct = totalRounds > 0 ? Math.round((greenCount / totalRounds) * 100) : 50;
  const violetPct = totalRounds > 0 ? Math.round((violetCount / totalRounds) * 100) : 10;
  const bigPct = totalRounds > 0 ? Math.round((bigCount / totalRounds) * 100) : 50;
  const smallPct = 100 - bigPct;

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-3 sm:p-4 my-3 shadow-sm">
      {/* Tab Switcher */}
      <div className="grid grid-cols-3 gap-2 p-1.5 bg-slate-100 rounded-2xl border border-slate-200 mb-3">
        <button
          type="button"
          onClick={() => setActiveTab("history")}
          className={`py-2 px-1 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            activeTab === "history"
              ? "bg-game-green text-white font-black shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <History className="w-3.5 h-3.5" />
          <span>Game history</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("chart")}
          className={`py-2 px-1 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            activeTab === "chart"
              ? "bg-game-green text-white font-black shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Trend Chart</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("myBets")}
          className={`py-2 px-1 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            activeTab === "myBets"
              ? "bg-game-green text-white font-black shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <UserCheck className="w-3.5 h-3.5" />
          <span>My history</span>
        </button>
      </div>

      {/* Tab 1: Game History Table (Exact Match to User Reference Screenshot) */}
      {activeTab === "history" && (
        <div>
          <div className="overflow-hidden rounded-xl border border-slate-200">
            {/* Green Table Header */}
            <div className="grid grid-cols-4 bg-gradient-to-r from-emerald-600 via-game-green to-emerald-600 text-white py-2.5 px-3 text-xs font-black text-center tracking-wide shadow-sm">
              <span className="text-left pl-2">Period</span>
              <span>Number</span>
              <span>Big Small</span>
              <span className="text-right pr-3">Color</span>
            </div>

            {/* Rows */}
            <div className="divide-y divide-slate-100 bg-white">
              {paginatedHistory.map((row) => {
                const num = row.result_number ?? 0;
                const isGreen = [1, 3, 7, 9].includes(num);
                const isRed = [2, 4, 6, 8].includes(num);
                const isZero = num === 0;
                const isFive = num === 5;
                const bigSmall = getBigSmall(num);

                let numTextColor = "text-game-red";
                if (isGreen) numTextColor = "text-game-green";
                else if (isZero) numTextColor = "text-purple-600";
                else if (isFive) numTextColor = "text-emerald-600";

                return (
                  <div
                    key={row.id}
                    className="grid grid-cols-4 items-center py-2.5 px-3 text-center text-xs hover:bg-slate-50 transition-colors"
                  >
                    {/* Period ID */}
                    <span className="text-left font-mono text-xs text-slate-700 font-semibold pl-2 truncate">
                      {row.period_id}
                    </span>

                    {/* Number */}
                    <span className={`text-lg font-black ${numTextColor}`}>
                      {num}
                    </span>

                    {/* Big Small */}
                    <span className="font-bold text-slate-800 text-xs">
                      {bigSmall}
                    </span>

                    {/* Color Dot */}
                    <div className="flex items-center justify-end pr-3">
                      {isZero ? (
                        <div
                          className="w-4 h-4 rounded-full bg-gradient-to-r from-game-red to-game-violet shadow-[0_2px_6px_rgba(139,92,246,0.5)] border border-white"
                          title="Red + Violet"
                        />
                      ) : isFive ? (
                        <div
                          className="w-4 h-4 rounded-full bg-gradient-to-r from-game-green to-game-violet shadow-[0_2px_6px_rgba(0,184,92,0.5)] border border-white"
                          title="Green + Violet"
                        />
                      ) : isGreen ? (
                        <div
                          className="w-3.5 h-3.5 rounded-full bg-game-green shadow-[0_2px_6px_rgba(0,184,92,0.4)]"
                          title="Green"
                        />
                      ) : (
                        <div
                          className="w-3.5 h-3.5 rounded-full bg-game-red shadow-[0_2px_6px_rgba(239,68,68,0.4)]"
                          title="Red"
                        />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-3 px-1">
            <span className="text-xs text-slate-500 font-medium">
              Page {page} of {Math.max(1, totalPages)}
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Visual Trend Chart */}
      {activeTab === "chart" && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                <span className="text-game-green">Green ({greenPct}%)</span>
                <span className="text-game-red">Red ({redPct}%)</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-slate-200 overflow-hidden flex">
                <div style={{ width: `${greenPct}%` }} className="h-full bg-game-green" />
                <div style={{ width: `${redPct}%` }} className="h-full bg-game-red" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                <span className="text-amber-600">Big ({bigPct}%)</span>
                <span className="text-blue-600">Small ({smallPct}%)</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-slate-200 overflow-hidden flex">
                <div style={{ width: `${bigPct}%` }} className="h-full bg-amber-500" />
                <div style={{ width: `${smallPct}%` }} className="h-full bg-blue-500" />
              </div>
            </div>
          </div>

          {/* Number Trend Matrix */}
          <div className="overflow-x-auto">
            <span className="text-xs font-bold text-slate-600 mb-2 block">
              Recent Periods Number Matrix (0-9)
            </span>
            <div className="min-w-[450px] border border-slate-200 rounded-xl overflow-hidden bg-white">
              <div className="grid grid-cols-12 bg-slate-100 text-[11px] font-bold text-slate-600 py-1.5 px-2 text-center border-b border-slate-200">
                <span className="col-span-2 text-left">Period</span>
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                  <span key={n}>{n}</span>
                ))}
              </div>

              {history.slice(0, 15).map((row) => (
                <div
                  key={row.id}
                  className="grid grid-cols-12 text-center text-xs py-1.5 px-2 border-b border-slate-100 hover:bg-slate-50"
                >
                  <span className="col-span-2 text-left font-mono text-[10px] text-slate-500 truncate">
                    {row.period_id.slice(-5)}
                  </span>
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => {
                    const isHit = row.result_number === n;
                    const isGreen = [1, 3, 7, 9].includes(n);
                    const isZero = n === 0;
                    const isFive = n === 5;

                    let bg = "bg-game-red text-white";
                    if (isGreen) bg = "bg-game-green text-white";
                    if (isZero) bg = "bg-gradient-to-r from-game-red to-game-violet text-white";
                    if (isFive) bg = "bg-gradient-to-r from-game-green to-game-violet text-white";

                    return (
                      <div key={n} className="flex items-center justify-center">
                        {isHit ? (
                          <span
                            className={`w-5 h-5 rounded-full flex items-center justify-center font-black text-[10px] shadow-sm ${bg}`}
                          >
                            {n}
                          </span>
                        ) : (
                          <span className="text-slate-300 text-[10px]">·</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: My History */}
      {activeTab === "myBets" && (
        <div className="space-y-2">
          {userBets.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-xs">
              <History className="w-8 h-8 mx-auto mb-2 opacity-30 text-slate-400" />
              <p className="font-semibold text-slate-600">No predictions placed yet.</p>
              <p className="text-[11px] text-slate-400 mt-1">
                Choose Green, Violet, Red, or a Number above to place a prediction!
              </p>
            </div>
          ) : (
            <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
              {userBets.map((bet) => {
                const isPending = bet.status === "pending";
                const isWon = bet.status === "won";
                return (
                  <div
                    key={bet.id}
                    className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-1.5 font-bold">
                        <span className="text-slate-900 uppercase font-black">{bet.selection}</span>
                        <span className="text-[10px] bg-slate-200 px-1.5 py-0.5 rounded text-slate-700 uppercase font-bold">
                          {bet.bet_type}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          Period: {bet.period_id.slice(-6)}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-600 mt-1">
                        Wager: <strong className="text-slate-900">{bet.total_bet_points} pts</strong> ({bet.points_amount} × {bet.multiplier})
                      </div>
                    </div>

                    <div className="text-right">
                      {isPending ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700 border border-amber-300">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
                          Pending
                        </span>
                      ) : isWon ? (
                        <div className="flex flex-col items-end">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 border border-emerald-300">
                            Won
                          </span>
                          <span className="text-xs font-black text-game-green mt-0.5">
                            +{bet.payout_points} pts
                          </span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-end">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700 border border-rose-300">
                            Lost
                          </span>
                          <span className="text-xs font-medium text-slate-400 mt-0.5">
                            -{bet.total_bet_points} pts
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
