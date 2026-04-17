import React, { useMemo } from "react";
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
} from "remotion";
import type { TikTokToken } from "../../types/captions";
import type { TitanProps } from "./types";
import { msToFrames, getCurrentTimeMs } from "../../utils/timing";
import { FONT_FAMILIES } from "../../utils/fonts";
import { buildKeywordSet, isKeyword } from "../shared/keywords";

const SHADOW = "0 2px 8px rgba(0,0,0,0.5), 0 4px 20px rgba(0,0,0,0.3)";
const SLIDE_FRAMES_NORMAL = 10;
const SLIDE_FRAMES_KEYWORD = 16;
const SLIDE_DISTANCE_NORMAL = 35;
const SLIDE_DISTANCE_KEYWORD = 50;

const TitanPage: React.FC<{
  tokens: TikTokToken[];
  pageStartMs: number;
  fontSize: number;
  textColor: string;
  highlightColor: string;
  keywordSet: Set<string>;
  maxWordsPerLine: number;
  wordGap: number;
}> = ({
  tokens,
  pageStartMs,
  fontSize,
  textColor,
  highlightColor,
  keywordSet,
  maxWordsPerLine,
  wordGap,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const currentTimeMs = getCurrentTimeMs(frame, fps) + pageStartMs;

  // Split tokens into lines
  const lines: TikTokToken[][] = [];
  for (let i = 0; i < tokens.length; i += maxWordsPerLine) {
    lines.push(tokens.slice(i, i + maxWordsPerLine));
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 4,
      }}
    >
      {lines.map((lineTokens, lineIdx) => (
        <div
          key={lineIdx}
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: wordGap,
          }}
        >
          {lineTokens.map((token, wi) => {
            const isSpoken = currentTimeMs >= token.fromMs;
            const isKw = isKeyword(token.text, keywordSet);
            const finalColor = isKw ? highlightColor : textColor;

            // Slide up entrance — keywords slide slower from further down
            const slideDuration = isKw ? SLIDE_FRAMES_KEYWORD : SLIDE_FRAMES_NORMAL;
            const slideDist = isKw ? SLIDE_DISTANCE_KEYWORD : SLIDE_DISTANCE_NORMAL;
            const wordEntryFrame = msToFrames(token.fromMs - pageStartMs, fps);
            const elapsed = frame - wordEntryFrame;

            const slideProgress = interpolate(elapsed, [0, slideDuration], [0, 1], {
              easing: Easing.out(Easing.cubic),
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });

            const yOffset = interpolate(slideProgress, [0, 1], [slideDist, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });

            const opacity = interpolate(slideProgress, [0, 0.4], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });

            // Starts grey, transitions to final color as it lands
            const colorProgress = interpolate(slideProgress, [0, 1], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            const color = colorProgress >= 1
              ? finalColor
              : `color-mix(in srgb, #555555 ${Math.round((1 - colorProgress) * 100)}%, ${finalColor} ${Math.round(colorProgress * 100)}%)`;

            return (
              <span
                key={wi}
                style={{
                  display: "inline-block",
                  fontFamily: FONT_FAMILIES.montserrat,
                  fontSize,
                  fontWeight: 700,
                  color,
                  textTransform: "uppercase",
                  letterSpacing: "0.02em",
                  lineHeight: 1.05,
                  whiteSpace: "nowrap",
                  textShadow: SHADOW,
                  opacity: isSpoken ? opacity : 0,
                  transform: isSpoken ? `translateY(${yOffset}px)` : `translateY(${slideDist}px)`,
                  visibility: isSpoken ? "visible" : "hidden",
                }}
              >
                {token.text}
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export const Titan: React.FC<TitanProps> = ({
  pages,
  fontSize = 90,
  textColor = "#FFFFFF",
  highlightColor = "#F5C518",
  keywords = [],
  maxWordsPerLine = 2,
  wordGap = 14,
}) => {
  const { fps } = useVideoConfig();
  const keywordSet = useMemo(() => buildKeywordSet(keywords), [keywords]);

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
          >
            <AbsoluteFill
              style={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "flex-start",
                paddingLeft: 80,
                paddingRight: 80,
                paddingBottom: 300,
              }}
            >
              <TitanPage
                tokens={page.tokens}
                pageStartMs={page.startMs}
                fontSize={fontSize}
                textColor={textColor}
                highlightColor={highlightColor}
                keywordSet={keywordSet}
                maxWordsPerLine={maxWordsPerLine}
                wordGap={wordGap}
              />
            </AbsoluteFill>
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
