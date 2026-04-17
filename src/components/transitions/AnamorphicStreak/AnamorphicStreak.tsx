import React from "react";
import { AbsoluteFill, Easing, interpolate, OffthreadVideo } from "remotion";
import type { AnamorphicStreakProps } from "../types";

export const ANAMORPHIC_STREAK_PEAK_PROGRESS = 0.5;

/**
 * AnamorphicStreak — horizontal lens flare sweeps across the cut. The
 * streak is a long thin gradient that expands + brightens to peak at the
 * cut, then contracts as the incoming clip takes over. Screen-blended
 * so it brightens highlights without washing the image.
 *
 * Classic anamorphic signature: blue-tinted streak, horizontal extent
 * much greater than vertical, soft fall-off at both ends.
 */
export const AnamorphicStreak: React.FC<AnamorphicStreakProps> = ({
  clipA,
  clipB,
  progress,
  style,
  color = "#6AA8FF",
  intensity = 0.9,
}) => {
  const ease = Easing.bezier(0.4, 0, 0.2, 1);
  const showB = progress >= ANAMORPHIC_STREAK_PEAK_PROGRESS;
  const activeClip = showB ? clipB : clipA;

  // Streak opacity envelope — peaks at cut.
  const streakOpacity = interpolate(
    progress,
    [0, 0.5, 1],
    [0, intensity, 0],
    { easing: ease, extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // Streak horizontal scale — starts narrow, widens at peak.
  const streakScaleX = interpolate(
    progress,
    [0, 0.5, 1],
    [0.4, 1.3, 0.4],
    { easing: ease, extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // Subtle brightness lift at peak — the "flare into lens" effect on
  // the underlying clip.
  const lift = interpolate(progress, [0.4, 0.5, 0.6], [1, 1.14, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Gradient: soft transparent → color → white core → color → transparent.
  // Screen blend multiplies highlights without darkening anything.
  const gradient = `linear-gradient(90deg,
    transparent 0%,
    ${color}00 15%,
    ${color}88 40%,
    #FFFFFF 50%,
    ${color}88 60%,
    ${color}00 85%,
    transparent 100%
  )`;

  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#000", ...style }}>
      <AbsoluteFill
        style={{
          filter: `brightness(${lift})`,
          willChange: "filter",
        }}
      >
        <OffthreadVideo
          src={activeClip}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </AbsoluteFill>

      {/* Streak band — full width, centered vertically, screen blended */}
      <AbsoluteFill
        style={{
          pointerEvents: "none",
          mixBlendMode: "screen",
          opacity: streakOpacity,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: 0,
            width: "100%",
            height: "8%",
            transform: `translateY(-50%) scaleX(${streakScaleX})`,
            background: gradient,
            filter: "blur(12px)",
          }}
        />
        {/* Core — thinner, brighter, adds the crisp center of the flare */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: 0,
            width: "100%",
            height: "1.8%",
            transform: `translateY(-50%) scaleX(${streakScaleX})`,
            background: gradient,
            filter: "blur(4px)",
          }}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
