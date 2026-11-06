import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#f4f6fa",
        surface: "#ffffff",
        "surface-card": "#ffffff",
        "surface-muted": "#f8fafc",
        "surface-border": "#e2e8f0",
        "surface-dark": "#0f172a",
        "game-red": {
          DEFAULT: "#ef4444",
          light: "#f87171",
          dark: "#dc2626",
          glow: "rgba(239, 68, 68, 0.3)",
        },
        "game-green": {
          DEFAULT: "#00b85c",
          light: "#22c55e",
          dark: "#059669",
          glow: "rgba(0, 184, 92, 0.3)",
        },
        "game-violet": {
          DEFAULT: "#8b5cf6",
          light: "#a78bfa",
          dark: "#7c3aed",
          glow: "rgba(139, 92, 246, 0.3)",
        },
        "game-amber": {
          DEFAULT: "#f59e0b",
          light: "#fbbf24",
          dark: "#d97706",
        },
        "game-blue": {
          DEFAULT: "#3b82f6",
          light: "#60a5fa",
          dark: "#2563eb",
        },
      },
      boxShadow: {
        "neon-green": "0 4px 14px rgba(0, 184, 92, 0.35)",
        "neon-red": "0 4px 14px rgba(239, 68, 68, 0.35)",
        "neon-violet": "0 4px 14px rgba(139, 92, 246, 0.35)",
        "neon-amber": "0 4px 14px rgba(245, 158, 11, 0.35)",
        "neon-blue": "0 4px 14px rgba(59, 130, 246, 0.35)",
        "card-soft": "0 4px 20px -2px rgba(15, 23, 42, 0.06)",
        "card-float": "0 10px 25px -5px rgba(15, 23, 42, 0.1)",
      },
      animation: {
        pulseGlow: "pulseGlow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        float: "float 3s ease-in-out infinite",
        spinSlow: "spinSlow 12s linear infinite",
        shimmer: "shimmer 2.5s infinite linear",
      },
      keyframes: {
        pulseGlow: {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.85", transform: "scale(1.02)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        spinSlow: {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
