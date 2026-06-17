"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Board } from "@/components/onedle/Board";
import { Keyboard } from "@/components/onedle/Keyboard";
import { ResultPanel } from "@/components/onedle/ResultPanel";
import { StatsModal } from "@/components/onedle/StatsModal";
import { validateGuess } from "@/lib/onedle/hash";
import { getResult, saveResult, getStats, getInProgressAttempts, saveInProgressAttempts, clearInProgress } from "@/lib/onedle/storage";
import type { Puzzle } from "@/lib/onedle/puzzles";
import type { PuzzleResult } from "@/lib/onedle/storage";

type KeyState = "unused" | "absent" | "present" | "correct";

type Props = {
  puzzle: Puzzle;
  allPuzzles: Puzzle[];
};

function buildKeyStates(clues: { guess: string; pattern: number[] }[]): Record<string, KeyState> {
  const states: Record<string, KeyState> = {};
  for (const { guess, pattern } of clues) {
    for (let i = 0; i < 5; i++) {
      const letter = guess[i].toUpperCase();
      const v = pattern[i];
      const current = states[letter];
      if (v === 2) states[letter] = "correct";
      else if (v === 1 && current !== "correct") states[letter] = "present";
      else if (v === 0 && !current) states[letter] = "absent";
    }
  }
  return states;
}

const TIER_BADGE: Record<string, string> = {
  Easy: "bg-green-500/20 text-green-700 dark:text-green-400",
  Medium: "bg-yellow-500/20 text-yellow-700 dark:text-yellow-400",
  Hard: "bg-orange-500/20 text-orange-600",
  Expert: "bg-red-500/20 text-red-600",
};

export function GameClient({ puzzle, allPuzzles }: Props) {
  const [guess, setGuess] = useState("");
  const [solved, setSolved] = useState(false);
  const [attempts, setAttempts] = useState(1);
  const [winningGuess, setWinningGuess] = useState("");
  const [shakeCount, setShakeCount] = useState(0);
  const [shakeDuration, setShakeDuration] = useState(500);
  const shakingRef = useRef(false);
  const [completedPuzzles, setCompletedPuzzles] = useState<Record<number, PuzzleResult>>({});
  const [showStats, setShowStats] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const existing = getResult(puzzle.id);
    if (existing?.solved) {
      setWinningGuess(existing.guess);
      setAttempts(existing.attempts ?? 1);
      setSolved(true);
    } else {
      setAttempts(getInProgressAttempts(puzzle.id));
    }
    const all: Record<number, PuzzleResult> = {};
    for (const p of allPuzzles) {
      const r = getResult(p.id);
      if (r) all[p.id] = r;
    }
    setCompletedPuzzles(all);
  }, [puzzle.id, allPuzzles]);

  const handleKey = useCallback(
    async (key: string) => {
      if (solved || shakingRef.current) return;
      setError(null);

      if (key === "⌫" || key === "Backspace") {
        setGuess((g) => g.slice(0, -1));
        return;
      }
      if (key === "ENTER" || key === "Enter") {
        if (guess.length < 5) {
          setError("Not enough letters");
          setShakeDuration(300);
          setShakeCount((c) => c + 1);
          return;
        }
        const win = await validateGuess(guess, puzzle.salt, puzzle.answerHash);
        if (win) {
          setSolved(true);
          setWinningGuess(guess);
          clearInProgress();
          saveResult(puzzle.id, true, guess, puzzle.date, puzzle.difficultyTier, attempts);
          setCompletedPuzzles((prev) => ({
            ...prev,
            [puzzle.id]: { solved: true, guess, date: puzzle.date, attempts },
          }));
        } else {
          const next = attempts + 1;
          setAttempts(next);
          saveInProgressAttempts(puzzle.id, next);
          shakingRef.current = true;
          setShakeDuration(500);
          setShakeCount((c) => c + 1);
          setTimeout(() => {
            shakingRef.current = false;
            setGuess("");
          }, 500);
        }
        return;
      }

      if (/^[A-Za-z]$/.test(key) && guess.length < 5) {
        setGuess((g) => g + key.toUpperCase());
      }
    },
    [solved, guess, attempts, puzzle]
  );

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      handleKey(e.key);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleKey]);

  const keyStates = buildKeyStates(puzzle.clues);
  const stats = getStats();

  return (
    <div className="flex flex-col items-center gap-5 pb-16">
      {/* Header */}
      <div className="w-full max-w-sm flex items-center justify-between">
        <div>
          <span className="font-mono text-xs text-muted">#{puzzle.id}</span>
          <span
            className={`ml-2 font-mono text-xs px-1.5 py-0.5 rounded-sm ${TIER_BADGE[puzzle.difficultyTier]}`}
          >
            {puzzle.difficultyTier}
          </span>
        </div>
        <button
          onClick={() => setShowStats(true)}
          aria-label="View statistics"
          className="font-mono text-xs text-muted hover:text-text transition-colors border border-border/50 px-2 py-1 rounded-sm"
        >
          Stats
        </button>
      </div>

      {!solved && (
        <p className="font-mono text-xs text-muted text-center">
          {attempts === 1 ? "Guess the word." : `Attempt ${attempts}`}
        </p>
      )}

      {/* Board */}
      <Board
        clues={puzzle.clues}
        activeGuess={solved ? winningGuess : guess}
        submitted={solved}
        submittedPattern={solved ? [2, 2, 2, 2, 2] : undefined}
        shakeCount={shakeCount}
        shakeDuration={shakeDuration}
      />

      {/* Reserved slot — always in layout so keyboard never shifts */}
      <p className="font-mono text-xs text-red-500 h-4 text-center">
        {error ?? ""}
      </p>

      {solved ? (
        <ResultPanel
          puzzle={puzzle}
          guess={winningGuess}
          attempts={attempts}
          allPuzzles={allPuzzles}
          completedPuzzles={completedPuzzles}
        />
      ) : (
        <>
          <input
            type="text"
            value={guess}
            readOnly
            aria-label="Your guess"
            className="sr-only"
          />
          <Keyboard keyStates={keyStates} onKey={handleKey} />
        </>
      )}

      {showStats && (
        <StatsModal stats={stats} onClose={() => setShowStats(false)} />
      )}
    </div>
  );
}
