import React from "react";
import { AbsoluteFill, interpolate, OffthreadVideo } from "remotion";
import type { InversionProps } from "../types";

export const INVERSION_PEAK_PROGRESS = 0.5;

/**
 * Inversion — brief color-invert flash at the cut. Sharp, percussive,
 * looks like a negative-film exposure hitting the scene for one beat.
 *
 * Keeps the color math in CSS `filter: invert()` so both sides of the
 * cut can use the same shader. The peak is intentionally narrow — default
 * 0.1 progress units, which at a 12-frame transition is about 1-2 frames.
 */
export const Inversion: React.FC<InversionProps> = ({
  clipA,
  clipB,
  progress,
  style,
  peakWidth = 0.1,
}) => {
  const showB = progress >= INVERSION_PEAK_PROGRESS;
  const activeClip = showB ? clipB : clipA;

  const halfWidth = peakWidth / 2;
  const invertAmount = interpolate(
    progress,
    [0.5 - halfWidth, 0.5, 0.5 + halfWidth],
    [0, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // Small scale punch at the peak for beat emphasis.
  const pulseScale = interpolate(
    progress,
    [0.5 - halfWidth, 0.5, 0.5 + halfWidth],
    [1, 1.03, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#000", ...style }}>
      <AbsoluteFill
        style={{
          transform: `scale(${pulseScale})`,
          filter: `invert(${invertAmount})`,
          willChange: "transform, filter",
        }}
      >
        <OffthreadVideo
          src={activeClip}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
