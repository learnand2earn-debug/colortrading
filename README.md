# Lumina WinGo - Provably Fair Colour Prediction Gaming Platform

An ultra-modern, production-quality **Colour Prediction Gaming Platform Simulator** built with **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS**, and **Supabase PostgreSQL**.

Designed with an elite, mobile-first dark gaming aesthetic featuring glowing neon emerald, royal violet, and crimson accents, glassmorphic cards, 3D glossy metallic number chips (0 to 9), synchronized countdown timers, provably fair cryptographic outcomes, and an auditable virtual points ledger.

> **STRICT RESPONSIBLE PLAY NOTICE:**  
> This platform is strictly a **free-to-play educational and entertainment simulator**. All points are virtual simulation tokens that hold **ZERO real monetary value**. Virtual points can never be deposited, purchased, withdrawn, transferred, or exchanged for real money, cryptocurrency, or physical prizes.

---

## 🌟 Key Features

### 1. Mobile-First Luxury Gaming Interface
- **Optimized for Smartphones:** Seamless touch experience designed to look and feel like an elite mobile app, with bottom navigation, floating 24/7 support widget, and quick point reload.
- **Desktop Companion Frame:** Desktop previewer toggle allows switching between an authentic centered mobile phone shell or expanded full-width view.
- **3D Glossy Spheres (0 - 9):**
  - **Ball 0:** Red & Violet split metallic gradient with specular 3D reflection.
  - **Ball 5:** Green & Violet split metallic gradient with specular 3D reflection.
  - **Balls 1, 3, 7, 9:** Glowing emerald spheres.
  - **Balls 2, 4, 6, 8:** Glowing crimson ruby spheres.
- **Interactive Multiplier Chips:** Quick tags (`Random`, `X1`, `X5`, `X10`, `X20`, `X50`, `X100`).
- **Big & Small Buttons:** Amber Gradient Big (5-9) and Sapphire Blue Small (0-4).

### 2. Multi-Mode Win Go Arena
- **Win Go 30s:** Lightning-fast 30-second cycles for rapid gameplay.
- **Win Go 1Min:** Classic 60-second high-precision color rounds.
- **Win Go 3Min:** Strategic 3-minute rounds.
- **Win Go 5Min:** Grand 5-minute analytical cycles.
- **Provably Fair Commit & Reveal:** Every round publishes a SHA-256 seed hash prior to predictions. After completion, the secret salt is revealed so users can verify results mathematically.
- **5-Second Prediction Lock:** Digital countdown automatically locks predictions in the final 5 seconds with pulsing visual warnings and sound effects.

### 3. Comprehensive Analysis & History
- **Game History Table:** Matches and elevates standard Win Go layouts with Period IDs, colored numbers, Big/Small text, and color status dots.
- **Live Trend Chart:** Frequency breakdown of Green %, Red %, Violet %, Big vs Small distribution, and a 20-period number trajectory matrix (0-9).
- **Personal Bet History:** Filter active pending bets, won payouts with green indicators, and lost predictions.

### 4. Activity Center & Daily Rewards
- **7-Day Streak Rewards:** Increasing virtual rewards (Day 1: +100 pts up to Day 7: +1,000 pts).
- **Daily Simulation Quests:** Free points for participating in rounds and testing predictions.
- **VIP Tier Progression:** Level up member status from VIP 1 to VIP 5 as more rounds are completed.

### 5. Competitive Global Leaderboards
- Daily, Weekly, Monthly, and All-Time rankings.
- 3D Gold 🥇, Silver 🥈, and Bronze 🥉 podium presentation.
- Displays accuracy percentages, total rounds, and simulated virtual points.

### 6. Full Admin Control Terminal (`/admin`)
- Switch instantly between Player and Admin modes with the header toggle.
- **System KPIs:** Registered users, active game modes, total points in circulation, and theoretical RTP %.
- **User Management:** Search users, suspend/reactivate accounts, and perform auditable virtual points adjustments.
- **Game & Provable Fair Audits:** Inspect active seed hashes, salts, and force-cycle rounds for instant testing.
- **Support Inquiries:** Review and respond to user tickets.

### 7. Zero-Asset Web Audio Synthesizer
- Built using the native Web Audio API (`src/lib/audio/sounds.ts`).
- Provides soft UI clicks, countdown urgency ticks (< 5s), fanfare win celebrations, and loss chimes with zero external audio file dependencies.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 14 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS with custom neon palettes & keyframes |
| **Database** | PostgreSQL / Supabase |
| **State Management** | React Context (`src/context/GameContext.tsx`) |
| **Audio** | HTML5 Web Audio API Synthesizer |
| **Animations** | Canvas Confetti & Tailwind animations |
| **Icons** | Lucide React |

---

## 🚀 Quick Start & Local Development

### 1. Clone & Install
```bash
git clone <repo-url>
cd color-trading
npm install
```

### 2. Environment Configuration
Copy the template environment file:
```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
CRON_SECRET=lumina-secure-cron-token-2026
```
*(Note: If you do not have Supabase credentials ready, the app includes an automatic fallback mode with an in-memory game engine so all features work immediately out of the box!)*

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your mobile browser or desktop browser!

---

## 🗄️ Database Setup (Supabase / PostgreSQL)

1. Open your Supabase project's **SQL Editor**.
2. Run the initial schema migration located in `supabase/migrations/20261106_init_schema.sql`.
   - Creates `profiles`, `games`, `game_rounds`, `predictions`, `virtual_points_ledger`, `daily_rewards`, `notifications`, `support_tickets`, and `audit_logs` tables.
   - Sets up Row Level Security (RLS) policies.
   - Configures automatic new user trigger with 1,000 free starter points.
3. Run the stored procedures script in `supabase/migrations/20261106_game_procedures.sql`.
   - Creates atomic bet placement function `public.place_prediction`.
   - Creates round resolution and simulated payout distributor `public.resolve_round`.

---

## ☁️ Vercel Deployment

1. Push your repository to GitHub / GitLab / Bitbucket.
2. In Vercel, click **Add New Project** and select your repository.
3. Add the environment variables from `.env.example`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `CRON_SECRET`
4. Click **Deploy**.

---

## 📄 License
This project is open-source and created for educational simulation and entertainment purposes.

