import React, { useMemo } from "react";
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
} from "remotion";
import type { TikTokPage, TikTokToken } from "../../types/captions";
import type { SignalProps } from "./types";
import { msToFrames } from "../../utils/timing";
import { FONT_FAMILIES } from "../../utils/fonts";
import { getCaptionPositionStyle } from "../../utils/captionPosition";
import { buildKeywordSet, isKeyword } from "../shared/keywords";

/* ─── Word ─── */

const SignalWord: React.FC<{
  token: TikTokToken;
  pageStartMs: number;
  isKw: boolean;
  textColor: string;
  keywordColor: string;
  baseFontSize: number;
  bodyFontWeight: number;
  keywordFontWeight: number;
  letterSpacing: string;
  lineHeightMultiplier: number;
}> = ({
  token,
  pageStartMs,
  isKw,
  textColor,
  keywordColor,
  baseFontSize,
  bodyFontWeight,
  keywordFontWeight,
  letterSpacing,
  lineHeightMultiplier,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const currentTimeMs = (frame / fps) * 1000 + pageStartMs;
  const isSpoken = currentTimeMs >= token.fromMs;
  const isActive = currentTimeMs >= token.fromMs && currentTimeMs < token.toMs;

  // Subtle opacity tracking: upcoming 0.5, active 1.0, past 0.85
  const wordOpacity = !isSpoken ? 0.5 : isActive ? 1.0 : 0.85;

  return (
    <span
      style={{
        display: "inline-block",
        fontFamily: FONT_FAMILIES.inter,
        fontSize: baseFontSize,
        fontWeight: isKw ? keywordFontWeight : bodyFontWeight,
        color: isKw ? keywordColor : textColor,
        letterSpacing,
        lineHeight: lineHeightMultiplier,
        whiteSpace: "nowrap",
        opacity: wordOpacity,
      }}
    >
      {token.text}
    </span>
  );
};

/* ─── Page ─── */

const SignalPage: React.FC<{
  page: TikTokPage;
  lines: TikTokToken[][];
  kwSet: Set<string>;
  textColor: string;
  keywordColor: string;
  baseFontSize: number;
  bodyFontWeight: number;
  keywordFontWeight: number;
  letterSpacing: string;
  lineHeightMultiplier: number;
  lineGap: number;
  wordGap: number;
  fadeInDuration: number;
  showSeparator: boolean;
  separatorColor: string;
  positionStyle: React.CSSProperties;
}> = ({
  page,
  lines,
  kwSet,
  textColor,
  keywordColor,
  baseFontSize,
  bodyFontWeight,
  keywordFontWeight,
  letterSpacing,
  lineHeightMultiplier,
  lineGap,
  wordGap,
  fadeInDuration,
  showSeparator,
  separatorColor,
  positionStyle,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pageLocalMs = (frame / fps) * 1000;

  // Phrase-level fade in (whole page, not per word)
  const fadeIn = interpolate(frame, [0, fadeInDuration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Page fade out over last 150ms
  const fadeOut = interpolate(
    pageLocalMs,
    [page.durationMs - 150, page.durationMs],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        alignItems: "center",
        ...positionStyle,
        opacity: Math.min(fadeIn, fadeOut),
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
        {showSeparator && (
          <div
            style={{
              width: 40,
              height: 1,
              backgroundColor: separatorColor,
              marginBottom: 12,
            }}
          />
        )}
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
              <SignalWord
                key={idx}
                token={token}
                pageStartMs={page.startMs}
                isKw={isKeyword(token.text, kwSet)}
                textColor={textColor}
                keywordColor={keywordColor}
                baseFontSize={baseFontSize}
                bodyFontWeight={bodyFontWeight}
                keywordFontWeight={keywordFontWeight}
                letterSpacing={letterSpacing}
                lineHeightMultiplier={lineHeightMultiplier}
              />
            ))}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

/* ─── Main Component ─── */

export const Signal: React.FC<SignalProps> = ({
  pages,
  keywords = [],
  textColor = "#FFFFFF",
  keywordColor = "#6B9DAD",
  baseFontSize = 60,
  bodyFontWeight = 500,
  keywordFontWeight = 600,
  position = "bottom",
  maxWordsPerLine = 4,
  letterSpacing = "0.06em",
  lineHeightMultiplier = 1.0,
  lineGap = 8,
  wordGap = 14,
  fadeInDuration = 8,
  showSeparator = false,
  separatorColor = "rgba(255,255,255,0.2)",
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
            <SignalPage
              page={page}
              lines={lines}
              kwSet={kwSet}
              textColor={textColor}
              keywordColor={keywordColor}
              baseFontSize={baseFontSize}
              bodyFontWeight={bodyFontWeight}
              keywordFontWeight={keywordFontWeight}
              letterSpacing={letterSpacing}
              lineHeightMultiplier={lineHeightMultiplier}
              lineGap={lineGap}
              wordGap={wordGap}
              fadeInDuration={fadeInDuration}
              showSeparator={showSeparator}
              separatorColor={separatorColor}
              positionStyle={positionStyle}
            />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
