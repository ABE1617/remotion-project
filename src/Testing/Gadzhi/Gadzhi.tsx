import React from "react";
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { TikTokToken } from "../../types/captions";
import type { GadzhiProps } from "./types";
import { msToFrames, getCurrentTimeMs } from "../../utils/timing";
import { FONT_FAMILIES } from "../../utils/fonts";
import { getCaptionPositionStyle } from "../../utils/captionPosition";

const SHADOW = "0 1px 4px rgba(0,0,0,0.5), 0 2px 12px rgba(0,0,0,0.25)";

const GadzhiPage: React.FC<{
  tokens: TikTokToken[];
  pageStartMs: number;
  fontSize: number;
  lightWeight: number;
  boldWeight: number;
  textColor: string;
  wordGap: number;
  maxWordsPerLine: number;
}> = ({
  tokens,
  pageStartMs,
  fontSize,
  lightWeight,
  boldWeight,
  textColor,
  wordGap,
  maxWordsPerLine,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const currentTimeMs = getCurrentTimeMs(frame, fps) + pageStartMs;

  const lines: { token: TikTokToken; idx: number }[][] = [];
  for (let i = 0; i < tokens.length; i += maxWordsPerLine) {
    const chunk = tokens.slice(i, i + maxWordsPerLine);
    lines.push(chunk.map((t, j) => ({ token: t, idx: i + j })));
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 6,
        maxWidth: 850,
        width: "100%",
      }}
    >
      {lines.map((lineTokens, lineIdx) => (
        <div
          key={lineIdx}
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "baseline",
            justifyContent: "center",
            gap: wordGap,
          }}
        >
          {lineTokens.map(({ token, idx }) => {
            const isSpoken = currentTimeMs >= token.fromMs;
            const weight = isSpoken ? boldWeight : lightWeight;

            return (
              <span
                key={idx}
                style={{
                  display: "inline-block",
                  fontFamily: FONT_FAMILIES.montserrat,
                  fontSize,
                  fontWeight: weight,
                  color: textColor,
                  textTransform: "lowercase",
                  letterSpacing: "0.01em",
                  lineHeight: 1.2,
                  whiteSpace: "nowrap",
                  textShadow: SHADOW,
                }}
              >
                {token.text.toLowerCase()}
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export const Gadzhi: React.FC<GadzhiProps> = ({
  pages,
  fontSize = 72,
  position = "bottom",
  lightWeight = 300,
  boldWeight = 700,
  textColor = "#FFFFFF",
  maxWordsPerLine = 4,
  wordGap = 10,
}) => {
  const { fps } = useVideoConfig();
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
          >
            <AbsoluteFill
              style={{
                display: "flex",
                alignItems: "center",
                ...positionStyle,
              }}
            >
              <GadzhiPage
                tokens={page.tokens}
                pageStartMs={page.startMs}
                fontSize={fontSize}
                lightWeight={lightWeight}
                boldWeight={boldWeight}
                textColor={textColor}
                wordGap={wordGap}
                maxWordsPerLine={maxWordsPerLine}
              />
            </AbsoluteFill>
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
