import { ImageResponse } from "next/og";
import { getPuzzleById } from "@/lib/onedle/puzzles";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Onedle puzzle preview";

const TILE_COLORS = ["#787c7e", "#c9b458", "#6aaa64"];

const DIFFICULTY_COLORS: Record<string, string> = {
  Easy: "#6aaa64",
  Medium: "#c9b458",
  Hard: "#f0941d",
  Expert: "#e63946",
};

export default function Image({ params }: { params: { id: string } }) {
  const puzzle = getPuzzleById(parseInt(params.id));

  const tileSize = 84;
  const tileGap = 10;

  const clues = puzzle?.clues ?? [];

  const formattedDate = puzzle
    ? new Date(puzzle.date + "T00:00:00Z").toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
        timeZone: "UTC",
      })
    : "";

  const difficultyColor =
    DIFFICULTY_COLORS[puzzle?.difficultyTier ?? ""] ?? "#888";

  return new ImageResponse(
    (
      <div
        style={{
          background: "#fffff5",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "56px 72px",
          position: "relative",
        }}
      >
        {/* Top accent bar */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "5px",
            background: "#7bc9a9",
          }}
        />

        {/* Header row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <p
              style={{
                color: "#666",
                fontSize: 16,
                fontFamily: "monospace",
                margin: 0,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
              }}
            >
              kev-kim.com/onedle
            </p>
            <h1
              style={{
                color: "#000",
                fontSize: 64,
                fontWeight: 700,
                margin: 0,
                fontFamily: "monospace",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
              }}
            >
              Onedle
            </h1>
          </div>

          {puzzle && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
                gap: "8px",
              }}
            >
              <p
                style={{
                  color: "#000",
                  fontSize: 48,
                  fontWeight: 700,
                  fontFamily: "monospace",
                  margin: 0,
                }}
              >
                #{puzzle.id}
              </p>
              <p
                style={{
                  color: "#666",
                  fontSize: 18,
                  fontFamily: "monospace",
                  margin: 0,
                  letterSpacing: "0.05em",
                }}
              >
                {formattedDate}
              </p>
            </div>
          )}
        </div>

        {/* Tile grid */}
        {clues.length > 0 && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: `${tileGap}px`,
              alignItems: "center",
            }}
          >
            {clues.map((clue, rowIdx) => (
              <div
                key={rowIdx}
                style={{
                  display: "flex",
                  gap: `${tileGap}px`,
                }}
              >
                {clue.pattern.map((p, colIdx) => (
                  <div
                    key={colIdx}
                    style={{
                      width: tileSize,
                      height: tileSize,
                      background: TILE_COLORS[p],
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#fff",
                      fontSize: 36,
                      fontWeight: 700,
                      fontFamily: "monospace",
                    }}
                  >
                    {clue.guess[colIdx]}
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        {/* Footer row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
          }}
        >
          <p
            style={{
              color: "#444",
              fontSize: 24,
              fontFamily: "monospace",
              margin: 0,
              letterSpacing: "0.04em",
            }}
          >
            One guess. Every day.
          </p>

          {puzzle && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <div
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  background: difficultyColor,
                }}
              />
              <p
                style={{
                  color: difficultyColor,
                  fontSize: 22,
                  fontWeight: 700,
                  fontFamily: "monospace",
                  margin: 0,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
              >
                {puzzle.difficultyTier}
              </p>
            </div>
          )}
        </div>
      </div>
    ),
    { ...size }
  );
}
