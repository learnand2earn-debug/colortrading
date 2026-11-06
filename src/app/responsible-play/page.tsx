import React from "react";
import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";

export default function ResponsiblePlayPage() {
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
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Responsible Play Manifesto</h1>
        <p className="text-xs text-slate-500 mt-1">92 Lucky Color Trading Platform</p>
      </div>

      <div className="p-5 rounded-3xl bg-emerald-50 border border-emerald-200 space-y-2">
        <div className="flex items-center gap-2 text-game-green font-bold text-sm">
          <ShieldCheck className="w-5 h-5" />
          <span>Zero Real Financial Risk Principle</span>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          92 Lucky Color Trading was created to offer players the thrill, strategy, and analytical excitement of
          colour and number prediction games in an environment completely isolated from monetary loss.
        </p>
      </div>

      <div className="space-y-5 text-xs sm:text-sm leading-relaxed text-slate-600 bg-white border border-slate-200/90 rounded-3xl p-6 shadow-sm">
        <section className="space-y-1.5">
          <h2 className="text-base font-bold text-slate-900">1. Entertainment Mindset</h2>
          <p>
            Treat simulation gameplay as a casual recreational activity. Test chart patterns, explore
            odds, and enjoy virtual achievements without wagering real savings.
          </p>
        </section>

        <section className="space-y-1.5">
          <h2 className="text-base font-bold text-slate-900">2. Free Virtual Balance Replenishment</h2>
          <p>
            You will never be pressured or prompted to spend real funds. If your virtual points run low,
            daily check-in rewards replenish your balance automatically every 24 hours.
          </p>
        </section>

        <section className="space-y-1.5">
          <h2 className="text-base font-bold text-slate-900">3. Support Resources</h2>
          <p>
            If you or someone you know struggles with real-world gambling habits, we encourage contacting
            independent support organizations such as BeGambleAware or Gamblers Anonymous.
          </p>
        </section>
      </div>
    </div>
  );
}
