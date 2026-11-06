import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Sparkles, Users, ShieldCheck } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="w-full space-y-6 max-w-3xl mx-auto py-6">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Return to Home</span>
      </Link>

      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">About 92 Lucky Color Trading</h1>
        <p className="text-xs text-slate-500 mt-1">Leading provably fair simulation technology</p>
      </div>

      <div className="space-y-5 text-xs sm:text-sm leading-relaxed text-slate-600 bg-white border border-slate-200/90 rounded-3xl p-6 shadow-sm">
        <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
          <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-amber-400 shrink-0 shadow-sm">
            <Image
              src="/logo.png"
              alt="92 Lucky"
              width={64}
              height={64}
              className="object-cover w-full h-full"
            />
          </div>
          <div>
            <h2 className="text-base font-black text-slate-900">92 Lucky Color Trading</h2>
            <p className="text-xs text-slate-500">Official Web & Mobile Simulation Gaming Portal</p>
          </div>
        </div>

        <p>
          92 Lucky Color Trading is a cutting-edge colour prediction and number trading simulation platform designed
          for players, strategists, and gamers seeking modern gaming aesthetics, desktop clarity, and mathematical transparency.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-4">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5 text-center">
            <ShieldCheck className="w-6 h-6 text-game-green mx-auto" />
            <h3 className="font-bold text-slate-900 text-xs">Provably Fair</h3>
            <p className="text-[11px] text-slate-500">Cryptographically verifiable SHA-256 seeds</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5 text-center">
            <Sparkles className="w-6 h-6 text-amber-500 mx-auto" />
            <h3 className="font-bold text-slate-900 text-xs">Clean White Theme</h3>
            <p className="text-[11px] text-slate-500">High-contrast glossy 3D spheres & fluid responsive UI</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5 text-center">
            <Users className="w-6 h-6 text-purple-600 mx-auto" />
            <h3 className="font-bold text-slate-900 text-xs">Social Rankings</h3>
            <p className="text-[11px] text-slate-500">Compete across daily, weekly, and all-time boards</p>
          </div>
        </div>

        <section className="space-y-1.5">
          <h2 className="text-base font-bold text-slate-900">Technology Stack</h2>
          <p>
            Built on Next.js 14 App Router, TypeScript, Tailwind CSS, Supabase PostgreSQL with Row Level
            Security, Realtime synchronization, and Web Audio synthesis for responsive performance across desktop monitors and mobile smartphones.
          </p>
        </section>
      </div>
    </div>
  );
}
