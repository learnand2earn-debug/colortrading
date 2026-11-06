"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useGame } from "@/context/GameContext";
import {
  Coins,
  History,
  Lock,
  Gift,
  CheckCircle2,
  Copy,
  Check,
  Camera,
  Sparkles,
  Users,
} from "lucide-react";
import { AvatarUploadModal } from "@/components/profile/AvatarUploadModal";
import { ReferralCard } from "@/components/profile/ReferralCard";

export default function ProfilePage() {
  const { user, ledger, claimDailyReward, dailyClaimedToday } = useGame();
  const [copied, setCopied] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"ledger" | "referral" | "security">("ledger");
  const [showAvatarModal, setShowAvatarModal] = useState<boolean>(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordSaved, setPasswordSaved] = useState(false);

  const handleCopyId = () => {
    if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText(user.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) return;
    setPasswordSaved(true);
    setCurrentPassword("");
    setNewPassword("");
    setTimeout(() => setPasswordSaved(false), 3000);
  };

  return (
    <div className="w-full space-y-4 max-w-4xl mx-auto">
      {/* User Info Card with Profile Photo Upload Button */}
      <div className="relative overflow-hidden rounded-3xl bg-white border border-slate-200/90 p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* Clickable Profile Avatar with Camera Overlay */}
            <div className="relative group cursor-pointer" onClick={() => setShowAvatarModal(true)}>
              <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-3xl overflow-hidden border-4 border-amber-400 shadow-md bg-slate-100 flex items-center justify-center">
                {user.avatar_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={user.avatar_url}
                    alt={user.username}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="font-black text-2xl sm:text-3xl text-game-green">
                    {user.username.slice(0, 2).toUpperCase()}
                  </span>
                )}
              </div>

              {/* Camera Hover Pill */}
              <div className="absolute inset-0 rounded-3xl bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[10px] font-bold">
                <Camera className="w-5 h-5 mb-0.5" />
                <span>Change</span>
              </div>

              {/* Floating Camera Icon */}
              <button
                type="button"
                onClick={() => setShowAvatarModal(true)}
                className="absolute -bottom-1 -right-1 p-1.5 rounded-xl bg-amber-500 text-white shadow-md hover:scale-110 active:scale-95 transition-transform"
                title="Upload Photo / Change Avatar"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black text-slate-900">{user.username}</h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-800 border border-amber-300 uppercase">
                  VIP Tier 2
                </span>
              </div>

              <button
                type="button"
                onClick={handleCopyId}
                className="text-xs text-slate-500 hover:text-game-green flex items-center gap-1.5 mt-1 transition-colors"
              >
                <span className="font-mono">UID: {user.id}</span>
                {copied ? (
                  <Check className="w-3.5 h-3.5 text-game-green" />
                ) : (
                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                )}
              </button>
              <span className="text-xs text-slate-400 mt-0.5">{user.email}</span>
            </div>
          </div>

          {/* Upload Photo Button */}
          <button
            type="button"
            onClick={() => setShowAvatarModal(true)}
            className="px-4 py-2.5 rounded-2xl bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-800 font-black text-xs flex items-center gap-2 self-start sm:self-center shadow-xs transition-all active:scale-95"
          >
            <Camera className="w-4 h-4 text-amber-600" />
            <span>Upload Photo</span>
          </button>
        </div>

        {/* Balance Highlight Box */}
        <div className="mt-5 p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
              <Coins className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-slate-500 block font-semibold">Virtual Points Balance</span>
              <span className="font-mono text-xl font-black text-game-green">
                {new Intl.NumberFormat("en-US").format(user.virtual_points)} pts
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={claimDailyReward}
            disabled={dailyClaimedToday}
            className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all ${
              dailyClaimedToday
                ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                : "bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-900 shadow-sm hover:brightness-105 active:scale-95"
            }`}
          >
            <Gift className="w-3.5 h-3.5" />
            <span>{dailyClaimedToday ? "Claimed" : "Claim Daily"}</span>
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
          <div className="text-xl sm:text-2xl font-mono font-black text-slate-900">
            {user.total_rounds_played}
          </div>
          <div className="text-xs text-slate-500 font-medium">Total Rounds</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
          <div className="text-xl sm:text-2xl font-mono font-black text-game-green">
            {user.total_wins}
          </div>
          <div className="text-xs text-slate-500 font-medium">Correct Predictions</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
          <div className="text-xl sm:text-2xl font-mono font-black text-rose-500">
            {user.total_losses}
          </div>
          <div className="text-xs text-slate-500 font-medium">Incorrect Predictions</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
          <div className="text-xl sm:text-2xl font-mono font-black text-amber-500">
            {user.accuracy_percentage}%
          </div>
          <div className="text-xs text-slate-500 font-medium">Accuracy</div>
        </div>
      </div>

      {/* Tabs: Points Ledger vs Referral Invite vs Security Settings */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-sm space-y-4">
        <div className="grid grid-cols-3 gap-2 p-1.5 bg-slate-100 rounded-2xl border border-slate-200">
          <button
            type="button"
            onClick={() => setActiveTab("ledger")}
            className={`py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === "ledger"
                ? "bg-game-green text-white font-black shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Ledger</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("referral")}
            className={`py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === "referral"
                ? "bg-game-green text-white font-black shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Refer Friends</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("security")}
            className={`py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === "security"
                ? "bg-game-green text-white font-black shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Security</span>
          </button>
        </div>

        {/* Tab 1: Ledger */}
        {activeTab === "ledger" && (
          <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
            <span className="text-xs text-slate-500 font-bold block mb-1">
              Virtual Points Transaction History
            </span>

            {ledger.map((tx) => {
              const isPositive = tx.amount > 0;
              return (
                <div
                  key={tx.id}
                  className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-bold text-slate-900 block capitalize">
                      {tx.tx_type.replace("_", " ")}
                    </span>
                    <span className="text-[11px] text-slate-500">{tx.notes}</span>
                  </div>

                  <div className="text-right">
                    <span
                      className={`font-mono font-black text-sm block ${
                        isPositive ? "text-game-green" : "text-rose-500"
                      }`}
                    >
                      {isPositive ? `+${tx.amount}` : tx.amount} pts
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      Bal: {tx.balance_after}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Tab 2: Refer Friends */}
        {activeTab === "referral" && (
          <ReferralCard />
        )}

        {/* Tab 3: Security */}
        {activeTab === "security" && (
          <form onSubmit={handlePasswordSubmit} className="space-y-3.5 max-w-md mx-auto">
            {passwordSaved && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-game-green text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Password successfully updated!</span>
              </div>
            )}

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Current Password
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-game-green"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Minimum 8 characters"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-game-green"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-game-green text-white font-black text-xs hover:brightness-105 active:scale-95 transition-all shadow-sm"
            >
              Update Password
            </button>
          </form>
        )}
      </div>

      {/* Avatar Upload Modal */}
      <AvatarUploadModal
        isOpen={showAvatarModal}
        onClose={() => setShowAvatarModal(false)}
      />
    </div>
  );
}
