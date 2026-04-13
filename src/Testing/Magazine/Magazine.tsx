import React, { useMemo } from "react";
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import type { TikTokToken } from "../../types/captions";
import type { MagazineProps } from "./types";
import { msToFrames } from "../../utils/timing";
import { FONT_FAMILIES } from "../../utils/fonts";
import { getCaptionPositionStyle } from "../../utils/captionPosition";
import { buildKeywordSet, isKeyword } from "../shared/keywords";

/* ─── Word Component ─── */

const MagazineWord: React.FC<{
  token: TikTokToken;
  pageStartMs: number;
  fontSize: number;
  isKw: boolean;
  textColor: string;
  accentColor: string;
  showRule: boolean;
  blurRange: number;
}> = ({
  token,
  pageStartMs,
  fontSize,
  isKw,
  textColor,
  accentColor,
  showRule,
  blurRange,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const activateFrame = msToFrames(token.fromMs - pageStartMs, fps);
  const elapsed = frame - activateFrame;
  const hasAppeared = elapsed >= 0;

  const entranceSpring = hasAppeared
    ? spring({ fps, frame: elapsed, config: { damping: 200 } })
    : 0;

  // Slide up from 8px below
  const translateY = interpolate(entranceSpring, [0, 1], [8, 0], {
    extrapolateRight: "clamp",
  });

  // Blur-to-sharp focus pull
  const blur = interpolate(entranceSpring, [0, 1], [blurRange, 0], {
    extrapolateRight: "clamp",
  });

  const wordFontSize = isKw ? fontSize * 1.5 : fontSize;

  // Horizontal rule width for keywords
  const ruleWidth = isKw && showRule
    ? interpolate(entranceSpring, [0, 1], [0, 24], {
        extrapolateRight: "clamp",
      })
    : 0;

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "baseline",
        gap: isKw && showRule ? 10 : 0,
        position: "relative",
      }}
    >
      {/* Horizontal rule before keyword */}
      {isKw && showRule && hasAppeared && (
        <span
          style={{
            display: "inline-block",
            width: ruleWidth,
            height: 1,
            backgroundColor: accentColor,
            opacity: 0.6,
            alignSelf: "center",
            flexShrink: 0,
          }}
        />
      )}
      <span
        style={{
          display: "inline-block",
          fontFamily: isKw
            ? FONT_FAMILIES.playfairDisplay
            : FONT_FAMILIES.montserrat,
          fontWeight: isKw ? 400 : 600,
          fontStyle: isKw ? "italic" : "normal",
          fontSize: wordFontSize,
          lineHeight: 1.1,
          color: hasAppeared ? (isKw ? accentColor : textColor) : "transparent",
          opacity: entranceSpring,
          transform: `translateY(${translateY}px)`,
          filter: `blur(${blur}px)`,
          textShadow: hasAppeared
            ? "0 2px 16px rgba(0,0,0,0.5)"
            : "none",
          whiteSpace: "nowrap",
          letterSpacing: isKw ? "-0.02em" : "0.02em",
        }}
      >
        {token.text}
      </span>
    </span>
  );
};

/* ─── Main Component ─── */

export const Magazine: React.FC<MagazineProps> = ({
  pages,
  fontSize = 68,
  position = "bottom",
  keywords = [],
  maxWordsPerLine = 3,
  lineGap = 16,
  wordGap = 14,
  textColor = "#FAFAF5",
  accentColor = "#6B2D3E",
  showRule = true,
  blurRange = 3,
}) => {
  const { fps } = useVideoConfig();
  const keywordSet = useMemo(() => buildKeywordSet(keywords), [keywords]);
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
                  alignItems: "flex-start",
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
                      justifyContent: "flex-start",
                      columnGap: wordGap,
                      rowGap: lineGap,
                    }}
                  >
                    {lineTokens.map((token, tokenIdx) => (
                      <MagazineWord
                        key={tokenIdx}
                        token={token}
                        pageStartMs={page.startMs}
                        fontSize={fontSize}
                        isKw={isKeyword(token.text, keywordSet)}
                        textColor={textColor}
                        accentColor={accentColor}
                        showRule={showRule}
                        blurRange={blurRange}
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
