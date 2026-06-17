"use client";

import { getAllPuzzles } from "@/lib/onedle/puzzles";
import { CalendarView } from "@/components/onedle/CalendarView";
import { getStorage } from "@/lib/onedle/storage";
import { useEffect, useState } from "react";
import type { PuzzleResult } from "@/lib/onedle/storage";

export default function ArchivePage() {
  const allPuzzles = getAllPuzzles();
  const [completedPuzzles, setCompletedPuzzles] = useState<Record<number, PuzzleResult>>({});

  useEffect(() => {
    const stored = getStorage();
    setCompletedPuzzles(stored.completedPuzzles);
  }, []);

  return (
    <div className="flex flex-col items-center gap-6 pb-16">
      <div className="text-center">
        <h1 className="font-mono text-sm uppercase tracking-widest text-muted">Archive</h1>
        <p className="font-mono text-xs text-muted/60 mt-1">All {allPuzzles.length} puzzles</p>
      </div>

      <CalendarView
        puzzles={allPuzzles}
        completedPuzzles={completedPuzzles}
      />
    </div>
  );
}
