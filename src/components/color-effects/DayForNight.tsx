import React from "react";
import { AbsoluteFill } from "remotion";
import { useColorPhase, ColorEffectLayer } from "./shared";
import type { ColorTimingMode } from "./shared";

export interface DayForNightProps {
  children: React.ReactNode;
  intensity?: number;
  timing?: ColorTimingMode;
}

// Day-for-night: crushes blacks, pushes midtones cool cyan, reduces
// exposure globally, but keeps a warm hint in highlights so skin tones
// don't go corpse-blue. Classic "shot at noon, feels like 3am" trick.
export const DayForNight: React.FC<DayForNightProps> = ({
  children,
  intensity = 1,
  timing = { mode: "persistent" },
}) => {
  const { intensity: k } = useColorPhase(timing, {
    baseIntensity: intensity,
    defaultAttackFrames: 8,
    defaultHoldFrames: 14,
    defaultReleaseFrames: 12,
    defaultFadeInFrames: 22,
  });

  const brightness = 1 - 0.28 * k;
  const contrast = 1 + 0.22 * k;
  const saturation = 1 - 0.2 * k;

  return (
    <AbsoluteFill>
      <AbsoluteFill
        style={{
          filter: `brightness(${brightness}) contrast(${contrast}) saturate(${saturation})`,
        }}
      >
        {children}
      </AbsoluteFill>

      {/* Cyan midtone cast via overlay */}
      <ColorEffectLayer
        style={{
          background: "linear-gradient(180deg, #0b2235 0%, #15364d 100%)",
          mixBlendMode: "overlay",
          opacity: 0.55 * k,
        }}
      />

      {/* Preserve warm skin tones — soft amber dot, screen blend, centered */}
      <ColorEffectLayer
        style={{
          background:
            "radial-gradient(ellipse at 50% 45%, rgba(255,190,130,0.18) 0%, rgba(0,0,0,0) 42%)",
          mixBlendMode: "screen",
          opacity: 0.9 * k,
        }}
      />

      {/* Deep vignette */}
      <ColorEffectLayer
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(0,6,18,0.7) 100%)",
          opacity: 0.9 * k,
        }}
      />
    </AbsoluteFill>
  );
};
