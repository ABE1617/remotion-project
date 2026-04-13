import React, { useMemo } from "react";
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
} from "remotion";
import type { TikTokPage, TikTokToken } from "../../types/captions";
import type { HushProps } from "./types";
import { msToFrames } from "../../utils/timing";
import { FONT_FAMILIES } from "../../utils/fonts";
import { getCaptionPositionStyle } from "../../utils/captionPosition";
import { buildKeywordSet, isKeyword } from "../shared/keywords";

/* ─── Word ─── */

const HushWord: React.FC<{
  token: TikTokToken;
  pageStartMs: number;
  isKw: boolean;
  textColor: string;
  keywordColor: string;
  bodyFontSize: number;
  keywordSizeMultiplier: number;
  letterSpacing: string;
  keywordLetterSpacing: string;
  textShadow: string;
  fadeDurationMs: number;
}> = ({
  token,
  pageStartMs,
  isKw,
  textColor,
  keywordColor,
  bodyFontSize,
  keywordSizeMultiplier,
  letterSpacing,
  keywordLetterSpacing,
  textShadow,
  fadeDurationMs,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pageLocalMs = (frame / fps) * 1000;
  const tokenLocalMs = token.fromMs - pageStartMs;

  // Pure linear opacity fade — no spring, no scale, no translate
  const wordOpacity = interpolate(
    pageLocalMs,
    [tokenLocalMs, tokenLocalMs + fadeDurationMs],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const fontSize = isKw
    ? Math.round(bodyFontSize * keywordSizeMultiplier)
    : bodyFontSize;

  return (
    <span
      style={{
        display: "inline-block",
        fontFamily: isKw
          ? FONT_FAMILIES.cormorantGaramond
          : FONT_FAMILIES.inter,
        fontSize,
        fontWeight: isKw ? 300 : 400,
        fontStyle: isKw ? "italic" : "normal",
        color: isKw ? keywordColor : textColor,
        letterSpacing: isKw ? keywordLetterSpacing : letterSpacing,
        lineHeight: 1.15,
        textShadow,
        whiteSpace: "nowrap",
        opacity: wordOpacity,
      }}
    >
      {token.text}
    </span>
  );
};

/* ─── Main Component ─── */

export const Hush: React.FC<HushProps> = ({
  pages,
  keywords = [],
  textColor = "#F0EEE9",
  keywordColor = "#A47864",
  bodyFontSize = 58,
  keywordSizeMultiplier = 1.15,
  position = "bottom",
  maxWordsPerLine = 5,
  lineGap = 10,
  wordGap = 14,
  fadeDurationMs = 300,
  letterSpacing = "0.03em",
  keywordLetterSpacing = "0.01em",
  textShadow = "0 1px 6px rgba(0,0,0,0.4)",
}) => {
  const { fps } = useVideoConfig();
  const kwSet = useMemo(() => buildKeywordSet(keywords), [keywords]);
  const positionStyle = getCaptionPositionStyle(position);

  return (
    <AbsoluteFill>
      {pages.map((page, pageIndex) => {
        const startFrame = msToFrames(page.startMs, fps);
        const durationFrames = msToFrames(page.durationMs, fps);
        if (durationFrames <= 0) return null;

        // Split tokens into lines
        const lines: TikTokToken[][] = [];
        for (let i = 0; i < page.tokens.length; i += maxWordsPerLine) {
          lines.push(page.tokens.slice(i, i + maxWordsPerLine));
        }

        return (
          <Sequence
            key={pageIndex}
            from={startFrame}
            durationInFrames={durationFrames}
            premountFor={10}
          >
            <HushPage
              page={page}
              lines={lines}
              kwSet={kwSet}
              textColor={textColor}
              keywordColor={keywordColor}
              bodyFontSize={bodyFontSize}
              keywordSizeMultiplier={keywordSizeMultiplier}
              letterSpacing={letterSpacing}
              keywordLetterSpacing={keywordLetterSpacing}
              textShadow={textShadow}
              fadeDurationMs={fadeDurationMs}
              lineGap={lineGap}
              wordGap={wordGap}
              positionStyle={positionStyle}
            />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

/* ─── Page (handles fade-out) ─── */

const HushPage: React.FC<{
  page: TikTokPage;
  lines: TikTokToken[][];
  kwSet: Set<string>;
  textColor: string;
  keywordColor: string;
  bodyFontSize: number;
  keywordSizeMultiplier: number;
  letterSpacing: string;
  keywordLetterSpacing: string;
  textShadow: string;
  fadeDurationMs: number;
  lineGap: number;
  wordGap: number;
  positionStyle: React.CSSProperties;
}> = ({
  page,
  lines,
  kwSet,
  textColor,
  keywordColor,
  bodyFontSize,
  keywordSizeMultiplier,
  letterSpacing,
  keywordLetterSpacing,
  textShadow,
  fadeDurationMs,
  lineGap,
  wordGap,
  positionStyle,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pageLocalMs = (frame / fps) * 1000;

  // Page fade-out over last 200ms
  const fadeOut = interpolate(
    pageLocalMs,
    [page.durationMs - 200, page.durationMs],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        alignItems: "center",
        ...positionStyle,
        opacity: fadeOut,
      }}
    >
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
              alignItems: "baseline",
              justifyContent: "center",
              gap: wordGap,
            }}
          >
            {lineTokens.map((token, idx) => (
              <HushWord
                key={idx}
                token={token}
                pageStartMs={page.startMs}
                isKw={isKeyword(token.text, kwSet)}
                textColor={textColor}
                keywordColor={keywordColor}
                bodyFontSize={bodyFontSize}
                keywordSizeMultiplier={keywordSizeMultiplier}
                letterSpacing={letterSpacing}
                keywordLetterSpacing={keywordLetterSpacing}
                textShadow={textShadow}
                fadeDurationMs={fadeDurationMs}
              />
            ))}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
