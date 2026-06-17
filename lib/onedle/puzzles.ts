import puzzleData from "@/data/generated_puzzles.json";
import type { DifficultyTier } from "@/lib/onedle/wordle";

export type Puzzle = {
  id: number;
  date: string;
  difficulty: number;
  difficultyTier: DifficultyTier;
  clues: { guess: string; pattern: number[] }[];
  answerHash: string;
  salt: string;
  metrics: {
    revealedLetterCount: number;
    greenCount: number;
    yellowCount: number;
    survivorsAfterClue: number[];
    maxSurvivorsBeforeUnique: number;
    informationScore: number;
  };
};

const EPOCH = "2026-01-01";

function daysSinceEpoch(dateStr: string): number {
  const epoch = new Date(EPOCH + "T00:00:00Z");
  const d = new Date(dateStr + "T00:00:00Z");
  return Math.floor((d.getTime() - epoch.getTime()) / 86400000);
}

function todayUTC(): string {
  return new Date().toISOString().slice(0, 10);
}

const puzzles = puzzleData as Puzzle[];
const byId = new Map(puzzles.map((p) => [p.id, p]));
const byDate = new Map(puzzles.map((p) => [p.date, p]));

export function getAllPuzzles(): Puzzle[] {
  return puzzles;
}

export function getPuzzleById(id: number): Puzzle | null {
  return byId.get(id) ?? null;
}

export function getPuzzleByDate(date: string): Puzzle | null {
  return byDate.get(date) ?? null;
}

export function getTodaysPuzzleId(): number {
  const days = daysSinceEpoch(todayUTC());
  return days + 1;
}

export function getTodaysPuzzle(): Puzzle | null {
  return getPuzzleById(getTodaysPuzzleId());
}
