import React, { useMemo } from "react";
import {
  AbsoluteFill,
  Sequence,
  spring,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { SpringConfig } from "remotion";
import type { TikTokToken, TikTokPage } from "../../types/captions";
import type { DynamicAIEmphasisProps } from "./types";
import { FONT_FAMILIES } from "../../utils/fonts";
import { msToFrames } from "../../utils/timing";
import { getCaptionPositionStyle } from "../../utils/captionPosition";

// ── Spring configs ──────────────────────────────────────────────────────────

/** Bouncy pop with overshoot for emphasis words */
const EMPHASIS_SPRING: SpringConfig = {
  mass: 0.4,
  damping: 8,
  stiffness: 180,
  overshootClamping: false,
};

/** Quick gentle slide for normal words */
const NORMAL_SPRING: SpringConfig = {
  mass: 0.5,
  damping: 18,
  stiffness: 200,
  overshootClamping: false,
};

// ── Helpers ─────────────────────────────────────────────────────────────────

/** Strip punctuation and lowercase for matching */
function normalizeWord(text: string): string {
  return text.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
}

/** Soft drop-shadow only (no stroke, no glow) */
const TEXT_SHADOW = "0 2px 8px rgba(0,0,0,0.7), 0 4px 16px rgba(0,0,0,0.4)";

// ── DynamicAIEmphasisWord ───────────────────────────────────────────────────

const DynamicAIEmphasisWord: React.FC<{
  token: TikTokToken;
  pageStartMs: number;
  wordFontSize: number;
  isEmphasis: boolean;
  wordColor: string;
  fontFamily: string;
  letterSpacing: number;
  allCaps: boolean;
  springConfig: SpringConfig;
}> = ({
  token,
  pageStartMs,
  wordFontSize,
  isEmphasis,
  wordColor,
  fontFamily,
  letterSpacing,
  allCaps,
  springConfig,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Token entry relative to this Sequence (which starts at page.startMs)
  const tokenEntryFrame = msToFrames(token.fromMs - pageStartMs, fps);

  // Spring drives entrance animation: 0 -> overshoot -> 1
  const springProgress = spring({
    fps,
    frame: frame - tokenEntryFrame,
    config: springConfig,
  });

  // Emphasis words: scale pops from 0 with overshoot, translateY from 12
  // Normal words:   no scale (always 1), translateY from 6
  const scale = isEmphasis ? springProgress : 1;

  const translateY = isEmphasis
    ? interpolate(springProgress, [0, 1], [12, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : interpolate(springProgress, [0, 1], [6, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });

  // Opacity: emphasis fades in fast (first 15%), normal fades in with spring
  const opacity = isEmphasis
    ? interpolate(springProgress, [0, 0.15], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : springProgress;

  return (
    <span
      style={{
        display: "inline-block",
        fontFamily,
        fontSize: wordFontSize,
        fontWeight: 900,
        color: wordColor,
        textTransform: allCaps ? "uppercase" : "none",
        letterSpacing: `${letterSpacing}em`,
        textShadow: TEXT_SHADOW,
        transform: `scale(${scale}) translateY(${translateY}px)`,
        transformOrigin: "center bottom",
        opacity,
        whiteSpace: "nowrap",
        lineHeight: 1.1,
        verticalAlign: "baseline",
      }}
    >
      {token.text}
    </span>
  );
};

// ── DynamicAIEmphasisPage ───────────────────────────────────────────────────

const DynamicAIEmphasisPage: React.FC<{
  page: TikTokPage;
  emphasisMap: Map<string, { weight: 1 | 2 | 3; color?: string }>;
  baseFontSize: number;
  mediumScale: number;
  largeScale: number;
  primaryColor: string;
  emphasisColor: string;
  fontFamily: string;
  letterSpacing: number;
  allCaps: boolean;
  emphasisSpring: SpringConfig;
  normalSpring: SpringConfig;
  maxWordsPerLine: number;
  wordGap: number;
  lineGap: number;
}> = ({
  page,
  emphasisMap,
  baseFontSize,
  mediumScale,
  largeScale,
  primaryColor,
  emphasisColor,
  fontFamily,
  letterSpacing,
  allCaps,
  emphasisSpring,
  normalSpring,
  maxWordsPerLine,
  wordGap,
  lineGap,
}) => {
  // Split tokens into lines by maxWordsPerLine
  const lines: TikTokToken[][] = [];
  for (let i = 0; i < page.tokens.length; i += maxWordsPerLine) {
    lines.push(page.tokens.slice(i, i + maxWordsPerLine));
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: lineGap,
      }}
    >
      {lines.map((lineTokens, lineIdx) => (
        <div
          key={lineIdx}
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            alignItems: "baseline",
            gap: `0 ${wordGap}px`,
          }}
        >
          {lineTokens.map((token, tokenIdx) => {
            const normalized = normalizeWord(token.text);
            const match = emphasisMap.get(normalized);
            const isEmphasis = match !== undefined;
            const weight = match?.weight ?? 1;

            // Compute font size based on weight
            let scaleFactor = 1;
            if (weight === 2) scaleFactor = mediumScale;
            if (weight === 3) scaleFactor = largeScale;
            const wordFontSize = Math.round(baseFontSize * scaleFactor);

            // Determine color: per-word override > emphasisColor > primaryColor
            let wordColor: string;
            if (isEmphasis) {
              wordColor = match.color ?? emphasisColor;
            } else {
              wordColor = primaryColor;
            }

            return (
              <DynamicAIEmphasisWord
                key={`${lineIdx}-${tokenIdx}`}
                token={token}
                pageStartMs={page.startMs}
                wordFontSize={wordFontSize}
                isEmphasis={isEmphasis}
                wordColor={wordColor}
                fontFamily={fontFamily}
                letterSpacing={letterSpacing}
                allCaps={allCaps}
                springConfig={isEmphasis ? emphasisSpring : normalSpring}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
};

// ── DynamicAIEmphasis (main export) ─────────────────────────────────────────

export const DynamicAIEmphasis: React.FC<DynamicAIEmphasisProps> = ({
  pages,
  emphasisWords = [],
  emphasisColor = "#FFFFFF",
  fontSize = 48,
  fontFamily = FONT_FAMILIES.montserrat,
  primaryColor = "#FFFFFF",
  position = "center",
  mediumScale = 1.8,
  largeScale = 2.5,
  letterSpacing = 0.02,
  emphasisSpring = EMPHASIS_SPRING,
  normalSpring = NORMAL_SPRING,
  maxWordsPerLine = 4,
  allCaps = true,
  wordGap = 10,
  lineGap = 4,
}) => {
  const { fps } = useVideoConfig();

  // Build lookup map: normalized word -> { weight, color }
  const emphasisMap = useMemo(() => {
    const map = new Map<string, { weight: 1 | 2 | 3; color?: string }>();
    for (const ew of emphasisWords) {
      map.set(normalizeWord(ew.text), {
        weight: ew.weight ?? 2,
        color: ew.color,
      });
    }
    return map;
  }, [emphasisWords]);

  const positionStyle = getCaptionPositionStyle(position);

  return (
    <AbsoluteFill>
      {pages.map((page, pageIndex) => {
        const startFrame = msToFrames(page.startMs, fps);
        const durationFrames = msToFrames(page.durationMs, fps);
        if (durationFrames <= 0) return null;

        return (
          <Sequence
            key={pageIndex}
            from={startFrame}
            durationInFrames={durationFrames}
            premountFor={10}
          >
            <AbsoluteFill
              style={{
                display: "flex",
                alignItems: "center",
                ...positionStyle,
              }}
            >
              <DynamicAIEmphasisPage
                page={page}
                emphasisMap={emphasisMap}
                baseFontSize={fontSize}
                mediumScale={mediumScale}
                largeScale={largeScale}
                primaryColor={primaryColor}
                emphasisColor={emphasisColor}
                fontFamily={fontFamily}
                letterSpacing={letterSpacing}
                allCaps={allCaps}
                emphasisSpring={emphasisSpring}
                normalSpring={normalSpring}
                maxWordsPerLine={maxWordsPerLine}
                wordGap={wordGap}
                lineGap={lineGap}
              />
            </AbsoluteFill>
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
