import React from "react";
import { AbsoluteFill } from "remotion";
import { useColorPhase, ColorEffectLayer } from "./shared";
import type { ColorTimingMode } from "./shared";

export interface HalationProps {
  children: React.ReactNode;
  // Halo color — classic is warm red-orange. Default #ff5a28.
  color?: string;
  // Blur radius in px that sets the halo spread. Default 28.
  spread?: number;
  // How aggressively to isolate highlights. 0 = all pixels bloom,
  // 1 = only very bright ones. Default 0.55.
  threshold?: number;
  intensity?: number;
  timing?: ColorTimingMode;
}

// Halation: isolates highlights via a luma-based SVG matrix, blurs them,
// tints the result red-orange, and screens it back over the footage. This
// is the bloom you see around window edges and practical lights in Fincher
// / Euphoria / Deakins frames. Uses an SVG compositing chain so the halo
// is genuinely tied to highlight pixels, not a flat gradient.
export const Halation: React.FC<HalationProps> = ({
  children,
  color = "#ff5a28",
  spread = 28,
  threshold = 0.55,
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

  // Luma extraction matrix: set RGB channels to a scaled luma, then use a
  // transfer curve to threshold out dark pixels. `slope` > 1 + `intercept`
  // negative pushes anything below `threshold` to zero.
  const slope = 1 / Math.max(0.01, 1 - threshold);
  const intercept = -threshold * slope;
  const filterId = "halation-highlights";

  return (
    <AbsoluteFill>
      <AbsoluteFill>{children}</AbsoluteFill>

      {/* Halation pass: highlight-isolated copy, blurred, tinted, screened */}
      <AbsoluteFill
        style={{
          mixBlendMode: "screen",
          opacity: 0.85 * k,
          pointerEvents: "none",
        }}
      >
        <AbsoluteFill
          style={{
            filter: `url(#${filterId}) blur(${spread}px)`,
          }}
        >
          {children}
        </AbsoluteFill>

        {/* Multiply the isolated-highlight layer with the halo color */}
        <ColorEffectLayer
          style={{
            background: color,
            mixBlendMode: "multiply",
          }}
        />
      </AbsoluteFill>

      {/* SVG filter: luma → scalar then threshold */}
      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden>
        <filter id={filterId}>
          {/* Convert to luma in all RGB channels */}
          <feColorMatrix
            type="matrix"
            values="0.299 0.587 0.114 0 0
                    0.299 0.587 0.114 0 0
                    0.299 0.587 0.114 0 0
                    0     0     0     1 0"
          />
          {/* Threshold: push below-threshold luma to zero */}
          <feComponentTransfer>
            <feFuncR type="linear" slope={slope} intercept={intercept} />
            <feFuncG type="linear" slope={slope} intercept={intercept} />
            <feFuncB type="linear" slope={slope} intercept={intercept} />
          </feComponentTransfer>
        </filter>
      </svg>
    </AbsoluteFill>
  );
};
