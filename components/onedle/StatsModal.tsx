"use client";

import type { DifficultyTier } from "@/lib/onedle/wordle";

type Stats = {
  played: number;
  solved: number;
  streak: number;
  bestStreak: number;
  byTier: Record<DifficultyTier, { played: number; solved: number }>;
};

type Props = {
  stats: Stats;
  onClose: () => void;
};

const TIERS: DifficultyTier[] = ["Easy", "Medium", "Hard", "Expert"];
const TIER_COLOR: Record<DifficultyTier, string> = {
  Easy: "text-green-600 dark:text-green-400",
  Medium: "text-yellow-600 dark:text-yellow-400",
  Hard: "text-orange-500",
  Expert: "text-red-500",
};

export function StatsModal({ stats, onClose }: Props) {
  const solveRate = stats.played > 0 ? Math.round((stats.solved / stats.played) * 100) : 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-text/20 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-bg border border-border rounded-sm p-6 w-full max-w-xs mx-4 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-mono text-sm uppercase tracking-widest text-muted">Statistics</h2>
          <button onClick={onClose} aria-label="Close" className="text-muted hover:text-text text-xl leading-none">×</button>
        </div>

        {/* Main stats */}
        <div className="grid grid-cols-4 gap-2 mb-5">
          {[
            { label: "Played", value: stats.played },
            { label: "Solved", value: stats.solved },
            { label: "Win %", value: `${solveRate}%` },
            { label: "Streak", value: stats.streak },
          ].map(({ label, value }) => (
            <div key={label} className="text-center">
              <div className="text-2xl font-bold font-mono text-text">{value}</div>
              <div className="text-xs text-muted font-mono leading-tight mt-0.5">{label}</div>
            </div>
          ))}
        </div>

        <div className="border-t border-border/50 pt-4 mb-4">
          <div className="flex justify-between text-xs font-mono text-muted mb-2">
            <span>Best Streak</span>
            <span className="text-text font-bold">{stats.bestStreak}</span>
          </div>
        </div>

        {/* By difficulty */}
        <div className="space-y-1.5">
          <p className="text-xs font-mono text-muted uppercase tracking-wider mb-2">By Difficulty</p>
          {TIERS.map((tier) => {
            const t = stats.byTier[tier];
            const pct = t.played > 0 ? Math.round((t.solved / t.played) * 100) : 0;
            return (
              <div key={tier} className="flex items-center justify-between text-xs font-mono">
                <span className={TIER_COLOR[tier]}>{tier}</span>
                <span className="text-muted">{t.solved}/{t.played} ({pct}%)</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
