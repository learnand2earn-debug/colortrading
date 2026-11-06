"use client";

import React, { useState } from "react";
import { useGame } from "@/context/GameContext";
import { Users, Copy, Check, Gift, Share2, Sparkles, QrCode } from "lucide-react";

export const ReferralCard: React.FC = () => {
  const { user, claimReferralBonus, referralPointsClaimed } = useGame();
  const [copied, setCopied] = useState<boolean>(false);
  const [claimedNotice, setClaimedNotice] = useState<string>("");

  const referralCode = `92LUCKY-${user.id.slice(-6).toUpperCase()}`;
  const referralLink = `https://92lucky.sim/register?ref=${referralCode}`;

  const handleCopy = () => {
    if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleClaim = () => {
    const res = claimReferralBonus();
    if (res.success) {
      setClaimedNotice(res.message);
      setTimeout(() => setClaimedNotice(""), 3000);
    }
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-black text-slate-900">
              Invite Friends & Earn Points
            </h3>
            <p className="text-xs text-slate-500">
              Get +500 free virtual points for every invited player!
            </p>
          </div>
        </div>

        <span className="text-xs font-mono font-black text-game-green bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          Earned: +{new Intl.NumberFormat("en-US").format(referralPointsClaimed)} pts
        </span>
      </div>

      {/* Referral Link & Code Box */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-700 block">
          Your Exclusive Referral Link:
        </label>
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono text-slate-700 truncate">
            {referralLink}
          </div>
          <button
            type="button"
            onClick={handleCopy}
            className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs flex items-center gap-1.5 hover:bg-slate-800 active:scale-95 transition-all shrink-0"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-game-green" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Referral Stats Grid */}
      <div className="grid grid-cols-3 gap-2.5 text-center pt-1">
        <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
          <span className="text-[10px] text-slate-500 font-bold uppercase block">
            Friends Invited
          </span>
          <span className="text-lg font-black text-slate-900 font-mono">
            3 Players
          </span>
        </div>

        <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
          <span className="text-[10px] text-slate-500 font-bold uppercase block">
            Bonus Rate
          </span>
          <span className="text-lg font-black text-amber-600 font-mono">
            +500 pts
          </span>
        </div>

        <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
          <span className="text-[10px] text-slate-500 font-bold uppercase block">
            Commission Tier
          </span>
          <span className="text-lg font-black text-game-green font-mono">
            Level 1
          </span>
        </div>
      </div>

      {/* Claim Notice */}
      {claimedNotice && (
        <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-300 text-game-green text-xs font-bold text-center">
          {claimedNotice}
        </div>
      )}

      {/* Claim Button */}
      <button
        type="button"
        onClick={handleClaim}
        className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-900 font-black text-xs shadow-sm hover:brightness-105 active:scale-95 transition-all flex items-center justify-center gap-2"
      >
        <Gift className="w-4 h-4" />
        <span>Simulate Friend Join & Claim +500 Bonus Points</span>
      </button>
    </div>
  );
};

