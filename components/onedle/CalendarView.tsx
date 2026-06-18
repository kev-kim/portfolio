"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { Puzzle } from "@/lib/onedle/puzzles";
import type { PuzzleResult } from "@/lib/onedle/storage";

type Props = {
  puzzles: Puzzle[];
  completedPuzzles: Record<number, PuzzleResult>;
  initialMonth?: string; // "YYYY-MM"
  highlightDate?: string; // "YYYY-MM-DD" — which date gets the accent border (defaults to today)
};

function monthKey(date: string): string {
  return date.slice(0, 7);
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

const TIER_COLORS: Record<string, string> = {
  Easy: "text-green-600 dark:text-green-400",
  Medium: "text-yellow-600 dark:text-yellow-400",
  Hard: "text-orange-500",
  Expert: "text-red-500",
};

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export function CalendarView({ puzzles, completedPuzzles, initialMonth, highlightDate }: Props) {
  // Start with UTC (matches server render), correct to local timezone after mount.
  const [todayStr, setTodayStr] = useState(new Date().toISOString().slice(0, 10));
  useEffect(() => {
    const d = new Date();
    setTodayStr([
      d.getFullYear(),
      String(d.getMonth() + 1).padStart(2, "0"),
      String(d.getDate()).padStart(2, "0"),
    ].join("-"));
  }, []);
  const accentDate = highlightDate ?? todayStr;
  const defaultMonth = initialMonth ?? monthKey(todayStr);
  const [currentMonth, setCurrentMonth] = useState(defaultMonth);

  const [cy, cm] = currentMonth.split("-").map(Number);
  const month0 = cm - 1; // 0-indexed

  const daysInMonth = getDaysInMonth(cy, month0);
  const firstDow = getFirstDayOfWeek(cy, month0);

  // Build date→puzzle lookup
  const dateMap = new Map(puzzles.map((p) => [p.date, p]));

  const minMonth = puzzles.length > 0 ? monthKey(puzzles[0].date) : currentMonth;
  const maxMonth = puzzles.length > 0 ? monthKey(puzzles[puzzles.length - 1].date) : currentMonth;

  function prevMonth() {
    const [y, m] = currentMonth.split("-").map(Number);
    const d = new Date(y, m - 2, 1);
    setCurrentMonth(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
  }

  function nextMonth() {
    const [y, m] = currentMonth.split("-").map(Number);
    const d = new Date(y, m, 1);
    setCurrentMonth(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
  }

  const cells: (string | null)[] = [
    ...Array(firstDow).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => {
      const day = String(i + 1).padStart(2, "0");
      return `${cy}-${String(cm).padStart(2, "0")}-${day}`;
    }),
  ];

  // Pad to complete weeks
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div className="w-full max-w-sm mx-auto">
      {/* Month nav */}
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={prevMonth}
          disabled={currentMonth <= minMonth}
          aria-label="Previous month"
          className="w-8 h-8 flex items-center justify-center text-muted hover:text-text disabled:opacity-30 transition-colors"
        >
          ‹
        </button>
        <span className="font-mono text-sm font-medium text-text">
          {MONTH_NAMES[month0]} {cy}
        </span>
        <button
          onClick={nextMonth}
          disabled={currentMonth >= maxMonth}
          aria-label="Next month"
          className="w-8 h-8 flex items-center justify-center text-muted hover:text-text disabled:opacity-30 transition-colors"
        >
          ›
        </button>
      </div>

      {/* Day-of-week headers */}
      <div className="grid grid-cols-7 mb-1">
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
          <div key={i} className="text-center text-xs text-muted font-mono py-1">{d}</div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-0.5">
        {cells.map((dateStr, i) => {
          if (!dateStr) return <div key={i} />;

          const puzzle = dateMap.get(dateStr);
          const result = puzzle ? completedPuzzles[puzzle.id] : undefined;
          const isAccented = dateStr === accentDate;
          const isFuture = dateStr > todayStr;
          const day = parseInt(dateStr.split("-")[2]);

          if (!puzzle) {
            return (
              <div key={i} className="aspect-square flex items-center justify-center">
                <span className="text-xs text-muted/40 font-mono">{day}</span>
              </div>
            );
          }

          if (isFuture) {
            return (
              <div
                key={i}
                className="aspect-square flex flex-col items-center justify-center rounded border border-border/30"
              >
                <span className="text-xs text-muted/40 font-mono">{day}</span>
              </div>
            );
          }

          let bg = "bg-surface";
          let textColor = "text-text";
          if (result?.solved) { bg = "bg-green-500/20"; textColor = "text-green-700 dark:text-green-400"; }
          if (result && !result.solved) { bg = "bg-red-500/20"; textColor = "text-red-700 dark:text-red-400"; }

          return (
            <Link
              key={i}
              href={`/onedle/${puzzle.id}`}
              className={`aspect-square flex flex-col items-center justify-center rounded transition-all hover:scale-105 ${bg} ${isAccented ? "border-2 border-accent" : "border border-border/50"}`}
              title={`Puzzle #${puzzle.id} — ${puzzle.difficultyTier}`}
            >
              <span className={`text-xs font-mono font-medium ${textColor}`}>{day}</span>
              <span className={`text-[8px] font-mono leading-none ${TIER_COLORS[puzzle.difficultyTier]}`}>
                {puzzle.difficultyTier[0]}
              </span>
            </Link>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex gap-4 mt-3 justify-center text-xs font-mono text-muted">
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-green-500/20 inline-block border border-green-500/40" />Solved</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-surface inline-block border border-border/50" />Unplayed</span>
      </div>
    </div>
  );
}
