import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Kevin Kim — Software Engineer";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#fffff5",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: "80px",
          position: "relative",
        }}
      >
        {/* Accent bar */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "4px",
            background: "#7bc9a9",
          }}
        />
        <p
          style={{
            color: "#666",
            fontSize: 16,
            fontFamily: "monospace",
            margin: 0,
            marginBottom: 20,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          kev-kim.com
        </p>
        <h1
          style={{
            color: "#000",
            fontSize: 80,
            fontWeight: 700,
            margin: 0,
            lineHeight: 1.05,
            letterSpacing: "-0.02em",
          }}
        >
          Kevin Kim
        </h1>
        <p
          style={{
            color: "#444",
            fontSize: 28,
            margin: 0,
            marginTop: 20,
            lineHeight: 1.4,
          }}
        >
          Software engineer — CS + Cognitive Science @ Johns Hopkins.
        </p>
      </div>
    ),
    { ...size }
  );
}
