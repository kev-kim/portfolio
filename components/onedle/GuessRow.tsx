"use client";

import { useEffect, useRef } from "react";

type Props = {
  letters: string[];
  pattern?: number[];
  revealed?: boolean;
  isActive?: boolean;
  shakeCount?: number;
  shakeDuration?: number;
};

const TILE_COLORS: Record<number, { bg: string; text: string; border: string }> = {
  0: { bg: "var(--color-surface)", text: "var(--color-text)", border: "var(--color-border)" },
  1: { bg: "#b59f3b", text: "#fff", border: "#b59f3b" },
  2: { bg: "#538d4e", text: "#fff", border: "#538d4e" },
};

export function GuessRow({ letters, pattern, revealed, isActive, shakeCount = 0, shakeDuration = 500 }: Props) {
  const rowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (shakeCount === 0 || !rowRef.current) return;
    rowRef.current.animate(
      [
        { transform: "translateX(0)" },
        { transform: "translateX(-8px)" },
        { transform: "translateX(8px)" },
        { transform: "translateX(-6px)" },
        { transform: "translateX(6px)" },
        { transform: "translateX(-3px)" },
        { transform: "translateX(3px)" },
        { transform: "translateX(0)" },
      ],
      { duration: shakeDuration, easing: "ease-in-out" }
    );
  }, [shakeCount]);

  return (
    <div ref={rowRef} className="flex gap-1.5 justify-center" role="row">
      {Array.from({ length: 5 }).map((_, i) => {
        const letter = letters[i] ?? "";
        const val = pattern ? pattern[i] : -1;
        const colors = val >= 0 ? TILE_COLORS[val] : TILE_COLORS[0];
        const delay = revealed ? `${i * 80}ms` : "0ms";

        return (
          <div
            key={i}
            role="cell"
            aria-label={letter ? `${letter}: ${val === 2 ? "correct" : val === 1 ? "present" : val === 0 ? "absent" : "empty"}` : "empty"}
            className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center font-mono font-bold text-xl border-2 select-none"
            style={{
              backgroundColor: revealed && val >= 0 ? colors.bg : "var(--color-surface)",
              color: revealed && val >= 0 ? colors.text : "var(--color-text)",
              borderColor: isActive && letter ? "var(--color-text)" : revealed && val >= 0 ? colors.border : "var(--color-border)",
              transition: revealed ? `background-color 0.1s ${delay}, border-color 0.1s ${delay}, color 0.1s ${delay}` : undefined,
              animation: revealed && val >= 0 ? `flipTile 0.4s ${delay} both` : undefined,
            }}
          >
            {letter}
          </div>
        );
      })}
    </div>
  );
}
