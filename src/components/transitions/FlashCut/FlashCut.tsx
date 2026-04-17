import React from "react";
import { AbsoluteFill, interpolate, OffthreadVideo } from "remotion";
import type { FlashCutProps } from "../types";

export const FLASH_CUT_PEAK_PROGRESS = 0.5;

/** Convert a hex color (#RGB, #RRGGBB) to an rgba() string with the given alpha. */
const toRgba = (hex: string, alpha: number): string => {
  let h = hex.replace("#", "").trim();
  if (h.length === 3) {
    h = h.split("").map((c) => c + c).join("");
  }
  if (h.length !== 6) return hex;
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  if ([r, g, b].some((n) => Number.isNaN(n))) return hex;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

/**
 * FlashCut — a brief color flash bridges two clips. Asymmetric ramp
 * (fast in, hold, slower out) with the hard cut hidden at peak opacity.
 */
export const FlashCut: React.FC<FlashCutProps> = ({
  clipA,
  clipB,
  progress,
  style,
  color = "#FFFFFF",
  radialGradient = false,
}) => {
  // Asymmetric ramp: 3-frame in, hold through the cut, 5-frame out.
  const panelOpacity = interpolate(
    progress,
    [0.4, 0.46, 0.55, 0.65],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const showClipB = progress >= FLASH_CUT_PEAK_PROGRESS;

  const panelBackground = radialGradient
    ? `radial-gradient(circle at center, ${color} 0%, ${color} 40%, ${toRgba(color, 0.85)} 100%)`
    : color;

  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#000", ...style }}>
      <AbsoluteFill>
        <OffthreadVideo
          src={showClipB ? clipB : clipA}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </AbsoluteFill>
      {panelOpacity > 0.001 && (
        <AbsoluteFill
          style={{
            background: panelBackground,
            opacity: panelOpacity,
            pointerEvents: "none",
          }}
        />
      )}
    </AbsoluteFill>
  );
};
