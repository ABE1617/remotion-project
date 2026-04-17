import React, { useMemo } from "react";
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import type { SpringConfig } from "remotion";
import type { TikTokPage, TikTokToken } from "../../types/captions";
import type { TelemetryProps } from "./types";
import { msToFrames } from "../../utils/timing";
import { FONT_FAMILIES } from "../../utils/fonts";
import { getCaptionPositionStyle } from "../../utils/captionPosition";
import { buildKeywordSet, isKeyword } from "../shared/keywords";

const SPRING_TELEMETRY: SpringConfig = {
  damping: 24,
  mass: 0.7,
  stiffness: 140,
  overshootClamping: true,
};

/* ─── Word with bracket reveal ─── */

const TelemetryWord: React.FC<{
  token: TikTokToken;
  pageStartMs: number;
  isKw: boolean;
  textColor: string;
  accentColor: string;
  baseFontSize: number;
  baseFontWeight: number;
  textTransform: "uppercase" | "none";
  letterSpacing: string;
  textShadow: string;
}> = ({
  token,
  pageStartMs,
  isKw,
  textColor,
  accentColor,
  baseFontSize,
  baseFontWeight,
  textTransform,
  letterSpacing,
  textShadow,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const activateFrame = msToFrames(token.fromMs - pageStartMs, fps);
  const elapsed = frame - activateFrame;
  const hasAppeared = elapsed >= 0;

  const entranceSpring = hasAppeared
    ? spring({ fps, frame: elapsed, config: SPRING_TELEMETRY })
    : 0;

  const opacity = interpolate(entranceSpring, [0, 1], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Bracket animation for keywords: slide in from ±8px over 6 frames
  const bracketElapsed = Math.max(0, elapsed);
  const bracketProgress = interpolate(bracketElapsed, [0, 6], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const bracketLeftX = interpolate(bracketProgress, [0, 1], [-8, 0]);
  const bracketRightX = interpolate(bracketProgress, [0, 1], [8, 0]);
  const bracketOpacity = interpolate(bracketProgress, [0, 1], [0, 1]);

  const fontStyle: React.CSSProperties = {
    fontFamily: FONT_FAMILIES.firaSansCondensed,
    fontSize: baseFontSize,
    fontWeight: baseFontWeight,
    textTransform,
    letterSpacing,
    lineHeight: 1.15,
    textShadow,
    whiteSpace: "nowrap",
  };

  const bracketStyle: React.CSSProperties = {
    fontFamily: FONT_FAMILIES.jetBrainsMono,
    fontSize: baseFontSize * 0.85,
    fontWeight: 400,
    color: accentColor,
    opacity: bracketOpacity,
  };

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        opacity,
      }}
    >
      {isKw && (
        <span
          style={{
            ...bracketStyle,
            transform: `translateX(${bracketLeftX}px)`,
          }}
        >
          [
        </span>
      )}
      <span
        style={{
          ...fontStyle,
          color: isKw ? accentColor : textColor,
        }}
      >
        {token.text}
      </span>
      {isKw && (
        <span
          style={{
            ...bracketStyle,
            transform: `translateX(${bracketRightX}px)`,
          }}
        >
          ]
        </span>
      )}
    </span>
  );
};

/* ─── Page ─── */

const TelemetryPage: React.FC<{
  page: TikTokPage;
  lines: TikTokToken[][];
  kwSet: Set<string>;
  textColor: string;
  accentColor: string;
  baseFontSize: number;
  baseFontWeight: number;
  textTransform: "uppercase" | "none";
  letterSpacing: string;
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
  const fadeOut = interpolate(
    pageLocalMs,
    [page.durationMs - 120, page.durationMs],
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
              <TelemetryWord
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

export const Telemetry: React.FC<TelemetryProps> = ({
  pages,
  keywords = [],
  textColor = "#F0EEE9",
  accentColor = "#C5432E",
  baseFontSize = 64,
  baseFontWeight = 500,
  textTransform = "uppercase",
  position = "bottom",
  letterSpacing = "0.04em",
  maxWordsPerLine = 4,
  lineGap = 10,
  wordGap = 12,
  textShadow = "0 1px 6px rgba(0,0,0,0.4)",
}) => {
  const { fps } = useVideoConfig();
  const kwSet = useMemo(() => buildKeywordSet(keywords), [keywords]);
  const positionStyle = getCaptionPositionStyle(position);

  return (
    <AbsoluteFill>
      {/* Caption pages */}
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
            <TelemetryPage
              page={page}
              lines={lines}
              kwSet={kwSet}
              textColor={textColor}
              accentColor={accentColor}
              baseFontSize={baseFontSize}
              baseFontWeight={baseFontWeight}
              textTransform={textTransform}
              letterSpacing={letterSpacing}
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
