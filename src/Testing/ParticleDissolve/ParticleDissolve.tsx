import React, { useMemo } from "react";
import {
  AbsoluteFill,
  Sequence,
  spring,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { TikTokToken, TikTokPage } from "../../types/captions";
import type { ParticleDissolveProps } from "./types";
import { FONT_FAMILIES } from "../../utils/fonts";
import { msToFrames } from "../../utils/timing";
import { getCaptionPositionStyle } from "../../utils/captionPosition";

// ── Helpers ────────────────────────────────────────────────────────────────

function splitIntoLines(
  tokens: TikTokToken[],
  maxPerLine: number,
): TikTokToken[][] {
  const lines: TikTokToken[][] = [];
  for (let i = 0; i < tokens.length; i += maxPerLine) {
    lines.push(tokens.slice(i, i + maxPerLine));
  }
  return lines;
}

// ── ParticleWord ───────────────────────────────────────────────────────────
//
// Each word has its own inline SVG feTurbulence + feDisplacementMap filter.
// The filter seed is unique per word so each word's particle pattern is
// distinct. Two animations run:
//
// ENTRY  (word's fromMs):
//   • displacement: entryDisplacement → 0  (particles converge into word)
//   • blur: entryBlur → 0                  (focus clears as word forms)
//   • opacity: 0 → 1                       (materializes from nothing)
//   Spring: mass=0.8, damping=20 → slow, dramatic particle convergence.
//
// EXIT   (word's toMs → past state):
//   • displacement briefly spikes to exitDisplacement via a sine-hump
//     then returns to 0 (word briefly scatters then settles dim).
//   • opacity: 1 → pastOpacity
//
// ACTIVE:  bright, colored glow, scale-up to 1.05.
// PAST:    settled, dimmed at pastOpacity.

const ParticleWord: React.FC<{
  token: TikTokToken;
  tokenIndex: number;
  pageIndex: number;
  pageStartFrame: number;
  currentTimeMs: number;
  accentColor: string;
  pastOpacity: number;
  entryDisplacement: number;
  entryBlur: number;
  exitDisplacement: number;
  fontFamily: string;
  fontSize: number;
  fontWeight: number | string;
  letterSpacing: number;
  allCaps: boolean;
}> = ({
  token,
  tokenIndex,
  pageIndex,
  pageStartFrame,
  currentTimeMs,
  accentColor,
  pastOpacity,
  entryDisplacement,
  entryBlur,
  exitDisplacement,
  fontFamily,
  fontSize,
  fontWeight,
  letterSpacing,
  allCaps,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const isActive = currentTimeMs >= token.fromMs && currentTimeMs < token.toMs;
  const isPast = currentTimeMs >= token.toMs;

  const wordOnsetFrame = msToFrames(token.fromMs, fps) - pageStartFrame;
  const wordOffsetFrame = msToFrames(token.toMs, fps) - pageStartFrame;

  // ── Entry spring: particle convergence ───────────────────────────────
  // Slow, weighty spring — particles take their time to converge.
  const entrySpring = spring({
    fps,
    frame: frame - wordOnsetFrame,
    config: {
      mass: 0.8,
      damping: 20,
      stiffness: 140,
      overshootClamping: true,
    },
  });

  // ── Exit spring: dissolve-out on becoming past ─────────────────────
  // Fast spring that drives the sine-hump displacement.
  const exitSpring = spring({
    fps,
    frame: frame - wordOffsetFrame,
    config: {
      mass: 0.35,
      damping: 14,
      stiffness: 280,
      overshootClamping: true,
    },
  });

  // ── Displacement ────────────────────────────────────────────────────
  // Entry: entryDisplacement → 0 as spring reaches 1
  // Exit:  sine hump using exitSpring (0→1→0 bell curve), peak = exitDisplacement
  const entryDisp = interpolate(entrySpring, [0, 1], [entryDisplacement, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const exitDisp = Math.sin(Math.min(exitSpring, 1) * Math.PI) * exitDisplacement;

  const displacement = isPast ? exitDisp : entryDisp;

  // ── Blur ────────────────────────────────────────────────────────────
  // Entry blur clears as the word comes into focus.
  // Exit: brief blur spike that mirrors the displacement hump.
  const entryBlurVal = interpolate(entrySpring, [0, 1], [entryBlur, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const exitBlurVal = Math.sin(Math.min(exitSpring, 1) * Math.PI) * (entryBlur * 0.5);

  const blur = isPast ? exitBlurVal : entryBlurVal;

  // ── Opacity ─────────────────────────────────────────────────────────
  // Entry: 0 → 1 quickly as particles arrive
  // Exit: 1 → pastOpacity as word dissolves to settled state
  const entryOpacity = interpolate(entrySpring, [0, 0.3], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const exitOpacity = interpolate(exitSpring, [0, 1], [1, pastOpacity], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const opacity = isPast ? exitOpacity : entryOpacity;

  // ── Active scale ─────────────────────────────────────────────────────
  const activeScale = isActive ? 1.05 : 1.0;

  // ── SVG filter ───────────────────────────────────────────────────────
  // Unique ID prevents collisions when multiple pages are pre-mounted.
  const filterId = `pd-${pageIndex}-${tokenIndex}`;
  const seed = tokenIndex * 7 + pageIndex * 17 + 1;
  const applyFilter = displacement > 0.4;

  // Chain: active glow shadow + displacement + blur
  const filterCSS = applyFilter
    ? `url(#${filterId})${blur > 0.15 ? ` blur(${blur.toFixed(1)}px)` : ""}`
    : undefined;

  const dropShadow = isActive
    ? `drop-shadow(0 0 14px ${accentColor}CC) drop-shadow(0 2px 6px rgba(0,0,0,0.65))`
    : `drop-shadow(0 2px 5px rgba(0,0,0,0.65))`;

  const textColor = isActive ? "#FFFFFF" : "#FFFFFF";

  const displayText = allCaps ? token.text.toUpperCase() : token.text;

  return (
    <span
      style={{
        display: "inline-block",
        position: "relative",
        transform: `scale(${activeScale})`,
        transformOrigin: "center center",
        willChange: "transform",
      }}
    >
      {/* SVG filter definition — always rendered, zero-size */}
      <svg
        style={{
          position: "absolute",
          width: 0,
          height: 0,
          overflow: "hidden",
        }}
      >
        <defs>
          <filter
            id={filterId}
            x="-80%"
            y="-80%"
            width="260%"
            height="260%"
          >
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.6"
              numOctaves="3"
              seed={seed}
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale={displacement}
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      {/* Word text — filtered + shadowed */}
      <span
        style={{
          display: "inline-block",
          opacity,
          filter: filterCSS
            ? `${dropShadow} ${filterCSS}`
            : dropShadow,
          fontFamily,
          fontSize,
          fontWeight,
          color: textColor,
          letterSpacing: `${letterSpacing}em`,
          lineHeight: 1.2,
          whiteSpace: "nowrap",
          willChange: "filter, opacity",
        }}
      >
        {displayText}
      </span>
    </span>
  );
};

// ── ParticlePage ───────────────────────────────────────────────────────────

const ParticlePage: React.FC<{
  page: TikTokPage;
  pageIndex: number;
  pageStartFrame: number;
  accentColor: string;
  pastOpacity: number;
  entryDisplacement: number;
  entryBlur: number;
  exitDisplacement: number;
  fontFamily: string;
  fontSize: number;
  fontWeight: number | string;
  letterSpacing: number;
  allCaps: boolean;
  maxWordsPerLine: number;
  lineGap: number;
  wordGap: number;
}> = ({
  page,
  pageIndex,
  pageStartFrame,
  accentColor,
  pastOpacity,
  entryDisplacement,
  entryBlur,
  exitDisplacement,
  fontFamily,
  fontSize,
  fontWeight,
  letterSpacing,
  allCaps,
  maxWordsPerLine,
  lineGap,
  wordGap,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const currentTimeMs = page.startMs + (frame / fps) * 1000;

  const lines = useMemo(
    () => splitIntoLines(page.tokens, maxWordsPerLine),
    [page.tokens, maxWordsPerLine],
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: lineGap,
      }}
    >
      {lines.map((lineTokens, li) => (
        <div
          key={li}
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            flexWrap: "nowrap",
            gap: wordGap,
          }}
        >
          {lineTokens.map((token, ti) => {
            const tokenIndex = li * maxWordsPerLine + ti;
            return (
              <ParticleWord
                key={`${li}-${ti}`}
                token={token}
                tokenIndex={tokenIndex}
                pageIndex={pageIndex}
                pageStartFrame={pageStartFrame}
                currentTimeMs={currentTimeMs}
                accentColor={accentColor}
                pastOpacity={pastOpacity}
                entryDisplacement={entryDisplacement}
                entryBlur={entryBlur}
                exitDisplacement={exitDisplacement}
                fontFamily={fontFamily}
                fontSize={fontSize}
                fontWeight={fontWeight}
                letterSpacing={letterSpacing}
                allCaps={allCaps}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
};

// ── ParticleDissolve (main export) ────────────────────────────────────────

export const ParticleDissolve: React.FC<ParticleDissolveProps> = ({
  pages,
  fontFamily = FONT_FAMILIES.montserrat,
  fontSize = 76,
  fontWeight = 900,
  position = "center",
  accentColor = "#FF6B35",
  pastOpacity = 0.42,
  entryDisplacement = 58,
  entryBlur = 4,
  exitDisplacement = 16,
  letterSpacing = 0.02,
  allCaps = true,
  maxWordsPerLine = 3,
  lineGap = 14,
  wordGap = 20,
}) => {
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill>
      {pages.map((page, pageIndex) => {
        const pageStartFrame = msToFrames(page.startMs, fps);
        const pageDurationFrames = msToFrames(page.durationMs, fps);

        return (
          <Sequence
            key={pageIndex}
            from={pageStartFrame}
            durationInFrames={Math.max(pageDurationFrames, 1)}
            premountFor={10}
          >
            <AbsoluteFill
              style={{
                ...getCaptionPositionStyle(position),
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <ParticlePage
                page={page}
                pageIndex={pageIndex}
                pageStartFrame={pageStartFrame}
                accentColor={accentColor}
                pastOpacity={pastOpacity}
                entryDisplacement={entryDisplacement}
                entryBlur={entryBlur}
                exitDisplacement={exitDisplacement}
                fontFamily={fontFamily}
                fontSize={fontSize}
                fontWeight={fontWeight}
                letterSpacing={letterSpacing}
                allCaps={allCaps}
                maxWordsPerLine={maxWordsPerLine}
                lineGap={lineGap}
                wordGap={wordGap}
              />
            </AbsoluteFill>
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
