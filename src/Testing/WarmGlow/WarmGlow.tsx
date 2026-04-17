import React, { useMemo } from "react";
import {
  AbsoluteFill,
  Sequence,
  useVideoConfig,
} from "remotion";
import type { TikTokToken } from "../../types/captions";
import type { WarmGlowProps } from "./types";
import { msToFrames } from "../../utils/timing";
import { FONT_FAMILIES } from "../../utils/fonts";
import { getCaptionPositionStyle } from "../../utils/captionPosition";

/* ─── Helpers ─── */

function normalizeWord(text: string): string {
  return text.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
}

function buildBlockShadow(depth: number, color: string): string {
  const layers: string[] = [];
  for (let i = 1; i <= depth; i++) {
    layers.push(`${i}px ${i}px 0 ${color}`);
  }
  return layers.join(", ");
}

/* ─── Page Component ─── */

const WarmGlowPage: React.FC<{
  tokens: TikTokToken[];
  fontSize: number;
  textColor: string;
  highlightColor: string;
  keywordSet: Set<string>;
  extrusionColor: string;
  extrusionDepth: number;
  wordGap: number;
  maxWordsPerLine: number;
}> = ({
  tokens,
  fontSize,
  textColor,
  highlightColor,
  keywordSet,
  extrusionColor,
  extrusionDepth,
  wordGap,
  maxWordsPerLine,
}) => {
  const lines: { token: TikTokToken; idx: number }[][] = [];
  for (let i = 0; i < tokens.length; i += maxWordsPerLine) {
    const chunk = tokens.slice(i, i + maxWordsPerLine);
    lines.push(chunk.map((t, j) => ({ token: t, idx: i + j })));
  }

  const shadow = buildBlockShadow(extrusionDepth, extrusionColor);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 4,
        maxWidth: 900,
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
            const isKeyword = keywordSet.has(normalizeWord(token.text));
            const color = isKeyword ? highlightColor : textColor;

            return (
              <span
                key={idx}
                style={{
                  display: "inline-block",
                  fontFamily: FONT_FAMILIES.montserrat,
                  fontSize,
                  fontWeight: 900,
                  color,
                  textTransform: "uppercase",
                  letterSpacing: "0.02em",
                  lineHeight: 1.1,
                  whiteSpace: "nowrap",
                  textShadow: shadow,
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

/* ─── Main Component ─── */

export const WarmGlow: React.FC<WarmGlowProps> = ({
  pages,
  keywords = [],
  fontSize = 85,
  position = "bottom",
  textColor = "#FFFFFF",
  highlightColor = "#FFD700",
  extrusionColor = "#CC5500",
  extrusionDepth = 10,
  maxWordsPerLine = 8,
  wordGap = 16,
}) => {
  const { fps } = useVideoConfig();
  const positionStyle = getCaptionPositionStyle(position);

  const keywordSet = useMemo(() => {
    const set = new Set<string>();
    for (const w of keywords) set.add(normalizeWord(w));
    return set;
  }, [keywords]);

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
              <WarmGlowPage
                tokens={page.tokens}
                fontSize={fontSize}
                textColor={textColor}
                highlightColor={highlightColor}
                keywordSet={keywordSet}
                extrusionColor={extrusionColor}
                extrusionDepth={extrusionDepth}
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
