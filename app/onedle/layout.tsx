import Link from "next/link";
import type { Metadata } from "next";
import { ThemeToggle } from "@/components/ThemeToggle";

export const metadata: Metadata = {
  title: { default: "Onedle", template: "%s — Onedle" },
  description: "A one-shot Wordle variant. One guess. Every day.",
};

export default function OnedleLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-bg text-text flex flex-col transition-colors duration-300">
      {/* Top bar */}
      <header className="border-b border-border sticky top-0 bg-bg z-10 transition-colors duration-300">
        <div className="max-w-lg mx-auto px-4 h-12 grid grid-cols-3 items-center">
          <Link
            href="/"
            className="font-mono text-xs text-muted hover:text-text transition-colors"
          >
            ← Kevin Kim
          </Link>
          <Link
            href="/onedle"
            className="font-mono text-sm font-bold tracking-widest uppercase text-text hover:opacity-70 transition-opacity text-center"
          >
            Onedle
          </Link>
          <div className="flex justify-end">
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 max-w-lg mx-auto w-full px-4 pt-6">
        {children}
      </main>
    </div>
  );
}
