import React, { useMemo } from "react";
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  interpolateColors,
} from "remotion";
import type { TikTokToken } from "../../types/captions";
import type { EmberProps } from "./types";
import { msToFrames } from "../../utils/timing";
import { FONT_FAMILIES } from "../../utils/fonts";
import { getCaptionPositionStyle } from "../../utils/captionPosition";
import { buildKeywordSet, isKeyword } from "../shared/keywords";

/* ─── Word Component ─── */

const EmberWord: React.FC<{
  token: TikTokToken;
  pageStartMs: number;
  fontSize: number;
  isKw: boolean;
  textColor: string;
  keywordStartColor: string;
  keywordEndColor: string;
}> = ({
  token,
  pageStartMs,
  fontSize,
  isKw,
  textColor,
  keywordStartColor,
  keywordEndColor,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const activateFrame = msToFrames(token.fromMs - pageStartMs, fps);
  const elapsed = frame - activateFrame;
  const hasAppeared = elapsed >= 0;

  const fadeSpring = hasAppeared
    ? spring({ fps, frame: elapsed, config: { damping: 200 } })
    : 0;

  // Keyword color temperature shift over the word's spoken duration
  let color = textColor;
  if (isKw && hasAppeared) {
    const wordDurationFrames = Math.max(
      msToFrames(token.toMs - token.fromMs, fps),
      1,
    );
    const progress = interpolate(elapsed, [0, wordDurationFrames], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    color = interpolateColors(
      progress,
      [0, 0.4, 1],
      [textColor, keywordStartColor, keywordEndColor],
    );
  }

  const wordFontSize = isKw ? fontSize * 1.4 : fontSize;

  return (
    <span
      style={{
        display: "inline-block",
        fontFamily: FONT_FAMILIES.cormorantGaramond,
        fontWeight: isKw ? 700 : 500,
        fontStyle: isKw ? "italic" : "normal",
        fontSize: wordFontSize,
        lineHeight: 1.1,
        color: hasAppeared ? color : "transparent",
        opacity: fadeSpring,
        textShadow: hasAppeared
          ? "0 2px 12px rgba(0,0,0,0.6), 0 0 40px rgba(0,0,0,0.3)"
          : "none",
        whiteSpace: "nowrap",
        letterSpacing: "-0.02em",
      }}
    >
      {token.text}
    </span>
  );
};

/* ─── Main Component ─── */

export const Ember: React.FC<EmberProps> = ({
  pages,
  fontSize = 78,
  position = "bottom",
  keywords = [],
  maxWordsPerLine = 4,
  lineGap = 14,
  wordGap = 16,
  textColor = "#F5E6D3",
  keywordStartColor = "#D4A24C",
  keywordEndColor = "#CC5500",
  showVignette = true,
}) => {
  const { fps } = useVideoConfig();
  const keywordSet = useMemo(() => buildKeywordSet(keywords), [keywords]);
  const positionStyle = getCaptionPositionStyle(position);

  return (
    <AbsoluteFill>
      {/* Dark vignette overlay for cinematic depth */}
      {showVignette && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse at center bottom, rgba(0,0,0,0.5) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
      )}

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
            <AbsoluteFill
              style={{
                display: "flex",
                alignItems: "center",
                ...positionStyle,
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
                      flexWrap: "wrap",
                      alignItems: "baseline",
                      justifyContent: "center",
                      columnGap: wordGap,
                      rowGap: lineGap,
                    }}
                  >
                    {lineTokens.map((token, tokenIdx) => (
                      <EmberWord
                        key={tokenIdx}
                        token={token}
                        pageStartMs={page.startMs}
                        fontSize={fontSize}
                        isKw={isKeyword(token.text, keywordSet)}
                        textColor={textColor}
                        keywordStartColor={keywordStartColor}
                        keywordEndColor={keywordEndColor}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </AbsoluteFill>
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
