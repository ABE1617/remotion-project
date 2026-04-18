import React from "react";
import { AbsoluteFill, staticFile } from "remotion";
import { Video } from "@remotion/media";

// Video-backed stage used by color-effect demos. The effect wraps this
// single <Video/> so the demo judges the grade against real footage.
export const ColorDemoStageVideo: React.FC = () => {
  return (
    <Video
      src={staticFile("sample-video.mp4")}
      style={{ width: "100%", height: "100%", objectFit: "cover" }}
    />
  );
};

// Label strip rendered over a color-effect demo, so we can identify which
// effect is on screen during review.
export const ColorDemoLabel: React.FC<{
  name: string;
  note?: string;
}> = ({ name, note }) => {
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          left: 48,
          bottom: 48,
          padding: "14px 22px",
          background: "rgba(0,0,0,0.55)",
          color: "#fff",
          fontFamily:
            "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
          fontSize: 32,
          fontWeight: 600,
          letterSpacing: 0.5,
        }}
      >
        <div>{name}</div>
        {note && (
          <div
            style={{
              fontSize: 18,
              fontWeight: 400,
              opacity: 0.7,
              marginTop: 4,
            }}
          >
            {note}
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};
