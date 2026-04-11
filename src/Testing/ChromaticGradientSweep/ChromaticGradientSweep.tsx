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
import type { ChromaticGradientSweepProps } from "./types";
import { FONT_FAMILIES } from "../../utils/fonts";
import { msToFrames } from "../../utils/timing";
import { getCaptionPositionStyle } from "../../utils/captionPosition";

// ── Defaults ───────────────────────────────────────────────────────────────

const DEFAULT_GRADIENT_PAIRS: [string, string][] = [
  ["#FF006E", "#FFBE0B"], // hot pink → gold
  ["#3A86FF", "#8338EC"], // blue → violet
  ["#FB5607", "#FF006E"], // orange → pink
  ["#06D6A0", "#3A86FF"], // teal → blue
  ["#FF6B35", "#EE00FF"], // coral → magenta
];

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

// ── ChromaticWord ──────────────────────────────────────────────────────────
//
// Core mechanic:
//   • Each word has a vivid two-stop gradient painted on its text via
//     background-clip:text. The gradient colors are assigned per word from
//     a cycling chromatic palette, so every word has a unique hue pairing.
//   • Reveal: a clip-path wipe sweeps in from the left at word onset.
//     The "sweep line" moves right at a spring-driven pace — fast, clean.
//   • Active: the gradient shimmers by oscillating background-position-x
//     on a doubled background-size, giving a living color pulse.
//   • Past: clip fully open, shimmer stops, word dims slightly.

const ChromaticWord: React.FC<{
  token: TikTokToken;
  tokenIndex: number;
  pageStartFrame: number;
  currentTimeMs: number;
  color1: string;
  color2: string;
  pastTextColor: string;
  shimmerHz: number;
  fontFamily: string;
  fontSize: number;
  fontWeight: number | string;
  letterSpacing: number;
  allCaps: boolean;
}> = ({
  token,
  tokenIndex,
  pageStartFrame,
  currentTimeMs,
  color1,
  color2,
  pastTextColor,
  shimmerHz,
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

  // ── Sweep spring (left-to-right clip reveal) ───────────────────────────
  // Slightly overdamped so it sweeps cleanly without bouncing back.
  const sweepSpring = spring({
    fps,
    frame: frame - wordOnsetFrame,
    config: {
      mass: 0.4,
      damping: 20,
      stiffness: 220,
      overshootClamping: true,
    },
  });

  // clipRight: how much of the right side to clip away (100%=fully hidden, 0%=fully visible)
  const clipRight = interpolate(sweepSpring, [0, 1], [100, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── Shimmer (active only) ──────────────────────────────────────────────
  // The gradient is painted at 200% width. By shifting background-position-x
  // we oscillate between seeing the left-half and right-half of the gradient,
  // creating a color-shift shimmer effect.
  const shimmerPhase = isActive
    ? 50 + 50 * Math.sin(((currentTimeMs - token.fromMs) / 1000) * Math.PI * 2 * shimmerHz)
    : 50; // centered / static when not active

  // ── Colors ────────────────────────────────────────────────────────────
  // Past words: flat white (drop-shadow only for readability)
  // Active/upcoming: vivid gradient clipped to text glyphs
  const usePastStyle = isPast;

  const gradientBg = `linear-gradient(to right, ${color1}, ${color2}, ${color1})`;

  // Active scale (breathing lift)
  const activeScale = isActive ? 1.04 : 1;

  // Drop shadow — colored glow when active
  const dropShadow = isActive
    ? `drop-shadow(0 0 12px ${color1}BB) drop-shadow(0 2px 6px rgba(0,0,0,0.6))`
    : `drop-shadow(0 2px 5px rgba(0,0,0,0.65))`;

  const displayText = allCaps ? token.text.toUpperCase() : token.text;

  // Suppress unused variable warning — tokenIndex used for cycling outside
  void tokenIndex;

  return (
    <span
      style={{
        display: "inline-block",
        clipPath: `inset(0 ${clipRight}% 0 0)`,
        transform: `scale(${activeScale})`,
        transformOrigin: "left center",
        filter: dropShadow,
        willChange: "clip-path, transform, filter",
      }}
    >
      {usePastStyle ? (
        // Past: solid color, no gradient (simpler, dimmed)
        <span
          style={{
            display: "inline-block",
            fontFamily,
            fontSize,
            fontWeight,
            color: pastTextColor,
            letterSpacing: `${letterSpacing}em`,
            lineHeight: 1.2,
            whiteSpace: "nowrap",
          }}
        >
          {displayText}
        </span>
      ) : (
        // Active / sweeping in: gradient text
        <span
          style={{
            display: "inline-block",
            fontFamily,
            fontSize,
            fontWeight,
            letterSpacing: `${letterSpacing}em`,
            lineHeight: 1.2,
            whiteSpace: "nowrap",
            background: gradientBg,
            backgroundSize: "200% 100%",
            backgroundPositionX: `${shimmerPhase}%`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          {displayText}
        </span>
      )}
    </span>
  );
};

// ── ChromaticPage ──────────────────────────────────────────────────────────

const ChromaticPage: React.FC<{
  page: TikTokPage;
  pageStartFrame: number;
  gradientPairs: [string, string][];
  pastTextColor: string;
  shimmerHz: number;
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
  pageStartFrame,
  gradientPairs,
  pastTextColor,
  shimmerHz,
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
            const [c1, c2] = gradientPairs[tokenIndex % gradientPairs.length];
            return (
              <ChromaticWord
                key={`${li}-${ti}`}
                token={token}
                tokenIndex={tokenIndex}
                pageStartFrame={pageStartFrame}
                currentTimeMs={currentTimeMs}
                color1={c1}
                color2={c2}
                pastTextColor={pastTextColor}
                shimmerHz={shimmerHz}
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

// ── ChromaticGradientSweep (main export) ──────────────────────────────────

export const ChromaticGradientSweep: React.FC<ChromaticGradientSweepProps> = ({
  pages,
  fontFamily = FONT_FAMILIES.montserrat,
  fontSize = 78,
  fontWeight = 900,
  position = "center",
  gradientPairs = DEFAULT_GRADIENT_PAIRS,
  pastTextColor = "rgba(255,255,255,0.58)",
  shimmerHz = 1.4,
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
              <ChromaticPage
                page={page}
                pageStartFrame={pageStartFrame}
                gradientPairs={gradientPairs}
                pastTextColor={pastTextColor}
                shimmerHz={shimmerHz}
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
