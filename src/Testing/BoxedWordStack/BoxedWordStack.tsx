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
import type { BoxedWordStackProps } from "./types";
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

// ── BoxedWordStackWord ─────────────────────────────────────────────────────
//
// Entry: the entire word-box pops in via a scale spring (0 → 1 with overshoot).
// This "stamp" pop is fast and snappy — the box feels physical.
//
// Active state: bright accent-yellow box, black text, subtle scale pulse.
// Past state: dim translucent box, white text, settled at 1.0 scale.
// Upcoming: invisible until the word's fromMs.

const BoxedWordStackWord: React.FC<{
  token: TikTokToken;
  pageStartFrame: number;
  currentTimeMs: number;
  fontFamily: string;
  fontSize: number;
  fontWeight: number | string;
  activeBoxColor: string;
  activeTextColor: string;
  pastBoxColor: string;
  pastTextColor: string;
  boxPaddingX: number;
  boxPaddingY: number;
  boxRadius: number;
  letterSpacing: number;
  allCaps: boolean;
}> = ({
  token,
  pageStartFrame,
  currentTimeMs,
  fontFamily,
  fontSize,
  fontWeight,
  activeBoxColor,
  activeTextColor,
  pastBoxColor,
  pastTextColor,
  boxPaddingX,
  boxPaddingY,
  boxRadius,
  letterSpacing,
  allCaps,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const isActive = currentTimeMs >= token.fromMs && currentTimeMs < token.toMs;
  const isPast = currentTimeMs >= token.toMs;

  const wordOnsetFrame = msToFrames(token.fromMs, fps) - pageStartFrame;

  // ── Pop-in spring ──────────────────────────────────────────────────────
  // High stiffness, moderate damping → punchy pop with a brief overshoot.
  // The box bounces slightly past 1.0 before settling.
  const popSpring = spring({
    fps,
    frame: frame - wordOnsetFrame,
    config: {
      mass: 0.45,
      damping: 11,
      stiffness: 300,
      overshootClamping: false,
    },
  });

  // Scale: 0 → ~1.1 (overshoot) → 1.0
  const scale = interpolate(popSpring, [0, 1], [0, 1.0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "extend", // allows spring overshoot above 1.0
  });

  // Snap opacity the moment the word starts (box "appears" at onset)
  const opacity = interpolate(popSpring, [0, 0.12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── Active pulse ───────────────────────────────────────────────────────
  // Subtle sine-wave scale breathe while the word is being spoken.
  // Uses the word's local time so the pulse always starts at peak scale.
  const breathe = isActive
    ? 1 + 0.022 * Math.sin(
        ((currentTimeMs - token.fromMs) / 1000) * Math.PI * 2 * 2.2,
      )
    : 1;

  const finalScale = scale * breathe;

  // ── Box + text colors ──────────────────────────────────────────────────
  const boxBg = isActive ? activeBoxColor : isPast ? pastBoxColor : "transparent";
  const textColor = isActive ? activeTextColor : pastTextColor;

  // Active box gets a hard drop-shadow so it "lifts" off the screen.
  const shadow = isActive
    ? `0 6px 0 rgba(0,0,0,0.35), 0 2px 16px rgba(0,0,0,0.45)`
    : isPast
      ? `0 2px 0 rgba(0,0,0,0.2)`
      : "none";

  const displayText = allCaps ? token.text.toUpperCase() : token.text;

  return (
    <span
      style={{
        display: "inline-block",
        opacity,
        transform: `scale(${finalScale})`,
        transformOrigin: "center center",
        willChange: "transform, opacity",
      }}
    >
      <span
        style={{
          display: "inline-block",
          background: boxBg,
          borderRadius: boxRadius,
          paddingTop: boxPaddingY,
          paddingBottom: boxPaddingY,
          paddingLeft: boxPaddingX,
          paddingRight: boxPaddingX,
          boxShadow: shadow,
          fontFamily,
          fontSize,
          fontWeight,
          color: textColor,
          letterSpacing: `${letterSpacing}em`,
          lineHeight: 1.2,
          whiteSpace: "nowrap",
          userSelect: "none",
        }}
      >
        {displayText}
      </span>
    </span>
  );
};

// ── BoxedWordStackPage ─────────────────────────────────────────────────────

const BoxedWordStackPage: React.FC<{
  page: TikTokPage;
  pageStartFrame: number;
  fontFamily: string;
  fontSize: number;
  fontWeight: number | string;
  activeBoxColor: string;
  activeTextColor: string;
  pastBoxColor: string;
  pastTextColor: string;
  boxPaddingX: number;
  boxPaddingY: number;
  boxRadius: number;
  letterSpacing: number;
  allCaps: boolean;
  maxWordsPerLine: number;
  lineGap: number;
  wordGap: number;
}> = ({
  page,
  pageStartFrame,
  fontFamily,
  fontSize,
  fontWeight,
  activeBoxColor,
  activeTextColor,
  pastBoxColor,
  pastTextColor,
  boxPaddingX,
  boxPaddingY,
  boxRadius,
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
          {lineTokens.map((token, ti) => (
            <BoxedWordStackWord
              key={`${li}-${ti}`}
              token={token}
              pageStartFrame={pageStartFrame}
              currentTimeMs={currentTimeMs}
              fontFamily={fontFamily}
              fontSize={fontSize}
              fontWeight={fontWeight}
              activeBoxColor={activeBoxColor}
              activeTextColor={activeTextColor}
              pastBoxColor={pastBoxColor}
              pastTextColor={pastTextColor}
              boxPaddingX={boxPaddingX}
              boxPaddingY={boxPaddingY}
              boxRadius={boxRadius}
              letterSpacing={letterSpacing}
              allCaps={allCaps}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

// ── BoxedWordStack (main export) ───────────────────────────────────────────

export const BoxedWordStack: React.FC<BoxedWordStackProps> = ({
  pages,
  fontFamily = FONT_FAMILIES.montserrat,
  fontSize = 72,
  fontWeight = 900,
  position = "center",
  activeBoxColor = "#FFE600",
  activeTextColor = "#000000",
  pastBoxColor = "rgba(255,255,255,0.14)",
  pastTextColor = "#FFFFFF",
  boxPaddingX = 18,
  boxPaddingY = 10,
  boxRadius = 8,
  letterSpacing = 0.04,
  allCaps = true,
  maxWordsPerLine = 3,
  lineGap = 14,
  wordGap = 10,
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
              <BoxedWordStackPage
                page={page}
                pageStartFrame={pageStartFrame}
                fontFamily={fontFamily}
                fontSize={fontSize}
                fontWeight={fontWeight}
                activeBoxColor={activeBoxColor}
                activeTextColor={activeTextColor}
                pastBoxColor={pastBoxColor}
                pastTextColor={pastTextColor}
                boxPaddingX={boxPaddingX}
                boxPaddingY={boxPaddingY}
                boxRadius={boxRadius}
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
