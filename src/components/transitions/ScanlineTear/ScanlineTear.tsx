import React from "react";
import { AbsoluteFill, interpolate, OffthreadVideo } from "remotion";
import type { ScanlineTearProps } from "../types";

export const SCANLINE_TEAR_PEAK_PROGRESS = 0.5;

// Deterministic pseudo-random per band.
function rng(i: number, seed: number): number {
  const x = Math.sin(i * 12.9898 + seed * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

/**
 * ScanlineTear — VHS-style horizontal tear. The frame splits into N
 * bands, each displaced horizontally by a different random amount that
 * peaks at the cut. The cut swaps clips at peak displacement so the new
 * content "clicks back into place" as the bands settle.
 *
 * Per-band displacement amplitude is proportional to a triangular
 * envelope peaking at progress 0.5, which gives the distinctive
 * "tearing and recovering" motion.
 */
export const ScanlineTear: React.FC<ScanlineTearProps> = ({
  clipA,
  clipB,
  progress,
  style,
  bands = 10,
  peakDisplacement = 180,
  seed = 7,
}) => {
  const showB = progress >= SCANLINE_TEAR_PEAK_PROGRESS;
  const activeClip = showB ? clipB : clipA;

  const envelope = 1 - Math.abs(2 * progress - 1);
  const bandHeight = 100 / bands;

  // Also dial in a small overall vertical jitter on the full stack for
  // the "tracking error" feel at peak.
  const verticalJitter = envelope * 4 * (rng(99, seed) - 0.5);

  // Very brief white flash at the peak frame mimics head-switching noise.
  const flash = interpolate(progress, [0.48, 0.5, 0.52], [0, 0.18, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#000", ...style }}>
      <AbsoluteFill
        style={{
          transform: `translateY(${verticalJitter}px)`,
        }}
      >
        {Array.from({ length: bands }).map((_, i) => {
          // Each band is a signed random offset; amplitude scales with envelope.
          const bandShift =
            envelope * peakDisplacement * (rng(i, seed) * 2 - 1);
          const top = i * bandHeight;
          const bottom = 100 - (i + 1) * bandHeight;
          const clipPath = `inset(${top}% 0 ${bottom}% 0)`;
          return (
            <AbsoluteFill
              key={i}
              style={{
                clipPath,
                WebkitClipPath: clipPath,
                transform: `translateX(${bandShift}px)`,
                willChange: "transform",
              }}
            >
              <OffthreadVideo
                src={activeClip}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </AbsoluteFill>
          );
        })}
      </AbsoluteFill>

      {flash > 0 ? (
        <AbsoluteFill
          style={{
            backgroundColor: "#FFFFFF",
            opacity: flash,
            pointerEvents: "none",
          }}
        />
      ) : null}
    </AbsoluteFill>
  );
};
