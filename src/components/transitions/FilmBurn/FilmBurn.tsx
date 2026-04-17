import React from "react";
import { AbsoluteFill, Easing, interpolate, OffthreadVideo } from "remotion";
import type { FilmBurnProps } from "../types";

export const FILM_BURN_PEAK_PROGRESS = 0.5;

/**
 * FilmBurn — aggressive bright blowout mimicking old film over-exposed
 * during processing. Outgoing clip ramps brightness/contrast/saturation
 * with an ease-in accelerator, organic burn patches (SVG turbulence) sweep
 * in and hide the hard cut, then a lingering amber tint + heavy grain
 * recede on the incoming clip.
 */
export const FilmBurn: React.FC<FilmBurnProps> = ({
  clipA,
  clipB,
  progress,
  style,
  burnColor = "#FFE2A0",
  tintColor = "#FF8A30",
  intensity = 1.0,
  seed = 1,
}) => {
  const easeIn = Easing.bezier(0.55, 0.05, 0.9, 0.2); // cubic-ish ease-in

  // --- Phase 1: outgoing brightness blowout (0 → 0.5, ease-in) --------------
  const brightnessRamp = interpolate(progress, [0, 0.5], [0, 2.5 * intensity], {
    easing: easeIn,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const contrastRamp = interpolate(progress, [0, 0.5], [0, 1.5 * intensity], {
    easing: easeIn,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const satRamp = interpolate(progress, [0, 0.5], [0, 0.8 * intensity], {
    easing: easeIn,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // --- Phase 4: clipB lingering brightness recovery -------------------------
  const clipBProgress = interpolate(progress, [0.5, 0.7], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const clipBBrightness = 1 + 0.6 * (1 - clipBProgress) * intensity;

  // Burn overlay opacity — builds 0.3→0.5, fades 0.5→0.7.
  const burnOpacity = interpolate(
    progress,
    [0.3, 0.5, 0.6, 0.7],
    [0, 0.95, 0.85, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // Lingering amber tint on clipB — strong right after cut, fades by 0.85.
  const tintOpacity = interpolate(progress, [0.5, 0.85], [0.55, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Heavy grain peaks across the burn window (0.35 – 0.6).
  const grainOpacity = interpolate(
    progress,
    [0.35, 0.5, 0.6],
    [0, 0.25, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const showClipB = progress >= FILM_BURN_PEAK_PROGRESS;
  const activeClip = showClipB ? clipB : clipA;

  const activeFilter = showClipB
    ? `brightness(${clipBBrightness})`
    : `brightness(${1 + brightnessRamp}) contrast(${1 + contrastRamp}) saturate(${1 + satRamp})`;

  // Unique SVG filter / mask ids so multiple FilmBurn instances don't collide.
  const burnFilterId = `filmburn-pattern-${seed}`;
  const grainFilterId = `filmburn-grain-${seed}`;

  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#000", ...style }}>
      {/* 1. Active clip with phase-dependent filter */}
      <AbsoluteFill>
        <OffthreadVideo
          src={activeClip}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            filter: activeFilter,
          }}
        />
      </AbsoluteFill>

      {/* 2. Lingering amber tint on clipB (multiply blend, fades after cut) */}
      {showClipB && tintOpacity > 0.001 && (
        <AbsoluteFill
          style={{
            background: tintColor,
            mixBlendMode: "multiply",
            opacity: tintOpacity,
            pointerEvents: "none",
          }}
        />
      )}

      {/* 3. Organic burn patches — turbulence-masked burnColor rectangle */}
      {burnOpacity > 0.001 && (
        <svg
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "none",
            opacity: burnOpacity,
          }}
        >
          <defs>
            <filter id={burnFilterId} x="0" y="0" width="100%" height="100%">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.012"
                numOctaves="3"
                seed={seed}
              />
              {/* Threshold the noise to bright-white-on-transparent blotches.
                  The final alpha row amplifies and biases so only the brightest
                  noise survives, producing organic patches rather than a wash. */}
              <feColorMatrix
                values="0 0 0 0 1
                        0 0 0 0 1
                        0 0 0 0 1
                        3 3 3 0 -1.5"
              />
            </filter>
          </defs>
          <rect
            width="100%"
            height="100%"
            fill={burnColor}
            filter={`url(#${burnFilterId})`}
          />
        </svg>
      )}

      {/* 4. Heavy grain overlay (high-frequency turbulence, overlay blend) */}
      {grainOpacity > 0.001 && (
        <svg
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "none",
            opacity: grainOpacity,
            mixBlendMode: "overlay",
          }}
        >
          <defs>
            <filter id={grainFilterId} x="0" y="0" width="100%" height="100%">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.9"
                numOctaves="2"
                seed={seed + 7}
              />
              <feColorMatrix
                values="0 0 0 0 0.5
                        0 0 0 0 0.5
                        0 0 0 0 0.5
                        0 0 0 1 0"
              />
            </filter>
          </defs>
          <rect width="100%" height="100%" filter={`url(#${grainFilterId})`} />
        </svg>
      )}
    </AbsoluteFill>
  );
};
