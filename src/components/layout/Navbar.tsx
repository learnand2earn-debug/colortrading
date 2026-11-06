"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useGame } from "@/context/GameContext";
import { Coins, Bell, Shield, Gift, Volume2, VolumeX, Sparkles, User } from "lucide-react";

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const {
    user,
    soundMuted,
    toggleSound,
    toggleAdminRole,
    claimDailyReward,
    dailyClaimedToday,
    notifications,
    markNotificationRead,
  } = useGame();

  const [showNotifs, setShowNotifs] = useState<boolean>(false);
  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const desktopLinks = [
    { label: "Home", href: "/" },
    { label: "Win Go Arena", href: "/game", highlight: true },
    { label: "Activity & Quests", href: "/activity" },
    { label: "Leaderboard", href: "/leaderboard" },
    { label: "Account", href: "/profile" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-sm">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-3">
        {/* Brand Logo & Name */}
        <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
          <div className="relative w-10 h-10 sm:w-14 sm:h-14 rounded-2xl overflow-hidden shadow-md border-2 border-amber-400 group-hover:scale-105 transition-transform bg-white">
            <Image
              src="/logo.png"
              alt="92 Lucky Color Trading Logo"
              width={56}
              height={56}
              className="object-cover w-full h-full"
              priority
            />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 leading-none">
              <span className="font-black text-slate-900 text-base sm:text-xl tracking-tight">
                92 <span className="text-amber-500 font-black">LUCKY</span>
              </span>
              <span className="hidden sm:inline px-1.5 py-0.5 rounded text-[9px] font-black bg-game-green text-white uppercase">
                Official
              </span>
            </div>
            <span className="text-[11px] sm:text-xs text-game-green font-bold tracking-wide">
              Color Trading Simulator
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1">
          {desktopLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? "bg-game-green text-white shadow-neon-green"
                    : link.highlight
                    ? "bg-amber-500/10 text-amber-600 hover:bg-amber-500/20"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Action Bar */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Admin Role Toggle */}
          <button
            type="button"
            onClick={toggleAdminRole}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
              user.role === "admin"
                ? "bg-amber-500 text-white border-amber-600 shadow-sm"
                : "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200"
            }`}
            title="Toggle between Player and Admin view"
          >
            <Shield className="w-3.5 h-3.5" />
            <span className="hidden md:inline text-[11px]">Role:</span>
            <span className="uppercase text-[10px] font-black">{user.role}</span>
          </button>

          {/* Virtual Points Balance Pill */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 shadow-inner">
            <Coins className="w-4 h-4 text-amber-500 animate-pulse" />
            <span className="font-mono font-extrabold text-xs sm:text-sm text-game-green">
              {new Intl.NumberFormat("en-US").format(user.virtual_points)}
            </span>

            {/* Quick Free Claim Button */}
            <button
              type="button"
              onClick={claimDailyReward}
              disabled={dailyClaimedToday}
              className={`ml-1 px-2 py-0.5 rounded-md text-[10px] font-extrabold transition-all flex items-center gap-1 ${
                dailyClaimedToday
                  ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-amber-500 to-yellow-400 text-black hover:brightness-105 shadow-sm"
              }`}
              title={dailyClaimedToday ? "Claimed for today" : "Claim daily free virtual points!"}
            >
              <Gift className="w-3 h-3" />
              <span>{dailyClaimedToday ? "Claimed" : "+Free"}</span>
            </button>
          </div>

          {/* User Profile Avatar Link (Shows uploaded custom photo if available) */}
          <Link
            href="/profile"
            className="flex items-center group"
            title="My Profile & Upload Photo"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full overflow-hidden border-2 border-amber-400 shadow-xs bg-slate-100 flex items-center justify-center group-hover:scale-105 transition-transform">
              {user.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.avatar_url}
                  alt={user.username}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-xs font-black text-game-green">
                  {user.username.slice(0, 2).toUpperCase()}
                </span>
              )}
            </div>
          </Link>

          {/* Sound Toggle */}
          <button
            type="button"
            onClick={toggleSound}
            className="p-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-600 hover:bg-slate-200 hover:text-slate-900 transition-colors"
            title={soundMuted ? "Unmute" : "Mute"}
          >
            {soundMuted ? (
              <VolumeX className="w-4 h-4 text-rose-500" />
            ) : (
              <Volume2 className="w-4 h-4 text-game-green" />
            )}
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowNotifs(!showNotifs)}
              className="relative p-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-600 hover:bg-slate-200 hover:text-slate-900 transition-colors"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-game-red text-white text-[9px] font-black flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Panel */}
            {showNotifs && (
              <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-2xl p-3 shadow-xl z-50 animate-fade-in space-y-2">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2 px-1">
                  <span className="text-xs font-bold text-slate-900">Notifications</span>
                  <span className="text-[10px] text-slate-500">{notifications.length} total</span>
                </div>
                <div className="max-h-60 overflow-y-auto space-y-2">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => markNotificationRead(n.id)}
                      className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-colors ${
                        n.is_read
                          ? "bg-slate-50 border-slate-100 text-slate-500"
                          : "bg-emerald-50/50 border-emerald-200 text-slate-800"
                      }`}
                    >
                      <div className="font-bold text-slate-900 text-xs mb-0.5 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-amber-500" />
                        {n.title}
                      </div>
                      <p className="text-[11px] leading-relaxed text-slate-600">{n.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
