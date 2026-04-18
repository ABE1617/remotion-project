import React from "react";
import { AbsoluteFill } from "remotion";
import { useColorPhase, ColorEffectLayer } from "./shared";
import type { ColorTimingMode } from "./shared";

export interface FlashBurstProps {
  children: React.ReactNode;
  // Flash color — default pure white for photo-flash feel.
  color?: string;
  // Tint toward warm for a softer paparazzi pop.
  warm?: boolean;
  // Pulses with fast attack and smooth decay. REQUIRED (flash is a beat event).
  timing: ColorTimingMode;
  // Peak intensity 0..1. Default 0.9 so footage stays legible at peak.
  intensity?: number;
}

// Photo-flash / lightning-strike punctuation. Instant attack, soft
// exponential decay, with a subtle bloom that spreads from center. Made
// for beat hits — pair with a kick or snare.
export const FlashBurst: React.FC<FlashBurstProps> = ({
  children,
  color = "#ffffff",
  warm = false,
  timing,
  intensity = 0.9,
}) => {
  const { intensity: k } = useColorPhase(timing, {
    baseIntensity: intensity,
    // Fast attack, slower release for a photographic flash curve
    defaultAttackFrames: 2,
    defaultHoldFrames: 1,
    defaultReleaseFrames: 14,
    defaultFadeInFrames: 2,
  });

  const flashColor = warm ? "#fff3dc" : color;
  const bloomColor = warm ? "rgba(255,220,170,0.9)" : "rgba(255,255,255,0.9)";

  return (
    <AbsoluteFill>
      <AbsoluteFill
        style={{
          filter: `brightness(${1 + 0.35 * k}) contrast(${1 + 0.1 * k})`,
        }}
      >
        {children}
      </AbsoluteFill>

      {/* Bloom core — soft radial white */}
      <ColorEffectLayer
        style={{
          background: `radial-gradient(ellipse at 50% 50%, ${bloomColor} 0%, rgba(255,255,255,0) 60%)`,
          mixBlendMode: "screen",
          opacity: 0.9 * k,
        }}
      />

      {/* Full-frame flat flash */}
      <ColorEffectLayer
        style={{
          background: flashColor,
          opacity: 0.65 * k,
        }}
      />

      {/* Brief highlight sheen on edges */}
      <ColorEffectLayer
        style={{
          boxShadow: `inset 0 0 160px rgba(255,255,255,${0.7 * k})`,
        }}
      />
    </AbsoluteFill>
  );
};
