import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
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
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Privacy Policy</h1>
        <p className="text-xs text-slate-500 mt-1">92 Lucky Color Trading Platform · Last updated: November 2026</p>
      </div>

      <div className="space-y-5 text-xs sm:text-sm leading-relaxed text-slate-600 bg-white border border-slate-200/90 rounded-3xl p-6 shadow-sm">
        <section className="space-y-1.5">
          <h2 className="text-base font-bold text-slate-900">1. Information We Collect</h2>
          <p>
            We collect only essential information required to operate player sessions: account email,
            chosen display username, and gameplay simulation history.
          </p>
        </section>

        <section className="space-y-1.5">
          <h2 className="text-base font-bold text-slate-900">2. Financial Data Exemption</h2>
          <p>
            Because this platform operates solely on virtual simulation points without any monetary deposits or
            withdrawals, we do not request or store credit card, banking, or payment credentials.
          </p>
        </section>

        <section className="space-y-1.5">
          <h2 className="text-base font-bold text-slate-900">3. Data Security & Encryption</h2>
          <p>
            Account credentials and authentication sessions are secured using industry-standard hashing
            and encrypted connection protocols.
          </p>
        </section>
      </div>
    </div>
  );
}
