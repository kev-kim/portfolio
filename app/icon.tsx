import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#121212",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span
          style={{
            color: "#7bc9a9",
            fontSize: 20,
            fontWeight: 700,
            fontFamily: "serif",
            lineHeight: 1,
          }}
        >
          K
        </span>
      </div>
    ),
    { ...size }
  );
}
