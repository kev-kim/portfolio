"use client";

type KeyState = "unused" | "absent" | "present" | "correct";

type Props = {
  keyStates: Record<string, KeyState>;
  onKey: (key: string) => void;
};

const ROWS = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "⌫"],
];

const STATE_COLORS: Record<KeyState, string> = {
  unused: "bg-surface text-text border-border hover:bg-muted/20",
  absent: "bg-surface/50 text-muted border-border/50",
  present: "text-white border-transparent",
  correct: "text-white border-transparent",
};

export function Keyboard({ keyStates, onKey }: Props) {
  return (
    <div
      className="flex flex-col gap-1.5 items-center w-full sm:w-auto select-none"
      role="group"
      aria-label="On-screen keyboard"
    >
      {ROWS.map((row, ri) => (
        <div key={ri} className="flex gap-1 sm:gap-1.5 w-full sm:w-auto justify-center">
          {row.map((key) => {
            const state = keyStates[key] ?? "unused";
            return (
              <button
                key={key}
                aria-label={key === "⌫" ? "Backspace" : key}
                onPointerDown={(e) => { e.preventDefault(); onKey(key); }}
                className={`
                  h-14 sm:h-14 rounded font-mono font-bold border transition-colors
                  ${key === "ENTER"
                    ? "flex-[1.5] sm:flex-none sm:px-3 text-xs"
                    : key === "⌫"
                    ? "flex-[1.5] sm:flex-none sm:px-3 text-xl sm:text-xl"
                    : "flex-1 sm:flex-none sm:w-10 text-sm"}
                  ${STATE_COLORS[state]}
                `}
                style={
                  state === "present"
                    ? { backgroundColor: "#b59f3b" }
                    : state === "correct"
                    ? { backgroundColor: "#538d4e" }
                    : undefined
                }
              >
                {key}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
