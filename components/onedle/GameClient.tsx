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

function formatTime(s: number): string {
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

const TIER_BADGE: Record<string, string> = {
  Easy: "bg-green-500/20 text-green-700 dark:text-green-400",
  Medium: "bg-yellow-500/20 text-yellow-700 dark:text-yellow-400",
  Hard: "bg-orange-500/20 text-orange-600",
  Expert: "bg-red-500/20 text-red-600",
};

function IntroOverlay({ onStart }: { onStart: () => void }) {
  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center bg-bg/90 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-5 text-center max-w-xs px-6">
        <p className="font-mono text-[10px] uppercase tracking-widest text-muted">How to play</p>
        <p className="font-mono text-sm text-text leading-relaxed">
          You're given clues that narrow the answer down to one word. Figure it out in as few tries and as fast as possible.
        </p>
        <div className="font-mono text-xs text-muted space-y-1">
          <p>🟩 right letter, right spot</p>
          <p>🟨 right letter, wrong spot</p>
          <p>⬛ not in the word</p>
        </div>
        <p className="font-mono text-xs text-muted">Your timer starts when you press Start.</p>
        <button
          onClick={onStart}
          autoFocus
          className="font-mono text-sm px-8 py-2.5 bg-accent text-bg hover:bg-accent/90 transition-colors rounded-sm mt-1"
        >
          Start →
        </button>
      </div>
    </div>
  );
}

export function GameClient({ puzzle, allPuzzles }: Props) {
  const [guess, setGuess] = useState("");
  const [solved, setSolved] = useState(false);
  const [attempts, setAttempts] = useState(1);
  const [mounted, setMounted] = useState(false);
  const [winningGuess, setWinningGuess] = useState("");
  const [shakeCount, setShakeCount] = useState(0);
  const [shakeDuration, setShakeDuration] = useState(500);
  const shakingRef = useRef(false);
  const [completedPuzzles, setCompletedPuzzles] = useState<Record<number, PuzzleResult>>({});
  const [showStats, setShowStats] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Timer
  const [started, setStarted] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const elapsedRef = useRef(0);
  const [timeTaken, setTimeTaken] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (!started || solved) return;
    const id = setInterval(() => {
      elapsedRef.current += 1;
      setElapsed(elapsedRef.current);
    }, 1000);
    return () => clearInterval(id);
  }, [started, solved]);

  useEffect(() => {
    setMounted(true);
    const existing = getResult(puzzle.id);
    if (existing?.solved) {
      setWinningGuess(existing.guess);
      setAttempts(existing.attempts ?? 1);
      setTimeTaken(existing.timeTaken);
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
      if (solved || shakingRef.current || !started) return;
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
          const finalTime = elapsedRef.current;
          setSolved(true);
          setWinningGuess(guess);
          setTimeTaken(finalTime);
          clearInProgress();
          saveResult(puzzle.id, true, guess, puzzle.date, puzzle.difficultyTier, attempts, finalTime);
          setCompletedPuzzles((prev) => ({
            ...prev,
            [puzzle.id]: { solved: true, guess, date: puzzle.date, attempts, timeTaken: finalTime },
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
    [solved, guess, attempts, puzzle, started]
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
    <div className="relative flex flex-col items-center gap-5 pb-16">
      {/* Intro overlay — shown until Start is pressed (only for unsolved puzzles).
          Gated behind `mounted` so server and client render the same HTML during hydration. */}
      {mounted && !solved && !started && (
        <IntroOverlay onStart={() => {
          elapsedRef.current = 0;
          setElapsed(0);
          setStarted(true);
        }} />
      )}

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
        <div className="flex flex-col items-center gap-1">
          {started && (
            <p className="font-mono text-base tabular-nums text-text">
              {formatTime(elapsed)}
            </p>
          )}
          <p className="font-mono text-sm text-muted text-center">
            {attempts === 1 ? "Guess the word." : `Attempt ${attempts}`}
          </p>
        </div>
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
          timeTaken={timeTaken}
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
