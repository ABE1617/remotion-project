import React from "react";
import {
  AbsoluteFill,
  Img,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { msToFrames } from "../../../utils/timing";
import type { NewspaperRevealProps } from "./types";

// ---------------------------------------------------------------------------
// NewspaperReveal — extracted from PaperII's newspaper transition.
// Full-frame newspaper image slams up from below, holds briefly, then
// rushes out the top. Keyframe timing is deliberately uneven — fast
// slam through the middle with a 2-frame hold for impact.
// ---------------------------------------------------------------------------

// [frame offset from startMs, Y translation in px]
const KEYFRAMES: [number, number][] = [
  [0, 1920],
  [2, 1000],
  [4, 300],
  [5, 0],
  [7, 0],
  [9, -400],
  [11, -1100],
  [13, -1920],
];

export const NewspaperReveal: React.FC<NewspaperRevealProps> = ({
  startMs,
  assetPath = "torn-newspaper.png",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const atFrame = msToFrames(startMs, fps);
  const elapsed = frame - atFrame;

  if (elapsed < 0) return null;
  if (elapsed >= KEYFRAMES[KEYFRAMES.length - 1][0]) return null;

  let y = 1920;
  for (let i = 0; i < KEYFRAMES.length - 1; i++) {
    const [f1, y1] = KEYFRAMES[i];
    const [f2] = KEYFRAMES[i + 1];
    if (elapsed >= f1 && elapsed < f2) {
      y = y1;
      break;
    }
  }

  return (
    <AbsoluteFill>
      <Img
        src={staticFile(assetPath)}
        style={{
          position: "absolute",
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `translateY(${y}px)`,
        }}
      />
    </AbsoluteFill>
  );
};
