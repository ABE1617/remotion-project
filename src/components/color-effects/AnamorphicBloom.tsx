import React from "react";
import { AbsoluteFill } from "remotion";
import { useColorPhase, ColorEffectLayer } from "./shared";
import type { ColorTimingMode } from "./shared";

export interface AnamorphicBloomProps {
  children: React.ReactNode;
  // Horizontal stretch blur in px. Default 140.
  streakWidth?: number;
  // Vertical bleed in px — keep small for a real lens feel. Default 10.
  streakHeight?: number;
  // Bloom color — anamorphic lenses default cyan/blue. Default #9ad6ff.
  color?: string;
  // Highlight threshold 0..1. Default 0.6.
  threshold?: number;
  intensity?: number;
  timing?: ColorTimingMode;
}

// Anamorphic lens bloom: real cine anamorphic glass smears bright highlights
// into a horizontal cyan streak. We replicate it with a luma-isolated
// highlight pass, stretch-blur via SVG, tint cyan, and screen back. The
// result gives any footage a premium cinema-lens fingerprint without
// touching base exposure.
export const AnamorphicBloom: React.FC<AnamorphicBloomProps> = ({
  children,
  streakWidth = 140,
  streakHeight = 10,
  color = "#9ad6ff",
  threshold = 0.6,
  intensity = 1,
  timing = { mode: "persistent" },
}) => {
  const { intensity: k } = useColorPhase(timing, {
    baseIntensity: intensity,
    defaultAttackFrames: 6,
    defaultHoldFrames: 14,
    defaultReleaseFrames: 12,
    defaultFadeInFrames: 18,
  });

  const slope = 1 / Math.max(0.01, 1 - threshold);
  const intercept = -threshold * slope;
  const filterId = "anamorphic-streak";

  return (
    <AbsoluteFill>
      <AbsoluteFill>{children}</AbsoluteFill>

      <AbsoluteFill
        style={{
          mixBlendMode: "screen",
          opacity: 0.95 * k,
          pointerEvents: "none",
        }}
      >
        <AbsoluteFill style={{ filter: `url(#${filterId})` }}>
          {children}
        </AbsoluteFill>

        <ColorEffectLayer
          style={{
            background: color,
            mixBlendMode: "multiply",
          }}
        />
      </AbsoluteFill>

      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden>
        <filter id={filterId}>
          {/* Luma → scalar */}
          <feColorMatrix
            type="matrix"
            values="0.299 0.587 0.114 0 0
                    0.299 0.587 0.114 0 0
                    0.299 0.587 0.114 0 0
                    0     0     0     1 0"
          />
          {/* Threshold */}
          <feComponentTransfer>
            <feFuncR type="linear" slope={slope} intercept={intercept} />
            <feFuncG type="linear" slope={slope} intercept={intercept} />
            <feFuncB type="linear" slope={slope} intercept={intercept} />
          </feComponentTransfer>
          {/* Horizontal stretch blur → anamorphic streak */}
          <feGaussianBlur stdDeviation={`${streakWidth} ${streakHeight}`} />
        </filter>
      </svg>
    </AbsoluteFill>
  );
};
