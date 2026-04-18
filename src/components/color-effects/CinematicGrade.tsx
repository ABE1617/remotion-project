import React from "react";
import { AbsoluteFill } from "remotion";
import { useColorPhase, ColorEffectLayer } from "./shared";
import type { ColorTimingMode } from "./shared";

export interface CinematicGradeProps {
  children: React.ReactNode;
  // Full-strength intensity 0..1. Default 1.0.
  intensity?: number;
  // Timing. Default: persistent, 18f fade-in.
  timing?: ColorTimingMode;
}

// Teal-&-orange cinematic grade. Crushes blacks, adds warm highlight
// roll-off, and splits the tone: cool shadows / warm highlights. Layered
// with blend modes so footage underneath keeps its detail.
export const CinematicGrade: React.FC<CinematicGradeProps> = ({
  children,
  intensity = 1,
  timing = { mode: "persistent" },
}) => {
  const { intensity: k } = useColorPhase(timing, {
    baseIntensity: intensity,
    defaultAttackFrames: 6,
    defaultHoldFrames: 12,
    defaultReleaseFrames: 10,
    defaultFadeInFrames: 18,
  });

  // Contrast/saturation/warmth ramped by k
  const contrast = 1 + 0.18 * k;
  const saturation = 1 + 0.12 * k;
  const sepia = 0.08 * k;

  return (
    <AbsoluteFill>
      <AbsoluteFill
        style={{
          filter: `contrast(${contrast}) saturate(${saturation}) sepia(${sepia})`,
        }}
      >
        {children}
      </AbsoluteFill>

      {/* Cool shadows (teal) — multiply darkens shadows toward teal */}
      <ColorEffectLayer
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, rgba(10,80,95,0.0) 30%, rgba(6,52,70,0.55) 100%)",
          mixBlendMode: "multiply",
          opacity: 0.9 * k,
        }}
      />

      {/* Warm highlights (orange) — screen lifts bright areas toward amber */}
      <ColorEffectLayer
        style={{
          background:
            "radial-gradient(ellipse at 50% 40%, rgba(255,170,90,0.28) 0%, rgba(255,140,60,0.0) 55%)",
          mixBlendMode: "screen",
          opacity: 0.85 * k,
        }}
      />

      {/* Subtle vignette to contain the eye */}
      <ColorEffectLayer
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, transparent 55%, rgba(0,0,0,0.45) 100%)",
          opacity: 0.55 * k,
        }}
      />
    </AbsoluteFill>
  );
};
