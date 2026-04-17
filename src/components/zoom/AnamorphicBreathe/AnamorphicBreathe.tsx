import React, { useMemo } from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
  spring,
} from "remotion";
import { Video } from "@remotion/media";
import { msToFrames } from "../../../utils/timing";
import type { AnamorphicBreatheProps } from "../types";

/**
 * Anamorphic Breathe — simulates the look of shooting through expensive
 * cinema glass. Subtle zoom with chromatic aberration at edges, warm
 * vignette, horizontal anamorphic streak, halation bloom, and film grain.
 * Every layer maps to a real optical phenomenon.
 */
export const AnamorphicBreathe: React.FC<AnamorphicBreatheProps> = ({
  src,
  events,
  style,
  caStrength = 2.5,
  streakIntensity = 0.6,
  grainOpacity = 0.04,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Calculate zoom progress
  let zoomProgress = 0;
  let originX = 0.5;
  let originY = 0.45;
  let targetScale = 1.12;

  if (events.length === 0) {
    // Full-duration mode
    zoomProgress = interpolate(frame, [0, durationInFrames], [0, 1], {
      easing: Easing.inOut(Easing.cubic),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  } else {
    for (const event of events) {
      const eventStart = msToFrames(event.startMs, fps);
      const eventEnd = msToFrames(event.startMs + event.durationMs, fps);
      if (frame < eventStart || frame > eventEnd) continue;

      targetScale = event.scale ?? 1.12;
      originX = event.originX ?? 0.5;
      originY = event.originY ?? 0.45;

      // Spring-based zoom with slight overshoot for the "breathe"
      const springVal = spring({
        frame: frame - eventStart,
        fps,
        config: { damping: 14, mass: 0.8, stiffness: 120, overshootClamping: false },
        durationInFrames: eventEnd - eventStart,
      });
      zoomProgress = springVal;
    }
  }

  const scale = 1 + (targetScale - 1) * zoomProgress;
  const caOffset = caStrength * zoomProgress;
  const streakAlpha = streakIntensity * zoomProgress;

  // Unique SVG filter IDs per instance to avoid collisions
  const filterId = useMemo(
    () => `anamorphic-ca-${Math.random().toString(36).slice(2, 8)}`,
    []
  );

  return (
    <AbsoluteFill style={{ overflow: "hidden", ...style }}>
      {/* SVG filter for chromatic aberration */}
      <svg width="0" height="0" style={{ position: "absolute" }}>
        <defs>
          <filter id={filterId} colorInterpolationFilters="sRGB">
            {/* Red channel — shift left */}
            <feColorMatrix
              type="matrix"
              values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"
              result="red"
            />
            <feOffset in="red" dx={-caOffset} dy={0} result="redShift" />
            {/* Green channel — stays centered */}
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0"
              result="green"
            />
            {/* Blue channel — shift right */}
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0"
              result="blue"
            />
            <feOffset in="blue" dx={caOffset} dy={0} result="blueShift" />
            <feBlend mode="screen" in="redShift" in2="green" result="rg" />
            <feBlend mode="screen" in="rg" in2="blueShift" />
          </filter>
        </defs>
      </svg>

      {/* Video layer with zoom + chromatic aberration */}
      <AbsoluteFill
        style={{
          filter: caOffset > 0.2 ? `url(#${filterId})` : undefined,
        }}
      >
        <Video
          src={src}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: `scale(${scale})`,
            transformOrigin: `${originX * 100}% ${originY * 100}%`,
          }}
        />
      </AbsoluteFill>

      {/* Warm vignette — amber-tinted like real lens coating */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse at center,
            transparent 30%,
            rgba(20, 12, 5, ${0.18 * zoomProgress}) 65%,
            rgba(10, 5, 2, ${0.5 * zoomProgress}) 100%)`,
          pointerEvents: "none",
        }}
      />

      {/* Anamorphic horizontal light streak */}
      {streakAlpha > 0.01 && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(180deg,
              transparent 38%,
              rgba(255, 200, 120, ${0.06 * streakAlpha}) 46%,
              rgba(255, 180, 80, ${0.1 * streakAlpha}) 50%,
              rgba(255, 200, 120, ${0.06 * streakAlpha}) 54%,
              transparent 62%)`,
            mixBlendMode: "screen",
            filter: `blur(${12 * zoomProgress}px)`,
            pointerEvents: "none",
          }}
        />
      )}

      {/* Halation bloom — warm glow from center */}
      <div
        style={{
          position: "absolute",
          inset: "-5%",
          background: `radial-gradient(ellipse at center,
            rgba(255, 140, 60, ${0.04 * zoomProgress}) 0%,
            transparent 70%)`,
          mixBlendMode: "screen",
          filter: "blur(40px)",
          pointerEvents: "none",
        }}
      />

      {/* Film grain — animated per frame */}
      <svg width="0" height="0" style={{ position: "absolute" }}>
        <defs>
          <filter id={`${filterId}-grain`}>
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.65"
              numOctaves={3}
              seed={frame}
              stitchTiles="stitch"
            />
            <feColorMatrix type="saturate" values="0" />
          </filter>
        </defs>
      </svg>
      <div
        style={{
          position: "absolute",
          inset: 0,
          filter: `url(#${filterId}-grain)`,
          opacity: grainOpacity * Math.max(zoomProgress, 0.3),
          mixBlendMode: "overlay",
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};
