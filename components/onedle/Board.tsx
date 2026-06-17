"use client";

import { GuessRow } from "@/components/onedle/GuessRow";

type Clue = { guess: string; pattern: number[] };

type Props = {
  clues: Clue[];
  activeGuess: string;
  submitted: boolean;
  submittedPattern?: number[];
  shakeCount: number;
  shakeDuration: number;
};

export function Board({ clues, activeGuess, submitted, submittedPattern, shakeCount, shakeDuration }: Props) {
  const activeLetters = activeGuess.padEnd(5, "").split("");

  return (
    <div className="flex flex-col gap-1.5 items-center" role="grid" aria-label="Onedle board">
      {clues.map((clue, i) => (
        <GuessRow
          key={i}
          letters={clue.guess.split("")}
          pattern={clue.pattern}
          revealed
        />
      ))}

      <GuessRow
        letters={activeLetters}
        pattern={submitted ? submittedPattern : undefined}
        revealed={submitted && !!submittedPattern}
        isActive={!submitted}
        shakeCount={submitted ? 0 : shakeCount}
        shakeDuration={shakeDuration}
      />
    </div>
  );
}
