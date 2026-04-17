import React from "react";
import {
  AbsoluteFill,
  interpolate,
  OffthreadVideo,
  useCurrentFrame,
} from "remotion";
import { MotionBlurWrap } from "../shared/MotionBlurWrap";
import type { ShakeProps } from "../types";

export const SHAKE_PEAK_PROGRESS = 0.5;

// Jitter amplitude in pixels per intensity tier.
const INTENSITY_AMP: Record<NonNullable<ShakeProps["intensity"]>, number> = {
  subtle: 10,
  medium: 24,
  heavy: 48,
};

// Deterministic pseudo-random based on frame + seed — two incommensurate
// sine frequencies summed so the motion never repeats visibly over a short
// transition.
function jitter(frame: number, seed: number, phase: number): number {
  return (
    Math.sin(frame * 0.73 + seed + phase) * 0.5 +
    Math.sin(frame * 1.97 + seed * 2.3 + phase) * 0.5
  );
}

/**
 * Shake — beat-drop shake cut. Both halves render with a triangular jitter
 * envelope peaking at the cut (progress 0.5). "heavy" intensity also emits
 * a brief flash at peak for the classic Hormozi-style punch.
 *
 * Uses MotionBlurWrap: on medium/heavy, the shake velocity drives a short
 * sampled streak in the direction of the current jitter so the motion
 * reads as real, not clip-art shake.
 */
export const Shake: React.FC<ShakeProps> = ({
  clipA,
  clipB,
  progress,
  style,
  intensity = "medium",
  seed = 1,
  flashColor = "#FFFFFF",
}) => {
  const frame = useCurrentFrame();
  const baseAmp = INTENSITY_AMP[intensity];

  // Triangular envelope — 0 → 1 → 0 across progress 0 → 0.5 → 1.
  const envelope = 1 - Math.abs(2 * progress - 1);
  const amp = baseAmp * envelope;

  const jx = amp * jitter(frame, seed, 0);
  const jy = amp * jitter(frame, seed * 1.3 + 11, Math.PI / 2);

  // Hard cut at the peak.
  const showB = progress >= SHAKE_PEAK_PROGRESS;
  const activeClip = showB ? clipB : clipA;

  // Slight baseline scale-up so the jittered edges never reveal the stage.
  const overscan = 1.08 + envelope * 0.04;

  // Motion blur strength — scales with jitter magnitude, short streak.
  const blurAmount = Math.sqrt(jx * jx + jy * jy) * 0.35;
  const blurX = blurAmount * Math.sign(jx);
  const blurY = blurAmount * Math.sign(jy);

  // Flash only on "heavy" — peaks with the cut, very short.
  const flashOpacity =
    intensity === "heavy"
      ? interpolate(progress, [0.46, 0.5, 0.54], [0, 0.5, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : 0;

  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#000", ...style }}>
      <AbsoluteFill
        style={{
          transform: `translate(${jx}px, ${jy}px) scale(${overscan})`,
          willChange: "transform",
        }}
      >
        <MotionBlurWrap
          samples={intensity === "heavy" ? 6 : 4}
          offsetX={blurX}
          offsetY={blurY}
        >
          <OffthreadVideo
            src={activeClip}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </MotionBlurWrap>
      </AbsoluteFill>

      {flashOpacity > 0 ? (
        <AbsoluteFill
          style={{
            backgroundColor: flashColor,
            opacity: flashOpacity,
            pointerEvents: "none",
          }}
        />
      ) : null}
    </AbsoluteFill>
  );
};
