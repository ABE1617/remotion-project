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
import type { ElasticStretchProps } from "./types";
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

// ── ElasticStretchWord ─────────────────────────────────────────────────────
//
// Entry animation: scaleX starts at 2.8 (very wide), scaleY at 0.35
// (squished). A bouncy spring overshoots so the word briefly compresses
// narrow before snapping to 1×1. The pill background stretches with the
// text because it lives inside the same transform container.
//
// Active word: subtle sine-wave breathing scale + accent-colored pill.
// Past words: dim pill. Upcoming words: invisible until their fromMs.

const ElasticStretchWord: React.FC<{
  token: TikTokToken;
  pageStartFrame: number;
  currentTimeMs: number;
  fontFamily: string;
  fontSize: number;
  fontWeight: number | string;
  primaryColor: string;
  accentColor: string;
  pastPillColor: string;
  letterSpacing: number;
  allCaps: boolean;
  pillPaddingX: number;
  pillPaddingY: number;
  pillBorderRadius: number;
  textShadow: string;
}> = ({
  token,
  pageStartFrame,
  currentTimeMs,
  fontFamily,
  fontSize,
  fontWeight,
  primaryColor,
  accentColor,
  pastPillColor,
  letterSpacing,
  allCaps,
  pillPaddingX,
  pillPaddingY,
  pillBorderRadius,
  textShadow,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const isActive = currentTimeMs >= token.fromMs && currentTimeMs <= token.toMs;
  const isPast = currentTimeMs > token.toMs;

  // Word onset frame within the Sequence (Sequence starts at pageStartFrame)
  const wordOnsetFrame = msToFrames(token.fromMs, fps) - pageStartFrame;

  // ── Elastic entry spring ────────────────────────────────────────────────
  // mass=0.55, damping=7 → high overshoot = rubbery stretch-snap
  const entrySpring = spring({
    fps,
    frame: frame - wordOnsetFrame,
    config: {
      mass: 0.55,
      damping: 7,
      stiffness: 150,
      overshootClamping: false,
    },
  });

  // scaleX: 2.8 → 1.0 with overshoot compressing to ~0.6 before settling
  const scaleX = interpolate(entrySpring, [0, 1], [2.8, 1.0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "extend", // let overshoot drive below 1.0
  });

  // scaleY: 0.35 → 1.0 with overshoot expanding to ~1.1 before settling
  const scaleY = interpolate(entrySpring, [0, 1], [0.35, 1.0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "extend",
  });

  // Opacity: snap in quickly at word onset
  const opacity = interpolate(entrySpring, [0, 0.2], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── Breathing oscillation while active ────────────────────────────────
  // Sine wave phase anchored to word's start so it always begins at 1.0
  const breatheFactor = isActive
    ? 1 + 0.038 * Math.sin(((currentTimeMs - token.fromMs) / 1000) * Math.PI * 2 * 1.6)
    : 1;

  const finalScaleX = scaleX * breatheFactor;
  const finalScaleY = scaleY * breatheFactor;

  // ── Pill + text color ──────────────────────────────────────────────────
  const pillBg = isActive
    ? accentColor
    : isPast
      ? pastPillColor
      : "transparent";

  const textColor = isActive ? "#FFFFFF" : primaryColor;

  const displayText = allCaps ? token.text.toUpperCase() : token.text;

  return (
    <span
      style={{
        display: "inline-block",
        position: "relative",
        opacity,
        transform: `scaleX(${finalScaleX}) scaleY(${finalScaleY})`,
        transformOrigin: "center center",
        willChange: "transform, opacity",
      }}
    >
      {/* Stretchy pill — resizes with text, stretches during entry transform */}
      <span
        style={{
          position: "absolute",
          top: -pillPaddingY,
          right: -pillPaddingX,
          bottom: -pillPaddingY,
          left: -pillPaddingX,
          background: pillBg,
          borderRadius: pillBorderRadius,
          zIndex: 0,
        }}
      />
      {/* Word text */}
      <span
        style={{
          position: "relative",
          zIndex: 1,
          display: "inline-block",
          fontFamily,
          fontSize,
          fontWeight,
          color: textColor,
          textShadow,
          letterSpacing: `${letterSpacing}em`,
          lineHeight: 1.2,
          whiteSpace: "nowrap",
        }}
      >
        {displayText}
      </span>
    </span>
  );
};

// ── ElasticStretchPage ─────────────────────────────────────────────────────

const ElasticStretchPage: React.FC<{
  page: TikTokPage;
  pageStartFrame: number;
  fontFamily: string;
  fontSize: number;
  fontWeight: number | string;
  primaryColor: string;
  accentColor: string;
  pastPillColor: string;
  letterSpacing: number;
  allCaps: boolean;
  maxWordsPerLine: number;
  lineGap: number;
  wordGap: number;
  pillPaddingX: number;
  pillPaddingY: number;
  pillBorderRadius: number;
  textShadow: string;
}> = ({
  page,
  pageStartFrame,
  fontFamily,
  fontSize,
  fontWeight,
  primaryColor,
  accentColor,
  pastPillColor,
  letterSpacing,
  allCaps,
  maxWordsPerLine,
  lineGap,
  wordGap,
  pillPaddingX,
  pillPaddingY,
  pillBorderRadius,
  textShadow,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Time in ms for karaoke state (relative to global timeline via Sequence offset)
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
      {lines.map((lineTokens, lineIndex) => (
        <div
          key={lineIndex}
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            flexWrap: "nowrap",
            gap: wordGap,
          }}
        >
          {lineTokens.map((token, tokenIndex) => (
            <ElasticStretchWord
              key={`${lineIndex}-${tokenIndex}`}
              token={token}
              pageStartFrame={pageStartFrame}
              currentTimeMs={currentTimeMs}
              fontFamily={fontFamily}
              fontSize={fontSize}
              fontWeight={fontWeight}
              primaryColor={primaryColor}
              accentColor={accentColor}
              pastPillColor={pastPillColor}
              letterSpacing={letterSpacing}
              allCaps={allCaps}
              pillPaddingX={pillPaddingX}
              pillPaddingY={pillPaddingY}
              pillBorderRadius={pillBorderRadius}
              textShadow={textShadow}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

// ── ElasticStretch (main export) ───────────────────────────────────────────

export const ElasticStretch: React.FC<ElasticStretchProps> = ({
  pages,
  fontFamily = FONT_FAMILIES.montserrat,
  fontSize = 72,
  fontWeight = 900,
  primaryColor = "#FFFFFF",
  position = "center",
  accentColor = "#FF6B35",
  pastPillColor = "rgba(255,255,255,0.15)",
  letterSpacing = 0.02,
  allCaps = true,
  maxWordsPerLine = 3,
  lineGap = 16,
  wordGap = 24,
  pillPaddingX = 14,
  pillPaddingY = 6,
  pillBorderRadius = 10,
  textShadow = "0 2px 6px rgba(0,0,0,0.65)",
}) => {
  const { fps } = useVideoConfig();
  const positionStyle = getCaptionPositionStyle(position);

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
                ...positionStyle,
                alignItems: "center",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <ElasticStretchPage
                page={page}
                pageStartFrame={pageStartFrame}
                fontFamily={fontFamily}
                fontSize={fontSize}
                fontWeight={fontWeight}
                primaryColor={primaryColor}
                accentColor={accentColor}
                pastPillColor={pastPillColor}
                letterSpacing={letterSpacing}
                allCaps={allCaps}
                maxWordsPerLine={maxWordsPerLine}
                lineGap={lineGap}
                wordGap={wordGap}
                pillPaddingX={pillPaddingX}
                pillPaddingY={pillPaddingY}
                pillBorderRadius={pillBorderRadius}
                textShadow={textShadow}
              />
            </AbsoluteFill>
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
