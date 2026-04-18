import React from "react";
import { AbsoluteFill } from "remotion";
import { useColorPhase, ColorEffectLayer } from "./shared";
import type { ColorTimingMode } from "./shared";

export interface CineStillProps {
  children: React.ReactNode;
  intensity?: number;
  timing?: ColorTimingMode;
}

// CineStill 800T emulation — tungsten-balanced motion-picture stock shot
// under daylight/mixed light. Signature: teal shadows, slight magenta cast
// in highlights, warm amber mid-warmth (streetlight feel), and a hint of
// halation from the rem-jet-removed base. Every layer is flat + blend-mode
// driven so the look is footage-driven, not position-driven. Used for
// neon-night aesthetics (Drive, Euphoria, Atomic Blonde).
export const CineStill: React.FC<CineStillProps> = ({
  children,
  intensity = 1,
  timing = { mode: "persistent" },
}) => {
  const { intensity: k } = useColorPhase(timing, {
    baseIntensity: intensity,
    defaultAttackFrames: 6,
    defaultHoldFrames: 14,
    defaultReleaseFrames: 12,
    defaultFadeInFrames: 20,
  });

  const contrast = 1 + 0.08 * k;
  const saturation = 1 + 0.05 * k;

  return (
    <AbsoluteFill>
      <AbsoluteFill
        style={{
          filter: `contrast(${contrast}) saturate(${saturation})`,
        }}
      >
        {children}
      </AbsoluteFill>

      {/* Cool teal shadows — multiply with deep blue-teal. Multiply
          affects darks most, mids a little, highlights almost nothing. */}
      <ColorEffectLayer
        style={{
          background: "#10384a",
          mixBlendMode: "multiply",
          opacity: 0.22 * k,
        }}
      />

      {/* Magenta tungsten cast in highlights — soft-light with warm pink.
          Soft-light pushes highlights toward the overlay tone gently. */}
      <ColorEffectLayer
        style={{
          background: "#ff7b95",
          mixBlendMode: "soft-light",
          opacity: 0.35 * k,
        }}
      />

      {/* Warm amber ambient — overlay with streetlight orange. This is
          the "tungsten feel" that gives CineStill its nighttime glow. */}
      <ColorEffectLayer
        style={{
          background: "#ff9c3a",
          mixBlendMode: "soft-light",
          opacity: 0.22 * k,
        }}
      />

      {/* Inset halation glow — warm-red ring around frame, simulates the
          light bleed CineStill gets around bright sources. box-shadow inset
          is a CSS-only trick, no SVG filter quirks. */}
      <ColorEffectLayer
        style={{
          boxShadow: `inset 0 0 220px rgba(255,100,80,${0.28 * k})`,
        }}
      />

      {/* Gentle vignette */}
      <ColorEffectLayer
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, transparent 58%, rgba(10,6,20,0.55) 100%)",
          opacity: 0.55 * k,
        }}
      />
    </AbsoluteFill>
  );
};
