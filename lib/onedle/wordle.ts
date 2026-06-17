export type FeedbackPattern = number[]; // 0=gray, 1=yellow, 2=green

export type Clue = {
  guess: string;
  pattern: FeedbackPattern;
};

export type DifficultyMetrics = {
  revealedLetterCount: number;
  greenCount: number;
  yellowCount: number;
  survivorsAfterClue: number[];
  maxSurvivorsBeforeUnique: number;
  informationScore: number;
  difficultyScore: number;
};

export type DifficultyTier = "Easy" | "Medium" | "Hard" | "Expert";

// Exact Wordle scoring with correct repeated-letter handling.
// First pass: greens. Second pass: yellows (respecting letter budget).
export function scoreGuess(guess: string, answer: string): FeedbackPattern {
  const g = guess.toUpperCase().split("");
  const a = answer.toUpperCase().split("");
  const result = new Array<number>(5).fill(0);
  const remaining = [...a];

  // Pass 1: greens
  for (let i = 0; i < 5; i++) {
    if (g[i] === a[i]) {
      result[i] = 2;
      remaining[i] = "";
    }
  }

  // Pass 2: yellows
  for (let i = 0; i < 5; i++) {
    if (result[i] === 2) continue;
    const idx = remaining.indexOf(g[i]);
    if (idx !== -1) {
      result[i] = 1;
      remaining[idx] = "";
    }
  }

  return result;
}

export function findConsistentAnswers(clues: Clue[], answerList: string[]): string[] {
  return answerList.filter((word) =>
    clues.every((clue) => {
      const scored = scoreGuess(clue.guess, word);
      return clue.pattern.every((v, i) => v === scored[i]);
    })
  );
}

export function countRemainingAnswers(clues: Clue[], answerList: string[]): number {
  return findConsistentAnswers(clues, answerList).length;
}

export function computeDifficulty(clues: Clue[], answerList: string[]): DifficultyMetrics {
  let current = [...answerList];
  const survivorsAfterClue: number[] = [];

  for (const clue of clues) {
    current = current.filter((word) => {
      const scored = scoreGuess(clue.guess, word);
      return clue.pattern.every((v, i) => v === scored[i]);
    });
    survivorsAfterClue.push(current.length);
  }

  const greenCount = clues.reduce((sum, c) => sum + c.pattern.filter((v) => v === 2).length, 0);
  const yellowCount = clues.reduce((sum, c) => sum + c.pattern.filter((v) => v === 1).length, 0);

  const revealedLetterCount = (() => {
    const revealed = new Set<string>();
    for (const clue of clues) {
      for (let i = 0; i < 5; i++) {
        if (clue.pattern[i] > 0) revealed.add(clue.guess[i].toUpperCase());
      }
    }
    return revealed.size;
  })();

  const informationScore = survivorsAfterClue.reduce((sum, s) => sum + (s > 1 ? Math.log2(s) : 0), 0);

  const maxSurvivorsBeforeUnique =
    survivorsAfterClue.length > 1 ? Math.max(...survivorsAfterClue.slice(0, -1)) : answerList.length;

  // Higher = harder: more info needed, fewer revealed letters, more clues needed
  const difficultyScore = Math.round(
    informationScore * 10 +
      (5 - revealedLetterCount) * 4 +
      clues.length * 6 +
      Math.log2(maxSurvivorsBeforeUnique + 1) * 3
  );

  return {
    revealedLetterCount,
    greenCount,
    yellowCount,
    survivorsAfterClue,
    maxSurvivorsBeforeUnique,
    informationScore,
    difficultyScore,
  };
}

export function getDifficultyTier(score: number, revealedLetterCount: number): DifficultyTier {
  if (revealedLetterCount === 0 || score >= 98) return "Expert";
  if (score >= 65) return "Hard";
  if (score >= 45) return "Medium";
  return "Easy";
}
