"use client";

import { useState } from "react";
import Link from "next/link";
import { CalendarView } from "@/components/onedle/CalendarView";
import type { Puzzle } from "@/lib/onedle/puzzles";
import type { PuzzleResult } from "@/lib/onedle/storage";

type Props = {
  puzzle: Puzzle;
  guess: string;
  attempts: number;
  timeTaken?: number;
  allPuzzles: Puzzle[];
  completedPuzzles: Record<number, PuzzleResult>;
};

const TIER_COLOR: Record<string, string> = {
  Easy: "text-green-600 dark:text-green-400",
  Medium: "text-yellow-600 dark:text-yellow-400",
  Hard: "text-orange-500",
  Expert: "text-red-500",
};

const EMOJI: Record<number, string> = { 0: "⬛", 1: "🟨", 2: "🟩" };

function formatTime(s: number): string {
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

function buildShareText(puzzle: Puzzle, attempts: number, timeTaken?: number): string {
  const clueLines = puzzle.clues.map((c) =>
    c.pattern.map((v) => EMOJI[v]).join("")
  );
  const timeStr = timeTaken != null ? ` · ${formatTime(timeTaken)}` : "";

  return [
    `Onedle #${puzzle.id} — ${puzzle.difficultyTier}`,
    `✓ in ${attempts} attempt${attempts === 1 ? "" : "s"}${timeStr}`,
    `https://kev-kim.com/onedle`
  ].join("\n");
}

export function ResultPanel({ puzzle, guess, attempts, timeTaken, allPuzzles, completedPuzzles }: Props) {
  const [copied, setCopied] = useState(false);

  const nextPuzzle = allPuzzles.find((p) => p.id === puzzle.id + 1);
  const todayStr = new Date().toISOString().slice(0, 10);
  const nextAvailable = nextPuzzle && nextPuzzle.date <= todayStr;

  async function handleShare() {
    const text = buildShareText(puzzle, attempts, timeTaken);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  }

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      {/* Result header */}
      <div className="text-center">
        <div className="text-5xl mb-2">✓</div>
        <p className="font-mono text-sm text-muted">
          Solved in{" "}
          <span className="text-text font-bold">{attempts}</span>{" "}
          {attempts === 1 ? "attempt" : "attempts"}
          {timeTaken != null && (
            <span className="text-muted"> · <span className="text-text font-bold tabular-nums">{formatTime(timeTaken)}</span></span>
          )}
        </p>
        <p className="font-mono text-xs text-muted mt-1">
          The answer was{" "}
          <span className="text-text font-bold">{guess.toUpperCase()}</span>
        </p>
      </div>

      {/* Puzzle info */}
      <div className="inline-flex text-xs font-mono text-muted border border-border rounded-sm divide-x divide-border">
        <span className="px-4 py-2">Puzzle <span className="text-text">#{puzzle.id}</span></span>
        <span className={`px-4 py-2 ${TIER_COLOR[puzzle.difficultyTier]}`}>{puzzle.difficultyTier}</span>
        <span className="px-4 py-2">Attempts <span className="text-text">{attempts}</span></span>
        {timeTaken != null && (
          <span className="px-4 py-2 tabular-nums">Time <span className="text-text">{formatTime(timeTaken)}</span></span>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-2 justify-center">
        <button
          onClick={handleShare}
          className="font-mono text-xs px-4 py-2 border border-border bg-surface hover:bg-border/10 transition-colors rounded-sm"
        >
          {copied ? "Copied!" : "Share"}
        </button>
        <Link
          href="/onedle/archive"
          className="font-mono text-xs px-4 py-2 border border-border hover:bg-surface transition-colors rounded-sm"
        >
          See all puzzles
        </Link>
        {puzzle.id > 1 && (
          <Link
            href={`/onedle/${puzzle.id - 1}`}
            className="font-mono text-xs px-4 py-2 border border-accent text-accent hover:bg-accent/10 transition-colors rounded-sm"
          >
            ← Prev
          </Link>
        )}
        {nextAvailable && nextPuzzle && (
          <Link
            href={`/onedle/${nextPuzzle.id}`}
            className="font-mono text-xs px-4 py-2 border border-accent text-accent hover:bg-accent/10 transition-colors rounded-sm"
          >
            Next →
          </Link>
        )}
      </div>

      {/* Calendar */}
      <div className="w-full border-t border-border/50 pt-6">
        <p className="font-mono text-xs text-muted uppercase tracking-wider text-center mb-4">Your history</p>
        <CalendarView
          puzzles={allPuzzles}
          completedPuzzles={completedPuzzles}
          initialMonth={puzzle.date.slice(0, 7)}
        />
      </div>
    </div>
  );
}
