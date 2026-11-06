"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Gamepad2,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  Gift,
  ChevronDown,
  ArrowRight,
  Zap,
  Users,
  Lock,
} from "lucide-react";
import { NumberBall } from "@/components/game/NumberBall";

export default function HomePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: "Can I win or deposit real money on 92 Lucky?",
      a: "Strictly NO. 92 Lucky Color Trading is 100% a free-to-play educational and entertainment simulator. All points are virtual simulation tokens. They cannot be purchased, deposited, withdrawn, or traded for real currency or cash prizes.",
    },
    {
      q: "How does 92 Lucky Color Prediction work?",
      a: "Predict whether the upcoming period outcome will be Green, Violet, or Red, Big (5-9) or Small (0-4), or an exact Number (0-9). Numbers 1, 3, 7, 9 are Green; 2, 4, 6, 8 are Red; 0 is Red+Violet; 5 is Green+Violet.",
    },
    {
      q: "What makes 92 Lucky Provably Fair?",
      a: "Before every round begins, a SHA-256 cryptographic hash of the outcome secret seed is publicly published. Once the round locks and finishes, the secret salt is revealed so anyone can verify mathematically that the outcome was never manipulated.",
    },
    {
      q: "How do I claim free virtual points?",
      a: "Every new user receives 1,000 free starter virtual points. You can also claim daily streak bonuses every 24 hours in the Activity Center!",
    },
  ];

  return (
    <div className="w-full space-y-8 sm:space-y-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-white border border-slate-200/90 p-6 sm:p-12 text-center shadow-sm">
        {/* Glow Effects */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 -left-20 w-64 h-64 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

        {/* Featured Logo Image */}
        <div className="flex justify-center mb-4">
          <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-3xl overflow-hidden shadow-card-float border-4 border-amber-400 bg-white group hover:scale-105 transition-transform">
            <Image
              src="/logo.png"
              alt="92 Lucky Color Trading"
              width={144}
              height={144}
              className="object-cover w-full h-full"
              priority
            />
          </div>
        </div>

        {/* Badge */}
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-game-green text-xs font-bold mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Official 92 Lucky Color Trading Simulator</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-3">
          Predict Colors & Numbers. <br />
          <span className="bg-gradient-to-r from-game-green via-emerald-600 to-teal-600 bg-clip-text text-transparent">
            Master 92 Lucky Strategy.
          </span>
        </h1>

        <p className="text-xs sm:text-base text-slate-600 max-w-xl mx-auto leading-relaxed mb-6">
          Experience ultra-fast 30s, 1m, 3m, and 5m rounds with cryptographic
          provably fair outcomes, live charts, and virtual leaderboards.
        </p>

        {/* 3D Balls Hero Preview Display */}
        <div className="flex items-center justify-center gap-2 sm:gap-4 py-2 mb-6">
          <NumberBall number={0} size="md" />
          <NumberBall number={7} size="md" />
          <NumberBall number={8} size="md" />
          <NumberBall number={5} size="md" />
          <NumberBall number={9} size="md" />
        </div>

        {/* Call to Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
          <Link
            href="/game"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-game-green to-emerald-600 text-white font-black text-sm shadow-neon-green hover:brightness-105 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <Gamepad2 className="w-4 h-4" />
            <span>Launch 92 Lucky Arena</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/activity"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-700 font-bold text-sm hover:bg-slate-100 transition-all flex items-center justify-center gap-2"
          >
            <Gift className="w-4 h-4 text-amber-500" />
            <span>Claim Free Points</span>
          </Link>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-3 gap-3 mt-10 pt-8 border-t border-slate-100 text-center max-w-2xl mx-auto">
          <div>
            <div className="text-xl sm:text-3xl font-black text-slate-900 font-mono">100%</div>
            <div className="text-xs text-slate-500 font-medium">Free Virtual Simulator</div>
          </div>
          <div>
            <div className="text-xl sm:text-3xl font-black text-game-green font-mono">30s - 5m</div>
            <div className="text-xs text-slate-500 font-medium">Live Round Durations</div>
          </div>
          <div>
            <div className="text-xl sm:text-3xl font-black text-amber-500 font-mono">SHA-256</div>
            <div className="text-xs text-slate-500 font-medium">Provably Fair Verification</div>
          </div>
        </div>
      </section>

      {/* How to Play Section */}
      <section className="space-y-4">
        <div className="text-center">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">How To Play 92 Lucky</h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Master the color prediction simulator in 3 easy steps
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Step 1 */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-game-green flex items-center justify-center font-black text-sm">
              1
            </div>
            <h3 className="text-sm font-bold text-slate-900">Pick Round Duration</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Choose between lightning 30-second cycles, 1-minute classic, 3-minute, or 5-minute strategic rounds.
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-2">
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-game-violet flex items-center justify-center font-black text-sm">
              2
            </div>
            <h3 className="text-sm font-bold text-slate-900">Select Your Prediction</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Predict Green, Violet, or Red, pick direct numbers (0-9) for a 9x payout, or choose Big/Small.
            </p>
          </div>

          {/* Step 3 */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-2">
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center font-black text-sm">
              3
            </div>
            <h3 className="text-sm font-bold text-slate-900">Climb The Leaderboard</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Watch the synchronized timer. Correct predictions reward virtual points and boost your rank!
            </p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="space-y-4">
        <div className="text-center">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">Platform Highlights</h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Engineered for speed, transparency, and responsive desktop and mobile devices
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-2">
            <ShieldCheck className="w-6 h-6 text-game-green" />
            <h4 className="text-sm font-bold text-slate-900">Provably Fair</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              SHA-256 pre-committed secret salts verify outcomes cannot be manipulated.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-2">
            <Zap className="w-6 h-6 text-amber-500" />
            <h4 className="text-sm font-bold text-slate-900">Live Synchronized</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Real-time server timestamps keep every player on the exact same second.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-2">
            <TrendingUp className="w-6 h-6 text-blue-500" />
            <h4 className="text-sm font-bold text-slate-900">Interactive Charts</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Analyze historical outcome trends, color distributions, and big/small ratios.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-2">
            <Users className="w-6 h-6 text-purple-500" />
            <h4 className="text-sm font-bold text-slate-900">Global Rankings</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Compete on daily, weekly, and monthly virtual points rankings.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="space-y-4">
        <div className="text-center">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">Frequently Asked Questions</h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">Everything you need to know about 92 Lucky</p>
        </div>

        <div className="space-y-2.5 max-w-3xl mx-auto">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-white border border-slate-200/90 shadow-sm overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-4 text-left flex items-center justify-between text-xs sm:text-sm font-bold text-slate-900 hover:text-game-green"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180 text-game-green" : "text-slate-400"}`}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Responsible Gaming Notice */}
      <section className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-slate-700 space-y-2 max-w-3xl mx-auto">
        <div className="flex items-center gap-2 font-bold text-game-green text-sm">
          <Lock className="w-4 h-4" />
          <span>Strictly Free Virtual Simulator Notice</span>
        </div>
        <p className="text-xs leading-relaxed text-slate-600">
          92 Lucky Color Trading is designed exclusively for educational simulation and entertainment. Virtual points
          have no real-world financial equivalent and can never be exchanged, withdrawn, or purchased.
        </p>
      </section>

      {/* Footer Navigation */}
      <footer className="pt-8 pb-12 border-t border-slate-200 text-center space-y-4">
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-slate-600">
          <Link href="/terms" className="hover:text-game-green transition-colors">
            Terms of Service
          </Link>
          <Link href="/privacy" className="hover:text-game-green transition-colors">
            Privacy Policy
          </Link>
          <Link href="/responsible-play" className="hover:text-game-green transition-colors">
            Responsible Play
          </Link>
          <Link href="/about" className="hover:text-game-green transition-colors">
            About Us
          </Link>
          <Link href="/admin" className="hover:text-amber-600 transition-colors">
            Admin Terminal
          </Link>
        </div>
        <p className="text-xs text-slate-400">
          © {new Date().getFullYear()} 92 Lucky Color Trading Simulator. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
