import React, { useMemo } from "react";
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
} from "remotion";
import type { TikTokPage, TikTokToken } from "../../types/captions";
import type { ContrastProps } from "./types";
import { msToFrames } from "../../utils/timing";
import { FONT_FAMILIES } from "../../utils/fonts";
import { getCaptionPositionStyle } from "../../utils/captionPosition";
import { buildKeywordSet, isKeyword } from "../shared/keywords";

/* ─── Word (dual-layer weight crossfade) ─── */

const ContrastWord: React.FC<{
  token: TikTokToken;
  pageStartMs: number;
  isKw: boolean;
  lightWeight: number;
  heavyWeight: number;
  lightColor: string;
  heavyColor: string;
  keywordFilledColor: string;
  baseFontSize: number;
  letterSpacing: string;
  fillDuration: number;
  textShadow: string;
}> = ({
  token,
  pageStartMs,
  isKw,
  lightWeight,
  heavyWeight,
  lightColor,
  heavyColor,
  keywordFilledColor,
  baseFontSize,
  letterSpacing,
  fillDuration,
  textShadow,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const activateFrame = msToFrames(token.fromMs - pageStartMs, fps);
  const elapsed = Math.max(0, frame - activateFrame);

  // Weight fill: heavy layer fades in, light layer fades to ghostly
  const fillProgress = interpolate(elapsed, [0, fillDuration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const heavyOpacity = fillProgress;
  const lightOpacity = interpolate(fillProgress, [0, 1], [1, 0.15], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const filledColor = isKw ? keywordFilledColor : heavyColor;

  const sharedStyle: React.CSSProperties = {
    fontFamily: FONT_FAMILIES.playfairDisplay,
    fontSize: baseFontSize,
    letterSpacing,
    lineHeight: 1.0,
    whiteSpace: "nowrap",
  };

  return (
    <span style={{ display: "inline-block", position: "relative" }}>
      {/* Light layer (takes up space in flow) */}
      <span
        style={{
          ...sharedStyle,
          fontWeight: lightWeight,
          fontStyle: "italic",
          color: lightColor,
          opacity: lightOpacity,
        }}
      >
        {token.text}
      </span>

      {/* Heavy layer (absolute overlay) */}
      <span
        style={{
          ...sharedStyle,
          fontWeight: heavyWeight,
          fontStyle: "normal",
          color: filledColor,
          textShadow,
          position: "absolute",
          top: 0,
          left: 0,
          opacity: heavyOpacity,
        }}
      >
        {token.text}
      </span>
    </span>
  );
};

/* ─── Page ─── */

const ContrastPage: React.FC<{
  page: TikTokPage;
  lines: TikTokToken[][];
  kwSet: Set<string>;
  lightWeight: number;
  heavyWeight: number;
  lightColor: string;
  heavyColor: string;
  keywordFilledColor: string;
  baseFontSize: number;
  letterSpacing: string;
  fillDuration: number;
  textShadow: string;
  lineGap: number;
  wordGap: number;
  positionStyle: React.CSSProperties;
}> = ({
  page,
  lines,
  kwSet,
  lineGap,
  wordGap,
  positionStyle,
  ...wordProps
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pageLocalMs = (frame / fps) * 1000;

  // Page entrance: container opacity 0→1 over 6 frames
  const fadeIn = interpolate(frame, [0, 6], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Page exit: 150ms fade
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
              <ContrastWord
                key={idx}
                token={token}
                pageStartMs={page.startMs}
                isKw={isKeyword(token.text, kwSet)}
                {...wordProps}
              />
            ))}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

/* ─── Main Component ─── */

export const Contrast: React.FC<ContrastProps> = ({
  pages,
  keywords = [],
  lightWeight = 300,
  heavyWeight = 900,
  lightColor = "rgba(245,245,240,0.35)",
  heavyColor = "#F5F5F0",
  keywordFilledColor = "#C9A96E",
  baseFontSize = 74,
  position = "bottom",
  maxWordsPerLine = 3,
  lineGap = 6,
  wordGap = 16,
  letterSpacing = "-0.01em",
  fillDuration = 10,
  textShadow = "0 2px 16px rgba(0,0,0,0.5)",
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
            <ContrastPage
              page={page}
              lines={lines}
              kwSet={kwSet}
              lightWeight={lightWeight}
              heavyWeight={heavyWeight}
              lightColor={lightColor}
              heavyColor={heavyColor}
              keywordFilledColor={keywordFilledColor}
              baseFontSize={baseFontSize}
              letterSpacing={letterSpacing}
              fillDuration={fillDuration}
              textShadow={textShadow}
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
