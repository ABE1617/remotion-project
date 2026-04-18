import React from "react";
import { AbsoluteFill, interpolate, OffthreadVideo } from "remotion";
import type { LensBurnProps } from "../types";

export const LENS_BURN_PEAK_PROGRESS = 0.5;

/**
 * LensBurn — film burning in the projector gate.
 *
 * Strategy: forget SVG masks, they're fragile. Render a FULL-SCREEN
 * turbulent noise pattern and remap the noise values straight into fire
 * colours (red → orange → yellow → white-hot) with alpha keyed to
 * noise value so the pattern IS the fire shape — organic tongues,
 * voids of char, bright hotspots. Two stacked noise layers at different
 * frequencies give the fire depth: a slow large-scale flame body and a
 * fast fine-detail crackle on top. The seed animates each progress step
 * so the fire actually moves. Clip A/B crossfade while the fire is at
 * peak so the cut is buried in the flames.
 */
export const LensBurn: React.FC<LensBurnProps> = ({
  clipA,
  clipB,
  progress,
  style,
  burnColor,
  intensity = 1,
}) => {
  // Suppress unused-prop warning — burnColor is on the Props type for API
  // parity with other transitions. Palette here is fixed because shifting
  // it would break the noise → colour remap.
  void burnColor;

  // Fire presence across the transition — bell curve peaking at the cut.
  // Very wide window so the fire is clearly visible for most of the transition.
  const flameOpacity = interpolate(
    progress,
    [0, 0.15, 0.5, 0.85, 1],
    [0, 0.65, 1, 0.65, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // Clip A fades out, Clip B fades in — gradually so the fire hides the cut.
  const aOpacity = interpolate(progress, [0.2, 0.55], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const bOpacity = interpolate(progress, [0.45, 0.8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Big flame body — coarse noise, slow evolution
  const seedBig = Math.floor(progress * 35);
  // Fine crackle — faster evolution, different seed offset so the two
  // layers aren't synchronised
  const seedFine = Math.floor(progress * 60) + 17;

  // Darken the scene as it burns — subtle reddish mask under everything
  const underTint = interpolate(
    progress,
    [0, 0.5, 1],
    [0, 0.55, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#000", ...style }}>
      {/* Clip A */}
      <AbsoluteFill style={{ opacity: aOpacity }}>
        <OffthreadVideo
          src={clipA}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </AbsoluteFill>

      {/* Clip B */}
      <AbsoluteFill style={{ opacity: bOpacity }}>
        <OffthreadVideo
          src={clipB}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </AbsoluteFill>

      {/* Reddish under-tint during the burn */}
      <AbsoluteFill
        style={{
          background: "#3a0a00",
          mixBlendMode: "multiply",
          opacity: underTint * intensity,
          pointerEvents: "none",
        }}
      />

      {/* Big flame body — large-scale turbulent noise recoloured to fire.
          The feComponentTransfer table maps noise values (0..1) to fire
          colours: low = dark red char, mid = bright orange, high = hot
          yellow-white. Alpha is also keyed to the noise so dark areas
          are transparent → you see the crossfade through the voids. */}
      <AbsoluteFill
        style={{
          opacity: flameOpacity * intensity,
          mixBlendMode: "screen",
          pointerEvents: "none",
        }}
      >
        <svg
          width="100%"
          height="100%"
          xmlns="http://www.w3.org/2000/svg"
          style={{ display: "block" }}
        >
          <filter id="lb-fire-big" x="0" y="0" width="100%" height="100%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.005 0.012"
              numOctaves="4"
              stitchTiles="stitch"
              seed={seedBig}
            />
            <feComponentTransfer>
              {/* noise → fire palette. Low noise = black/dark red.
                  Mid = bright orange/red. High = white-hot. */}
              <feFuncR
                type="table"
                tableValues="0 0.4 0.7 0.95 1 1 1 1 1"
              />
              <feFuncG
                type="table"
                tableValues="0 0 0.1 0.25 0.5 0.75 0.9 1 1"
              />
              <feFuncB
                type="table"
                tableValues="0 0 0 0 0 0.05 0.2 0.5 0.85"
              />
              {/* Alpha: dark noise goes transparent so the clip
                  underneath shows through the voids. */}
              <feFuncA
                type="table"
                tableValues="0 0.15 0.5 0.85 1 1 1 1 1"
              />
            </feComponentTransfer>
          </filter>
          <rect width="100%" height="100%" filter="url(#lb-fire-big)" />
        </svg>
      </AbsoluteFill>

      {/* Fine crackle layer — smaller-scale noise for bright hot spots
          sparking on top of the big flame body. Different seed velocity
          gives a complex multi-rate motion. */}
      <AbsoluteFill
        style={{
          opacity: flameOpacity * 0.75 * intensity,
          mixBlendMode: "screen",
          pointerEvents: "none",
        }}
      >
        <svg
          width="100%"
          height="100%"
          xmlns="http://www.w3.org/2000/svg"
          style={{ display: "block" }}
        >
          <filter id="lb-fire-fine" x="0" y="0" width="100%" height="100%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.02 0.04"
              numOctaves="2"
              stitchTiles="stitch"
              seed={seedFine}
            />
            <feComponentTransfer>
              {/* Brighter bias — fine layer is mostly sparks */}
              <feFuncR
                type="table"
                tableValues="0 0 0.2 0.6 1 1 1"
              />
              <feFuncG
                type="table"
                tableValues="0 0 0 0.15 0.5 0.85 1"
              />
              <feFuncB
                type="table"
                tableValues="0 0 0 0 0 0.3 0.8"
              />
              <feFuncA
                type="table"
                tableValues="0 0 0.2 0.5 0.8 0.9 1"
              />
            </feComponentTransfer>
          </filter>
          <rect width="100%" height="100%" filter="url(#lb-fire-fine)" />
        </svg>
      </AbsoluteFill>

      {/* Char vignette — scorched dark edges creeping in from the frame
          corners as the burn intensifies. */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse at 50% 50%,
            transparent 35%,
            rgba(30,4,0,0.6) 80%,
            rgba(10,0,0,0.9) 100%)`,
          opacity: interpolate(progress, [0, 0.4, 0.6, 1], [0, 0.8, 0.8, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }) * intensity,
          mixBlendMode: "multiply",
          pointerEvents: "none",
        }}
      />

      {/* Final narrow white-orange flash right at the cut to really sell
          the exposure-blowout moment. */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(circle at 50% 50%, #fff2c0 0%, #ff7a20 40%, transparent 80%)",
          opacity:
            interpolate(progress, [0.42, 0.5, 0.58], [0, 0.9, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }) * intensity,
          mixBlendMode: "screen",
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};
