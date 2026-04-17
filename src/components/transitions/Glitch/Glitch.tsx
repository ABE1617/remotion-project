import React from "react";
import { AbsoluteFill, interpolate, OffthreadVideo } from "remotion";
import type { GlitchProps } from "../types";

export const GLITCH_PEAK_PROGRESS = 0.5;

/**
 * mulberry32 — tiny deterministic PRNG. Returns a function that yields
 * numbers in [0, 1). Seeded, so the glitch looks identical on every render.
 */
const mulberry32 = (seed: number) => {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

/**
 * Glitch — brief digital distortion bridge with RGB channel splitting,
 * scan-line slicing and (on "hard") a 1-frame inversion + screen-tear.
 * Everything lives in a 4-6 frame window around the cut; outside that,
 * the active clip renders cleanly.
 */
export const Glitch: React.FC<GlitchProps> = ({
  clipA,
  clipB,
  progress,
  style,
  intensity = "soft",
  rgbOffset = 8,
  scanLineCount = 6,
  seed = 1,
}) => {
  // Triangular distortion envelope — peaks at progress 0.5, zero outside [0.35, 0.65].
  const distortion = interpolate(
    progress,
    [0.35, 0.5, 0.65],
    [0, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const activeClip = progress < GLITCH_PEAK_PROGRESS ? clipA : clipB;

  // Outside the distortion window, render the clip cleanly — no filter cost.
  if (distortion <= 0.001) {
    return (
      <AbsoluteFill style={{ overflow: "hidden", background: "#000", ...style }}>
        <OffthreadVideo
          src={activeClip}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </AbsoluteFill>
    );
  }

  const isHard = intensity === "hard";
  const rgbPx = rgbOffset * distortion;

  // Scan-line bands. Re-seed every 2 frames so the offsets shift subtly.
  // `progress` rolls through ~0.35→0.65 over ~9 frames; 0.033 per frame,
  // so grouping every 2 frames means seed changes every ~0.066 of progress.
  const timeBucket = Math.floor(progress / 0.066);
  const rng = mulberry32(seed * 1000 + timeBucket);
  const maxSliceOffset = isHard ? 24 : 12;
  const bands = Array.from({ length: scanLineCount }, (_, i) => {
    const top = (i / scanLineCount) * 100;
    const bottom = ((scanLineCount - i - 1) / scanLineCount) * 100;
    const offsetPx = (rng() * 2 - 1) * maxSliceOffset * distortion;
    return { top, bottom, offsetPx };
  });

  // Screen-tear (hard only) — one thin 4–8px band with a larger offset.
  const tearTopPct = rng() * 90;
  const tearHeightPx = 4 + rng() * 4;
  const tearOffsetPx = (rng() * 2 - 1) * 32 * distortion;

  // 1-frame inversion (hard only) — trigger window ~0.48–0.52.
  const invert = isHard && progress > 0.48 && progress < 0.52;

  // Unique filter ids so multiple Glitch instances don't collide.
  const rId = `glitch-r-${seed}`;
  const gId = `glitch-g-${seed}`;
  const bId = `glitch-b-${seed}`;

  const videoStyle: React.CSSProperties = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  };

  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#000", ...style }}>
      {/* Shared SVG filter defs for RGB channel isolation */}
      <svg width="0" height="0" style={{ position: "absolute" }}>
        <defs>
          <filter id={rId}>
            <feColorMatrix
              type="matrix"
              values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"
            />
          </filter>
          <filter id={gId}>
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0"
            />
          </filter>
          <filter id={bId}>
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0"
            />
          </filter>
        </defs>
      </svg>

      <AbsoluteFill style={{ filter: invert ? "invert(1)" : undefined }}>
        {/* RGB channel split — three copies composited with screen blend.
            When aligned, they recombine to full color; when offset, RGB fringes show. */}
        <AbsoluteFill
          style={{
            transform: `translateX(${-rgbPx}px)`,
            mixBlendMode: "screen",
          }}
        >
          <OffthreadVideo
            src={activeClip}
            style={{ ...videoStyle, filter: `url(#${rId})` }}
          />
        </AbsoluteFill>
        <AbsoluteFill style={{ mixBlendMode: "screen" }}>
          <OffthreadVideo
            src={activeClip}
            style={{ ...videoStyle, filter: `url(#${gId})` }}
          />
        </AbsoluteFill>
        <AbsoluteFill
          style={{
            transform: `translateX(${rgbPx}px)`,
            mixBlendMode: "screen",
          }}
        >
          <OffthreadVideo
            src={activeClip}
            style={{ ...videoStyle, filter: `url(#${bId})` }}
          />
        </AbsoluteFill>

        {/* Scan-line slicing — vertical stack of horizontally displaced bands,
            drawn as a solid overlay on top of the RGB composite. */}
        {bands.map((band, i) => (
          <AbsoluteFill
            key={i}
            style={{
              clipPath: `inset(${band.top}% 0 ${band.bottom}% 0)`,
              transform: `translateX(${band.offsetPx}px)`,
            }}
          >
            <OffthreadVideo src={activeClip} style={videoStyle} />
          </AbsoluteFill>
        ))}

        {/* Screen-tear (hard only) — a thin, larger-offset slice. */}
        {isHard && (
          <AbsoluteFill
            style={{
              clipPath: `inset(${tearTopPct}% 0 calc(${100 - tearTopPct}% - ${tearHeightPx}px) 0)`,
              transform: `translateX(${tearOffsetPx}px)`,
            }}
          >
            <OffthreadVideo src={activeClip} style={videoStyle} />
          </AbsoluteFill>
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
