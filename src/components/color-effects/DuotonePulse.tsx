import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { useColorPhase, ColorEffectLayer } from "./shared";
import type { ColorTimingMode } from "./shared";

export interface DuotonePulseProps {
  children: React.ReactNode;
  // Dark tone (maps to shadows). Default deep navy.
  shadowColor?: string;
  // Light tone (maps to highlights). Default warm amber.
  highlightColor?: string;
  intensity?: number;
  timing?: ColorTimingMode;
  // Beat BPM — controls a subtle breathing modulation on intensity.
  bpm?: number;
  // Framerate for beat calc. Default 30.
  fps?: number;
}

// Editorial duotone grade. Desaturated base, then two color layers applied
// via blend modes: shadowColor via multiply, highlightColor via screen.
// Intensity breathes with the beat so it feels alive, not pasted on.
export const DuotonePulse: React.FC<DuotonePulseProps> = ({
  children,
  shadowColor = "#0c1a36",
  highlightColor = "#f2b160",
  intensity = 1,
  timing = { mode: "persistent" },
  bpm = 100,
  fps = 30,
}) => {
  const frame = useCurrentFrame();
  const { intensity: k } = useColorPhase(timing, {
    baseIntensity: intensity,
    defaultAttackFrames: 6,
    defaultHoldFrames: 12,
    defaultReleaseFrames: 10,
    defaultFadeInFrames: 20,
  });

  const beatPeriod = (60 / bpm) * fps; // frames per beat
  const beatPhase = (frame % beatPeriod) / beatPeriod; // 0..1
  // Breathe ±0.08 intensity around k
  const breathe = 1 + 0.08 * Math.sin(beatPhase * Math.PI * 2);
  const effective = Math.min(1, k * breathe);

  return (
    <AbsoluteFill>
      <AbsoluteFill
        style={{
          filter: `grayscale(${0.85 * k}) contrast(${1 + 0.2 * k})`,
        }}
      >
        {children}
      </AbsoluteFill>

      {/* Shadow tone maps onto dark areas */}
      <ColorEffectLayer
        style={{
          background: shadowColor,
          mixBlendMode: "multiply",
          opacity: 0.85 * effective,
        }}
      />

      {/* Highlight tone maps onto bright areas */}
      <ColorEffectLayer
        style={{
          background: highlightColor,
          mixBlendMode: "screen",
          opacity: 0.45 * effective,
        }}
      />

      {/* Soft inner glow to lift center */}
      <ColorEffectLayer
        style={{
          background: `radial-gradient(ellipse at 50% 45%, ${highlightColor}33 0%, transparent 55%)`,
          opacity: interpolate(effective, [0, 1], [0, 0.7]),
        }}
      />
    </AbsoluteFill>
  );
};
