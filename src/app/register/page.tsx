"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Lock, Mail, User, ArrowRight, Gift } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push("/game");
    }, 800);
  };

  return (
    <div className="w-full px-4 py-8 flex flex-col items-center justify-center min-h-[75vh]">
      <div className="w-full max-w-sm bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
        <div className="text-center space-y-1">
          <div className="w-16 h-16 rounded-2xl overflow-hidden mx-auto mb-2 shadow-md border-2 border-amber-400 bg-white">
            <Image
              src="/logo.png"
              alt="92 Lucky"
              width={64}
              height={64}
              className="object-cover w-full h-full"
            />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-game-green text-xs font-bold mb-1">
            <Gift className="w-3.5 h-3.5" />
            <span>+1,000 Free Starter Points</span>
          </div>
          <h1 className="text-xl font-black text-slate-900">Create Account</h1>
          <p className="text-xs text-slate-500">Join 92 Lucky colour prediction simulator</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-3">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Username
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Choose player username"
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-game-green"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-game-green"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 8 characters"
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-game-green"
              />
            </div>
          </div>

          <div className="text-[11px] text-slate-500 leading-tight">
            By creating an account, you agree to our{" "}
            <Link href="/terms" className="text-game-green font-bold hover:underline">
              Terms
            </Link>{" "}
            and acknowledge virtual points have no real cash value.
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-game-green to-emerald-600 text-white font-black text-sm shadow-neon-green hover:brightness-105 active:scale-95 transition-all flex items-center justify-center gap-2 mt-2"
          >
            <span>{loading ? "Creating..." : "Register & Get 1,000 Points"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-2 text-center text-xs text-slate-600">
          Already registered?{" "}
          <Link href="/login" className="text-game-green font-bold hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
