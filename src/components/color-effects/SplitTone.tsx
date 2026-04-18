import React from "react";
import { AbsoluteFill } from "remotion";
import { useColorPhase, ColorEffectLayer } from "./shared";
import type { ColorTimingMode } from "./shared";

export interface SplitToneProps {
  children: React.ReactNode;
  // Color pushed into shadows. Default warm orange (cross-process feel).
  shadowColor?: string;
  // Color pushed into highlights. Default cool teal.
  highlightColor?: string;
  // How strongly shadows absorb the shadow color 0..1. Default 0.5.
  shadowStrength?: number;
  // How strongly highlights absorb the highlight color 0..1. Default 0.4.
  highlightStrength?: number;
  // Reduce base saturation so the tints read. Default 0.3.
  desat?: number;
  intensity?: number;
  timing?: ColorTimingMode;
}

// Colorist split-tone: two tint params — one for shadows, one for highlights
// — applied via SVG luma masks. Unlike gradient-map duotone, split-tone
// preserves hue fidelity in mids so skin still reads correctly. The colorist
// staple (Baselight, DaVinci, Lightroom all ship a version of this).
export const SplitTone: React.FC<SplitToneProps> = ({
  children,
  shadowColor = "#d97a3a",
  highlightColor = "#6fc2c9",
  shadowStrength = 0.5,
  highlightStrength = 0.4,
  desat = 0.3,
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

  const shadowId = "split-tone-shadows";
  const highlightId = "split-tone-highlights";

  return (
    <AbsoluteFill>
      <AbsoluteFill
        style={{
          filter: `saturate(${1 - desat * k})`,
        }}
      >
        {children}
      </AbsoluteFill>

      {/* Shadow tint — multiply over inverted-luma mask */}
      <AbsoluteFill
        style={{
          mixBlendMode: "multiply",
          opacity: shadowStrength * k,
          pointerEvents: "none",
        }}
      >
        <AbsoluteFill style={{ filter: `url(#${shadowId})` }}>
          {children}
        </AbsoluteFill>
        <ColorEffectLayer
          style={{
            background: shadowColor,
            mixBlendMode: "screen",
          }}
        />
      </AbsoluteFill>

      {/* Highlight tint — screen over luma mask */}
      <AbsoluteFill
        style={{
          mixBlendMode: "screen",
          opacity: highlightStrength * k,
          pointerEvents: "none",
        }}
      >
        <AbsoluteFill style={{ filter: `url(#${highlightId})` }}>
          {children}
        </AbsoluteFill>
        <ColorEffectLayer
          style={{
            background: highlightColor,
            mixBlendMode: "multiply",
          }}
        />
      </AbsoluteFill>

      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden>
        {/* Shadow mask: luma inverted — dark pixels become bright */}
        <filter id={shadowId}>
          <feColorMatrix
            type="matrix"
            values="-0.299 -0.587 -0.114 0 1
                    -0.299 -0.587 -0.114 0 1
                    -0.299 -0.587 -0.114 0 1
                     0      0      0     1 0"
          />
        </filter>
        {/* Highlight mask: luma forward */}
        <filter id={highlightId}>
          <feColorMatrix
            type="matrix"
            values="0.299 0.587 0.114 0 0
                    0.299 0.587 0.114 0 0
                    0.299 0.587 0.114 0 0
                    0     0     0     1 0"
          />
        </filter>
      </svg>
    </AbsoluteFill>
  );
};
