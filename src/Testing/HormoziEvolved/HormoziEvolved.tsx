import React, { useMemo } from "react";
import {
  AbsoluteFill,
  Sequence,
  spring,
  interpolate,
  interpolateColors,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { SpringConfig } from "remotion";
import type { TikTokToken, TikTokPage } from "../../types/captions";
import type { HormoziEvolvedProps } from "./types";
import { FONT_FAMILIES } from "../../utils/fonts";
import { msToFrames } from "../../utils/timing";
import { getCaptionPositionStyle } from "../../utils/captionPosition";
import { clamp } from "../../utils/math";

// ── Default spring config ──────────────────────────────────────────────────

const EVOLVED_ACTIVE_SPRING: SpringConfig = {
  mass: 0.4,
  damping: 12,
  stiffness: 220,
  overshootClamping: false,
};

// ── Helpers ────────────────────────────────────────────────────────────────

/** Strip punctuation and lowercase for matching */
function normalizeWord(text: string): string {
  return text.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
}

// ── HormoziEvolvedWord ─────────────────────────────────────────────────────

const HormoziEvolvedWord: React.FC<{
  token: TikTokToken;
  pageStartMs: number;
  pageDurationFrames: number;
  highlightColor: string | undefined;
  inactiveColor: string;
  activeScale: number;
  fontFamily: string;
  fontSize: number;
  fontWeight: number | string;
  letterSpacing: number;
  allCaps: boolean;
  textShadow: string;
  springConfig: SpringConfig;
  dimPastWords: boolean;
}> = ({
  token,
  pageStartMs,
  pageDurationFrames,
  highlightColor,
  inactiveColor,
  activeScale,
  fontFamily,
  fontSize,
  fontWeight,
  letterSpacing,
  allCaps,
  textShadow,
  springConfig,
  dimPastWords,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── Timing ─────────────────────────────────────────────────────────────
  const activationFrame = msToFrames(token.fromMs - pageStartMs, fps);
  const deactivationFrame = msToFrames(token.toMs - pageStartMs, fps);

  // ── Springs ────────────────────────────────────────────────────────────
  // Activation spring: fires when word starts being spoken (0 -> 1 with overshoot)
  const activationSpring = spring({
    fps,
    frame: frame - activationFrame,
    config: springConfig,
  });

  // Deactivation spring: fires when word stops being spoken (0 -> 1 with overshoot)
  const deactivationSpring = spring({
    fps,
    frame: frame - deactivationFrame,
    config: springConfig,
  });

  // ── Scale ──────────────────────────────────────────────────────────────
  // Raw spring value (with overshoot for bounce feel).
  // Math.max(0, ...) prevents the value going negative, which would shrink below 1.0.
  const scaleBoost =
    (activeScale - 1.0) *
    Math.max(0, activationSpring - deactivationSpring);
  const scale = 1.0 + scaleBoost;

  // ── Color ──────────────────────────────────────────────────────────────
  // Use CLAMPED spring value for color (overshoot in color looks wrong).
  // Once activated (activationSpring=1), color stays at highlightColor permanently (karaoke trail).
  let color: string;
  if (highlightColor) {
    const clampedActivation = clamp(activationSpring, 0, 1);
    color = interpolateColors(
      clampedActivation,
      [0, 1],
      [inactiveColor, highlightColor],
    );
  } else {
    color = inactiveColor;
  }

  // ── Dim past non-highlight words ───────────────────────────────────────
  let wordOpacity = 1;
  if (dimPastWords && !highlightColor && frame > deactivationFrame) {
    wordOpacity = 0.6;
  }

  // ── Page entrance/exit opacity ─────────────────────────────────────────
  // Fast fade-in over first ~4 frames
  const pageEntryOpacity = interpolate(frame, [0, 4], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Fast fade-out over last ~4 frames of page
  const pageExitOpacity = interpolate(
    frame,
    [pageDurationFrames - 4, pageDurationFrames],
    [1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );

  const finalOpacity = pageEntryOpacity * pageExitOpacity * wordOpacity;

  return (
    <span
      style={{
        display: "inline-block",
        fontFamily,
        fontSize,
        fontWeight,
        color,
        textTransform: allCaps ? "uppercase" : "none",
        letterSpacing: `${letterSpacing}em`,
        textShadow,
        transform: `scale(${scale})`,
        transformOrigin: "center center",
        opacity: finalOpacity,
        whiteSpace: "nowrap",
        lineHeight: 1.2,
        verticalAlign: "baseline",
      }}
    >
      {token.text}
    </span>
  );
};

// ── HormoziEvolvedPage ─────────────────────────────────────────────────────

const HormoziEvolvedPage: React.FC<{
  page: TikTokPage;
  pageDurationFrames: number;
  highlightMap: Map<string, string>;
  inactiveColor: string;
  activeScale: number;
  fontFamily: string;
  fontSize: number;
  fontWeight: number | string;
  letterSpacing: number;
  allCaps: boolean;
  textShadow: string;
  springConfig: SpringConfig;
  maxWordsPerLine: number;
  dimPastWords: boolean;
}> = ({
  page,
  pageDurationFrames,
  highlightMap,
  inactiveColor,
  activeScale,
  fontFamily,
  fontSize,
  fontWeight,
  letterSpacing,
  allCaps,
  textShadow,
  springConfig,
  maxWordsPerLine,
  dimPastWords,
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
        gap: 8,
        width: "100%",
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
            gap: 0,
          }}
        >
          {lineTokens.map((token, tokenIdx) => {
            const normalized = normalizeWord(token.text);
            const matchedColor = highlightMap.get(normalized);

            return (
              <div
                key={`${lineIdx}-${tokenIdx}`}
                style={{
                  padding: "0 10px",
                }}
              >
                <HormoziEvolvedWord
                  token={token}
                  pageStartMs={page.startMs}
                  pageDurationFrames={pageDurationFrames}
                  highlightColor={matchedColor}
                  inactiveColor={inactiveColor}
                  activeScale={activeScale}
                  fontFamily={fontFamily}
                  fontSize={fontSize}
                  fontWeight={fontWeight}
                  letterSpacing={letterSpacing}
                  allCaps={allCaps}
                  textShadow={textShadow}
                  springConfig={springConfig}
                  dimPastWords={dimPastWords}
                />
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

// ── HormoziEvolved (main export) ───────────────────────────────────────────

export const HormoziEvolved: React.FC<HormoziEvolvedProps> = ({
  pages,
  highlightWords = [],
  activeScale = 1.15,
  maxWordsPerLine = 4,
  allCaps = true,
  letterSpacing = 0.05,
  activeSpring = EVOLVED_ACTIVE_SPRING,
  textShadow = "0 14px 70px rgba(0,0,0,0.7)",
  inactiveColor = "#FFFFFF",
  dimPastWords = false,
  fontFamily = FONT_FAMILIES.montserrat,
  fontSize = 72,
  fontWeight = 900,
  position = "center",
}) => {
  const { fps } = useVideoConfig();

  // Build lookup map: normalized word -> highlight color
  const highlightMap = useMemo(() => {
    const map = new Map<string, string>();
    for (const hw of highlightWords) {
      map.set(normalizeWord(hw.text), hw.color);
    }
    return map;
  }, [highlightWords]);

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
              <HormoziEvolvedPage
                page={page}
                pageDurationFrames={durationFrames}
                highlightMap={highlightMap}
                inactiveColor={inactiveColor}
                activeScale={activeScale}
                fontFamily={fontFamily}
                fontSize={fontSize}
                fontWeight={fontWeight}
                letterSpacing={letterSpacing}
                allCaps={allCaps}
                textShadow={textShadow}
                springConfig={activeSpring}
                maxWordsPerLine={maxWordsPerLine}
                dimPastWords={dimPastWords}
              />
            </AbsoluteFill>
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
