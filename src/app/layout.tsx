import type { Metadata, Viewport } from "next";
import "./globals.css";
import { GameProvider } from "@/context/GameContext";
import { Navbar } from "@/components/layout/Navbar";
import { BottomNav } from "@/components/layout/BottomNav";
import { MobileShell } from "@/components/layout/MobileShell";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "92 Lucky Color Trading - Provably Fair Gaming Platform",
  description:
    "Official 92 Lucky Color Trading platform. Experience high precision colour prediction with provably fair cryptographic outcomes. Strictly free virtual simulation.",
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="light">
      <body className="bg-background text-slate-900 antialiased min-h-screen selection:bg-game-green selection:text-white">
        <GameProvider>
          <Navbar />
          <MobileShell>{children}</MobileShell>
          <BottomNav />
        </GameProvider>
      </body>
    </html>
  );
}
