"use client";

import React from "react";

interface MobileShellProps {
  children: React.ReactNode;
}

export const MobileShell: React.FC<MobileShellProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-background text-slate-900 flex flex-col">
      {/* Expansive responsive container: mobile-first, but opens wide & beautiful on desktop */}
      <main className="w-full max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-2 sm:py-4 pb-24">
        {children}
      </main>
    </div>
  );
};
