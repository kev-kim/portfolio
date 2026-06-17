import type { DifficultyTier } from "@/lib/onedle/wordle";

export type PuzzleResult = {
  solved: boolean;
  guess: string;
  date: string;
  attempts?: number;
  timeTaken?: number; // seconds
};

export type OnedleStorage = {
  completedPuzzles: Record<number, PuzzleResult>;
  streak: number;
  bestStreak: number;
  lastPlayedDate: string | null;
  statistics: {
    played: number;
    solved: number;
    byTier: Record<DifficultyTier, { played: number; solved: number }>;
  };
};

const KEY = "onedle_v1";
const PROGRESS_KEY = "onedle_v1_progress";

const DEFAULT_TIER_STATS = (): Record<DifficultyTier, { played: number; solved: number }> => ({
  Easy: { played: 0, solved: 0 },
  Medium: { played: 0, solved: 0 },
  Hard: { played: 0, solved: 0 },
  Expert: { played: 0, solved: 0 },
});

const DEFAULT: OnedleStorage = {
  completedPuzzles: {},
  streak: 0,
  bestStreak: 0,
  lastPlayedDate: null,
  statistics: { played: 0, solved: 0, byTier: DEFAULT_TIER_STATS() },
};

function load(): OnedleStorage {
  if (typeof window === "undefined") return structuredClone(DEFAULT);
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return structuredClone(DEFAULT);
    const parsed = JSON.parse(raw) as Partial<OnedleStorage>;
    return {
      completedPuzzles: parsed.completedPuzzles ?? {},
      streak: parsed.streak ?? 0,
      bestStreak: parsed.bestStreak ?? 0,
      lastPlayedDate: parsed.lastPlayedDate ?? null,
      statistics: {
        played: parsed.statistics?.played ?? 0,
        solved: parsed.statistics?.solved ?? 0,
        byTier: { ...DEFAULT_TIER_STATS(), ...(parsed.statistics?.byTier ?? {}) },
      },
    };
  } catch {
    return structuredClone(DEFAULT);
  }
}

function save(data: OnedleStorage): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(data));
}

export function getStorage(): OnedleStorage {
  return load();
}

export function getResult(puzzleId: number): PuzzleResult | null {
  const data = load();
  return data.completedPuzzles[puzzleId] ?? null;
}

export function saveResult(
  puzzleId: number,
  solved: boolean,
  guess: string,
  date: string,
  tier: DifficultyTier,
  attempts: number = 1,
  timeTaken?: number
): void {
  const data = load();

  if (data.completedPuzzles[puzzleId]?.solved) return; // already solved, don't overwrite

  const isOverwrite = !!data.completedPuzzles[puzzleId]; // replacing a failed attempt
  data.completedPuzzles[puzzleId] = { solved, guess, date, attempts, timeTaken };
  if (!isOverwrite) data.statistics.played++;
  if (!isOverwrite) data.statistics.byTier[tier].played++;
  if (solved) data.statistics.solved++;
  if (solved) data.statistics.byTier[tier].solved++;

  // Update streak
  const today = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  if (solved) {
    if (data.lastPlayedDate === yesterday || data.lastPlayedDate === null) {
      data.streak++;
    } else if (data.lastPlayedDate !== today) {
      data.streak = 1;
    }
    data.bestStreak = Math.max(data.bestStreak, data.streak);
  } else {
    if (data.lastPlayedDate !== today) data.streak = 0;
  }
  data.lastPlayedDate = today;

  save(data);
}

export function getStats(): OnedleStorage["statistics"] & { streak: number; bestStreak: number } {
  const data = load();
  return { ...data.statistics, streak: data.streak, bestStreak: data.bestStreak };
}

export function getInProgressAttempts(puzzleId: number): number {
  if (typeof window === "undefined") return 1;
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    if (!raw) return 1;
    const { id, attempts } = JSON.parse(raw) as { id: number; attempts: number };
    return id === puzzleId ? attempts : 1;
  } catch {
    return 1;
  }
}

export function saveInProgressAttempts(puzzleId: number, attempts: number): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(PROGRESS_KEY, JSON.stringify({ id: puzzleId, attempts }));
}

export function clearInProgress(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(PROGRESS_KEY);
}
