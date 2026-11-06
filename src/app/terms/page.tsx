import React from "react";
import Link from "next/link";
import { ShieldAlert, ArrowLeft } from "lucide-react";

export default function TermsPage() {
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
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Terms of Service</h1>
        <p className="text-xs text-slate-500 mt-1">92 Lucky Color Trading Platform · Last updated: November 2026</p>
      </div>

      <div className="p-5 rounded-3xl bg-emerald-50 border border-emerald-200 text-xs sm:text-sm text-emerald-900 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-game-green shrink-0 mt-0.5" />
        <div>
          <strong className="block font-bold">Strict Free Virtual Simulator Notice:</strong>
          This website is exclusively an educational and recreational game simulation platform. All points are free virtual points and hold NO real cash value, cannot be deposited, withdrawn, redeemed, or traded.
        </div>
      </div>

      <div className="space-y-5 text-xs sm:text-sm leading-relaxed text-slate-600 bg-white border border-slate-200/90 rounded-3xl p-6 shadow-sm">
        <section className="space-y-1.5">
          <h2 className="text-base font-bold text-slate-900">1. Nature of the Service</h2>
          <p>
            92 Lucky Color Trading provides a mathematical and visual simulation of color and number prediction games.
            No purchase is required or permitted.
          </p>
        </section>

        <section className="space-y-1.5">
          <h2 className="text-base font-bold text-slate-900">2. Virtual Points System</h2>
          <p>
            Virtual points are assigned automatically upon registration and daily check-in. Virtual points
            do not constitute property, balance of real currency, or monetary liability on the part of the operator.
          </p>
        </section>

        <section className="space-y-1.5">
          <h2 className="text-base font-bold text-slate-900">3. User Conduct</h2>
          <p>
            Users agree not to exploit software vulnerabilities, use automated scraping bots, or attempt
            unauthorized access to server infrastructure.
          </p>
        </section>

        <section className="space-y-1.5">
          <h2 className="text-base font-bold text-slate-900">4. Provably Fair Verification</h2>
          <p>
            Round results are calculated using deterministic cryptographic algorithms. The platform
            does not adjust outcomes based on player bet distribution.
          </p>
        </section>
      </div>
    </div>
  );
}
