#!/usr/bin/env node
/**
 * Onedle puzzle generator.
 * Usage: npx tsx scripts/generate_puzzles.ts [--count=400] [--start-date=2026-06-17]
 *
 * Outputs: data/generated_puzzles.json
 */

import * as fs from "fs";
import * as path from "path";
import * as crypto from "crypto";

// ── Types ────────────────────────────────────────────────────────────────────

type FeedbackPattern = number[]; // 0=gray, 1=yellow, 2=green
type Clue = { guess: string; pattern: FeedbackPattern };
type DifficultyTier = "Easy" | "Medium" | "Hard" | "Expert";

type Puzzle = {
  id: number;
  date: string;
  difficulty: number;
  difficultyTier: DifficultyTier;
  clues: Clue[];
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

// ── Wordle engine ─────────────────────────────────────────────────────────────

function scoreGuess(guess: string, answer: string): FeedbackPattern {
  const g = guess.split("");
  const a = answer.split("");
  const result = new Array<number>(5).fill(0);
  const remaining = [...a];
  for (let i = 0; i < 5; i++) {
    if (g[i] === a[i]) { result[i] = 2; remaining[i] = ""; }
  }
  for (let i = 0; i < 5; i++) {
    if (result[i] === 2) continue;
    const idx = remaining.indexOf(g[i]);
    if (idx !== -1) { result[i] = 1; remaining[idx] = ""; }
  }
  return result;
}

function patternToKey(pattern: FeedbackPattern): number {
  return pattern[0] * 81 + pattern[1] * 27 + pattern[2] * 9 + pattern[3] * 3 + pattern[4];
}

function isConsistent(clues: Clue[], word: string): boolean {
  return clues.every((c) => {
    const s = scoreGuess(c.guess, word);
    return c.pattern.every((v, i) => v === s[i]);
  });
}

function filterCandidates(clues: Clue[], words: string[]): string[] {
  return words.filter((w) => isConsistent(clues, w));
}

// ── Precomputed feedback matrix ───────────────────────────────────────────────

function buildFeedbackMatrix(words: string[]): number[][] {
  const n = words.length;
  const matrix: number[][] = Array.from({ length: n }, () => new Array<number>(n).fill(0));
  for (let g = 0; g < n; g++) {
    for (let a = 0; a < n; a++) {
      matrix[g][a] = patternToKey(scoreGuess(words[g], words[a]));
    }
  }
  return matrix;
}

// Find the guess (from candidateGuesses) that most reduces the candidate pool.
// Returns [bestGuessIdx, partitionSizes]
function findBestGuess(
  candidates: number[], // indices into words
  allWords: string[],
  matrix: number[][]
): number {
  let bestGuess = candidates[0];
  let bestWorstCase = Infinity;

  // Try a fixed set of opener words plus all remaining candidates
  const trySet = candidates.length <= 50 ? candidates : candidates.slice(0, 50);

  for (const g of trySet) {
    const buckets = new Map<number, number>();
    for (const a of candidates) {
      const k = matrix[g][a];
      buckets.set(k, (buckets.get(k) ?? 0) + 1);
    }
    // Minimize the maximum bucket (worst case remaining)
    let worst = 0;
    for (const count of buckets.values()) {
      if (count > worst) worst = count;
    }
    if (worst < bestWorstCase) {
      bestWorstCase = worst;
      bestGuess = g;
    }
  }
  return bestGuess;
}

// ── Hashing ──────────────────────────────────────────────────────────────────

function sha256Hex(input: string): string {
  return crypto.createHash("sha256").update(input, "utf8").digest("hex");
}

function randomSalt(): string {
  return crypto.randomBytes(16).toString("hex");
}

// ── Difficulty ────────────────────────────────────────────────────────────────

function computeDifficultyScore(
  clues: Clue[],
  totalWords: number,
  words: string[]
): { score: number; tier: DifficultyTier; metrics: Puzzle["metrics"] } {
  let current = words;
  const survivorsAfterClue: number[] = [];
  for (const clue of clues) {
    current = filterCandidates([clue], current);
    survivorsAfterClue.push(current.length);
  }

  const greenCount = clues.reduce((s, c) => s + c.pattern.filter((v) => v === 2).length, 0);
  const yellowCount = clues.reduce((s, c) => s + c.pattern.filter((v) => v === 1).length, 0);
  const revealedSet = new Set<string>();
  for (const c of clues)
    for (let i = 0; i < 5; i++)
      if (c.pattern[i] > 0) revealedSet.add(c.guess[i]);
  const revealedLetterCount = revealedSet.size;

  const informationScore = survivorsAfterClue.reduce((s, n) => s + (n > 1 ? Math.log2(n) : 0), 0);
  const maxSurvivorsBeforeUnique =
    survivorsAfterClue.length > 1
      ? Math.max(...survivorsAfterClue.slice(0, -1))
      : totalWords;

  const difficultyScore = Math.round(
    informationScore * 10 +
    (5 - revealedLetterCount) * 4 +
    clues.length * 6 +
    Math.log2(maxSurvivorsBeforeUnique + 1) * 3
  );

  const tier: DifficultyTier =
    revealedLetterCount === 0 || difficultyScore >= 98 ? "Expert"
      : difficultyScore >= 65 ? "Hard"
      : difficultyScore >= 45 ? "Medium"
      : "Easy";

  return {
    score: difficultyScore,
    tier,
    metrics: {
      revealedLetterCount,
      greenCount,
      yellowCount,
      survivorsAfterClue,
      maxSurvivorsBeforeUnique,
      informationScore,
    },
  };
}

// ── Puzzle generation ─────────────────────────────────────────────────────────

const OPENER_WORDS = [
  "CRANE", "SLATE", "STARE", "AUDIO", "RAISE", "AROSE",
  "IRATE", "ROAST", "CRATE", "LEAST", "TALES", "TRAIN",
  "BLOT", "GROUT", "FLUNK", "CRIMP",
];

function generatePuzzleForAnswer(
  answerIdx: number,
  allWordIdxs: number[],
  words: string[],
  matrix: number[][]
): Clue[] | null {
  const answer = words[answerIdx];
  let candidates = [...allWordIdxs];
  const clues: Clue[] = [];

  for (let round = 0; round < 4; round++) {
    let guessIdx: number;
    if (round === 0) {
      // Try each opener; pick one whose pattern gives fewest survivors
      // Fall back to the first non-answer candidate
      let bestOpener = candidates.find((c) => c !== answerIdx) ?? -1;
      if (bestOpener === -1) return null;
      let bestSurvivors = candidates.length;
      for (const opener of OPENER_WORDS) {
        const oIdx = words.indexOf(opener);
        if (oIdx === -1 || oIdx === answerIdx) continue;
        const patKey = matrix[oIdx][answerIdx];
        const surviving = candidates.filter((c) => matrix[oIdx][c] === patKey);
        if (surviving.length < bestSurvivors) {
          bestSurvivors = surviving.length;
          bestOpener = oIdx;
        }
      }
      guessIdx = bestOpener;
    } else {
      guessIdx = findBestGuess(candidates, words, matrix);
      // Never use the answer itself as a clue — substitute the next best candidate
      if (guessIdx === answerIdx) {
        const alt = candidates.find((c) => c !== answerIdx);
        if (alt === undefined) return null;
        guessIdx = alt;
      }
    }

    const pattern = scoreGuess(words[guessIdx], answer);

    // Reject if this clue gives away too much — 4+ greens is trivially easy
    if (pattern.filter((v) => v === 2).length >= 4) return null;

    clues.push({ guess: words[guessIdx], pattern });

    const patKey = matrix[guessIdx][answerIdx];
    candidates = candidates.filter((c) => matrix[guessIdx][c] === patKey);

    if (candidates.length === 1 && candidates[0] === answerIdx) {
      return clues; // valid puzzle
    }
    if (candidates.length === 0) return null;
  }

  if (candidates.length === 1 && candidates[0] === answerIdx) return clues;
  return null;
}

// ── Date helpers ──────────────────────────────────────────────────────────────

const EPOCH = "2026-01-01";

function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr + "T00:00:00Z");
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2);
  const countArg = args.find((a) => a.startsWith("--count="));
  const targetCount = countArg ? parseInt(countArg.split("=")[1]) : 400;

  const rootDir = path.resolve(__dirname, "..");
  const answersPath = path.join(rootDir, "data", "answers.txt");
  const outputPath = path.join(rootDir, "data", "generated_puzzles.json");

  console.log("Loading word list…");
  const rawWords = fs.readFileSync(answersPath, "utf-8")
    .split("\n")
    .map((w) => w.trim().toUpperCase())
    .filter((w) => w.length === 5 && /^[A-Z]+$/.test(w));

  // Deduplicate
  const words = [...new Set(rawWords)];
  console.log(`Loaded ${words.length} words.`);

  console.log("Precomputing feedback matrix…");
  const matrix = buildFeedbackMatrix(words);
  const allIdxs = words.map((_, i) => i);

  console.log(`Generating up to ${targetCount} puzzles…`);
  const puzzles: Puzzle[] = [];
  let attempts = 0;

  // Shuffle words so we don't always pick the first ones
  const shuffled = [...allIdxs].sort(() => Math.random() - 0.5);

  for (const answerIdx of shuffled) {
    if (puzzles.length >= targetCount) break;
    attempts++;

    const clues = generatePuzzleForAnswer(answerIdx, allIdxs, words, matrix);
    if (!clues) continue;

    const salt = randomSalt();
    const answer = words[answerIdx];
    const answerHash = sha256Hex(answer + salt);

    const { score, tier, metrics } = computeDifficultyScore(clues, words.length, words);

    const id = puzzles.length + 1;
    const date = addDays(EPOCH, id - 1);

    puzzles.push({
      id,
      date,
      difficulty: score,
      difficultyTier: tier,
      clues,
      answerHash,
      salt,
      metrics,
    });
  }

  // Sort by id (already in order, but ensure)
  puzzles.sort((a, b) => a.id - b.id);

  fs.writeFileSync(outputPath, JSON.stringify(puzzles, null, 2));

  // Summary
  const tierCounts: Record<DifficultyTier, number> = { Easy: 0, Medium: 0, Hard: 0, Expert: 0 };
  for (const p of puzzles) tierCounts[p.difficultyTier]++;

  console.log("\n── Generation Summary ──");
  console.log(`Attempts:  ${attempts}`);
  console.log(`Generated: ${puzzles.length} puzzles`);
  console.log(`Dates:     ${puzzles[0]?.date} → ${puzzles[puzzles.length - 1]?.date}`);
  console.log("\nDifficulty tiers:");
  for (const [tier, count] of Object.entries(tierCounts)) {
    console.log(`  ${tier.padEnd(8)} ${count}`);
  }
  console.log(`\nOutput: ${outputPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
