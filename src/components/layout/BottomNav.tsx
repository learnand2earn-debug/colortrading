"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useGame } from "@/context/GameContext";
import { Home, Gamepad2, Gift, Trophy, User, ShieldAlert } from "lucide-react";

export const BottomNav: React.FC = () => {
  const pathname = usePathname();
  const { user } = useGame();

  const navItems = [
    { label: "Home", href: "/", icon: Home },
    { label: "Win Go", href: "/game", icon: Gamepad2, highlight: true },
    { label: "Activity", href: "/activity", icon: Gift },
    { label: "Rankings", href: "/leaderboard", icon: Trophy },
    { label: "Account", href: "/profile", icon: User },
  ];

  if (user.role === "admin") {
    navItems.push({ label: "Admin", href: "/admin", icon: ShieldAlert, highlight: false });
  }

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 py-1.5 px-2 shadow-[0_-4px_16px_rgba(0,0,0,0.04)]">
      <div className="max-w-md mx-auto flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          if (item.highlight) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="relative -top-3.5 flex flex-col items-center group"
              >
                <div className="w-13 h-13 p-3 rounded-full bg-gradient-to-tr from-emerald-500 via-game-green to-teal-500 text-white shadow-neon-green group-hover:scale-105 active:scale-95 transition-all flex items-center justify-center border-4 border-white">
                  <Icon className="w-6 h-6 stroke-[2.5]" />
                </div>
                <span className="text-[10px] font-black text-game-green mt-0.5 tracking-tight">
                  {item.label}
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center py-1 px-2 rounded-xl transition-all ${
                isActive
                  ? "text-game-green font-bold"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? "stroke-[2.5]" : "stroke-[1.8]"}`} />
              <span className="text-[10px] mt-0.5">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
