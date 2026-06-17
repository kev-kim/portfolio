"use client";

import type { DifficultyTier } from "@/lib/onedle/wordle";

type Stats = {
  played: number;
  solved: number;
  fastestTime: number | null;
  avgTime: number | null;
  byTier: Record<DifficultyTier, { played: number; solved: number; fastestTime: number | null; avgTime: number | null }>;
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

function formatTime(s: number): string {
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

export function StatsModal({ stats, onClose }: Props) {
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
            { label: "Fastest", value: stats.fastestTime !== null ? formatTime(stats.fastestTime) : "—" },
            { label: "Avg Time", value: stats.avgTime !== null ? formatTime(stats.avgTime) : "—" },
          ].map(({ label, value }) => (
            <div key={label} className="text-center">
              <div className="text-2xl font-bold font-mono text-text">{value}</div>
              <div className="text-xs text-muted font-mono leading-tight mt-0.5">{label}</div>
            </div>
          ))}
        </div>

        {/* By difficulty */}
        <div className="space-y-1.5">
          <p className="text-xs font-mono text-muted uppercase tracking-wider mb-2">By Difficulty</p>
          {TIERS.map((tier) => {
            const t = stats.byTier[tier];
            return (
              <div key={tier} className="flex items-center justify-between text-xs font-mono">
                <span className={TIER_COLOR[tier]}>{tier}</span>
                <div className="flex gap-3 text-muted">
                  <span>avg {t.avgTime !== null ? formatTime(t.avgTime) : "—"}</span>
                  <span>best {t.fastestTime !== null ? formatTime(t.fastestTime) : "—"}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
