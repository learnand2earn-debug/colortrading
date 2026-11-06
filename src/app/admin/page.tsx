"use client";

import React, { useState } from "react";
import { useGame } from "@/context/GameContext";
import {
  ShieldAlert,
  Users,
  Gamepad2,
  Coins,
  History,
  LifeBuoy,
  Search,
  CheckCircle,
  Shield,
} from "lucide-react";

export default function AdminPage() {
  const {
    user,
    allUsers,
    adminAdjustPoints,
    adminChangeUserStatus,
    toggleAdminRole,
    gameId,
    history,
    supportTickets,
  } = useGame();

  const [activeTab, setActiveTab] = useState<"overview" | "users" | "games" | "support">("overview");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedUser, setSelectedUser] = useState<string>("");
  const [adjustAmount, setAdjustAmount] = useState<number>(500);
  const [adjustReason, setAdjustReason] = useState<string>("Administrative reward adjustment");
  const [actionNotice, setActionNotice] = useState<string>("");

  const isAdmin = user.role === "admin";

  const filteredUsers = allUsers.filter(
    (u) =>
      u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.id.includes(searchQuery)
  );

  const handleAdjustPointsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser || !adjustAmount) return;

    adminAdjustPoints(selectedUser, Number(adjustAmount), adjustReason);
    setActionNotice(`Successfully adjusted ${adjustAmount} points for user ${selectedUser}`);
    setTimeout(() => setActionNotice(""), 3500);
  };

  return (
    <div className="w-full space-y-5 max-w-5xl mx-auto">
      {/* Admin Authorization Banner */}
      <div className="p-5 rounded-3xl bg-amber-50 border border-amber-300 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-bold shadow-sm">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
              92 Lucky Control Terminal
              <span className="text-[10px] bg-amber-500 text-white px-2 py-0.5 rounded-full font-black uppercase">
                {isAdmin ? "Admin Mode Active" : "View-Only Preview"}
              </span>
            </h1>
            <p className="text-xs text-slate-600 mt-0.5">
              {isAdmin
                ? "Manage games, inspect provable seeds, adjust simulated points, and audit users."
                : "You are currently in Player role. Click 'Enable Admin' to test admin controls."}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={toggleAdminRole}
          className="px-4 py-2 rounded-xl text-xs font-black bg-amber-500 text-white hover:bg-amber-600 active:scale-95 transition-all shadow-sm whitespace-nowrap ml-2"
        >
          {isAdmin ? "Switch to User" : "Enable Admin"}
        </button>
      </div>

      {/* Action Notification Toast */}
      {actionNotice && (
        <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-300 text-game-green text-xs font-bold flex items-center gap-2 animate-fade-in">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* Admin Navigation Tabs */}
      <div className="grid grid-cols-4 gap-1.5 p-1.5 bg-slate-100 rounded-2xl border border-slate-200">
        <button
          type="button"
          onClick={() => setActiveTab("overview")}
          className={`py-2 text-xs font-bold rounded-xl transition-all ${
            activeTab === "overview"
              ? "bg-game-green text-white font-black shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          Overview
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("users")}
          className={`py-2 text-xs font-bold rounded-xl transition-all ${
            activeTab === "users"
              ? "bg-game-green text-white font-black shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          Users ({allUsers.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("games")}
          className={`py-2 text-xs font-bold rounded-xl transition-all ${
            activeTab === "games"
              ? "bg-game-green text-white font-black shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          Games & Seeds
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("support")}
          className={`py-2 text-xs font-bold rounded-xl transition-all ${
            activeTab === "support"
              ? "bg-game-green text-white font-black shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          Support ({supportTickets.length})
        </button>
      </div>

      {/* Tab 1: Overview Dashboard */}
      {activeTab === "overview" && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-1">
              <span className="text-xs text-slate-500 font-semibold flex items-center gap-1.5">
                <Users className="w-4 h-4 text-blue-500" />
                Total Users
              </span>
              <div className="font-mono text-2xl font-black text-slate-900">
                {allUsers.length}
              </div>
            </div>

            <div className="p-4 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-1">
              <span className="text-xs text-slate-500 font-semibold flex items-center gap-1.5">
                <Gamepad2 className="w-4 h-4 text-game-green" />
                Active Game Modes
              </span>
              <div className="font-mono text-2xl font-black text-game-green">4</div>
            </div>

            <div className="p-4 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-1">
              <span className="text-xs text-slate-500 font-semibold flex items-center gap-1.5">
                <Coins className="w-4 h-4 text-amber-500" />
                Virtual Points Pool
              </span>
              <div className="font-mono text-2xl font-black text-amber-600">80,150</div>
            </div>

            <div className="p-4 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-1">
              <span className="text-xs text-slate-500 font-semibold flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-purple-500" />
                Theoretical RTP
              </span>
              <div className="font-mono text-2xl font-black text-purple-600">98.5%</div>
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-2">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wide">
              92 Lucky Simulator Guardrails & Compliance
            </h3>
            <ul className="text-xs text-slate-600 space-y-1.5 list-disc pl-4">
              <li>Points are strictly virtual and never redeemable for prizes or fiat.</li>
              <li>Provably fair SHA-256 pre-hashes prevent outcome tampering.</li>
              <li>Server timestamp synchronization locks predictions 5s before reveal.</li>
              <li>All balance adjustments require explicit audit reasons.</li>
            </ul>
          </div>
        </div>
      )}

      {/* Tab 2: User Management */}
      {activeTab === "users" && (
        <div className="space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by username, email or ID..."
              className="w-full bg-white border border-slate-200 rounded-2xl pl-10 pr-3 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-game-green shadow-sm"
            />
          </div>

          <div className="space-y-2.5">
            {filteredUsers.map((u) => (
              <div
                key={u.id}
                className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-slate-900 text-sm">{u.username}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                        u.role === "admin"
                          ? "bg-amber-100 text-amber-800 border border-amber-300"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {u.role}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                        u.status === "active"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-rose-100 text-rose-800"
                      }`}
                    >
                      {u.status}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 font-mono mt-0.5">
                    {u.email} · {u.id}
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <span className="font-mono font-black text-game-green text-sm sm:text-base">
                    {new Intl.NumberFormat("en-US").format(u.virtual_points)} pts
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      adminChangeUserStatus(
                        u.id,
                        u.status === "active" ? "suspended" : "active"
                      )
                    }
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                      u.status === "active"
                        ? "border-rose-200 text-rose-600 hover:bg-rose-50"
                        : "border-emerald-200 text-game-green hover:bg-emerald-50"
                    }`}
                  >
                    {u.status === "active" ? "Suspend" : "Activate"}
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedUser(u.id)}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200"
                  >
                    Adjust Pts
                  </button>
                </div>
              </div>
            ))}
          </div>

          {selectedUser && (
            <form
              onSubmit={handleAdjustPointsSubmit}
              className="p-5 rounded-3xl bg-amber-50/60 border border-amber-300 space-y-3 text-xs"
            >
              <div className="flex items-center justify-between border-b border-amber-200 pb-2">
                <span className="font-black text-amber-900 text-sm">
                  Adjust Virtual Points for {selectedUser}
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedUser("")}
                  className="text-slate-400 hover:text-slate-700"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Amount (+ for Credit, - for Debit)
                  </label>
                  <input
                    type="number"
                    value={adjustAmount}
                    onChange={(e) => setAdjustAmount(Number(e.target.value))}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-bold"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Audit Reason</label>
                  <input
                    type="text"
                    value={adjustReason}
                    onChange={(e) => setAdjustReason(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-amber-500 text-white font-black text-xs hover:bg-amber-600 shadow-sm"
              >
                Apply Point Adjustment
              </button>
            </form>
          )}
        </div>
      )}

      {/* Tab 3: Games & Provable Seeds */}
      {activeTab === "games" && (
        <div className="space-y-4">
          <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Live Provably Fair Seeds ({gameId})
            </h3>
            <div className="space-y-2.5">
              {history.slice(0, 5).map((r) => (
                <div
                  key={r.id}
                  className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-slate-900">Period: {r.period_id}</span>
                    <span className="font-black text-game-green text-sm">Number {r.result_number}</span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono break-all">
                    Seed Hash: {r.seed_hash}
                  </div>
                  {r.secret_salt && (
                    <div className="text-[11px] text-amber-700 font-mono break-all font-semibold">
                      Salt: {r.secret_salt}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Support Tickets Manager */}
      {activeTab === "support" && (
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-700 uppercase">User Support Inquiries</h3>
          {supportTickets.map((t) => (
            <div
              key={t.id}
              className="p-4 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-2 text-xs"
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 block text-sm">{t.subject}</span>
                  <span className="text-[11px] text-slate-500">
                    From: {t.user_name} ({t.user_id})
                  </span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  {t.status}
                </span>
              </div>

              {t.replies && t.replies.length > 0 && (
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-xs text-slate-600 space-y-1">
                  <span className="font-bold text-game-green block">
                    Latest Message ({t.replies[t.replies.length - 1].sender_name}):
                  </span>
                  <p>{t.replies[t.replies.length - 1].message}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
