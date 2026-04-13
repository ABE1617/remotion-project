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
import type { DispatchProps, DispatchContextLine } from "./types";
import { msToFrames } from "../../utils/timing";
import { FONT_FAMILIES } from "../../utils/fonts";
import { getCaptionPositionStyle } from "../../utils/captionPosition";
import { buildKeywordSet, isKeyword } from "../shared/keywords";

const SPRING_DISPATCH: SpringConfig = {
  damping: 22,
  mass: 0.8,
  stiffness: 120,
  overshootClamping: true,
};

/* ─── Word with optional underline ─── */

const DispatchWord: React.FC<{
  token: TikTokToken;
  pageStartMs: number;
  isKw: boolean;
  textColor: string;
  keywordColor: string;
  primaryFontSize: number;
  primaryFontWeight: number;
  textTransform: "uppercase" | "none" | "capitalize";
  letterSpacing: string;
  textShadow: string;
  underlineThickness: number;
}> = ({
  token,
  pageStartMs,
  isKw,
  textColor,
  keywordColor,
  primaryFontSize,
  primaryFontWeight,
  textTransform,
  letterSpacing,
  textShadow,
  underlineThickness,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const activateFrame = msToFrames(token.fromMs - pageStartMs, fps);
  const elapsed = frame - activateFrame;
  const hasAppeared = elapsed >= 0;

  const entranceSpring = hasAppeared
    ? spring({ fps, frame: elapsed, config: SPRING_DISPATCH })
    : 0;

  const opacity = interpolate(entranceSpring, [0, 1], [0, 1], {
    extrapolateRight: "clamp",
  });

  const translateY = interpolate(entranceSpring, [0, 1], [12, 0], {
    extrapolateRight: "clamp",
  });

  // Keyword underline: starts 3 frames after word, grows over 8 frames
  const underlineElapsed = Math.max(0, elapsed - 3);
  const underlineScaleX = isKw
    ? interpolate(underlineElapsed, [0, 8], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 0;

  return (
    <span
      style={{
        display: "inline-block",
        position: "relative",
        fontFamily: FONT_FAMILIES.barlowCondensed,
        fontSize: primaryFontSize,
        fontWeight: primaryFontWeight,
        color: isKw ? keywordColor : textColor,
        textTransform,
        letterSpacing,
        lineHeight: 1.15,
        textShadow,
        whiteSpace: "nowrap",
        transform: `translateY(${translateY}px)`,
        opacity,
      }}
    >
      {token.text}
      {isKw && (
        <span
          style={{
            position: "absolute",
            bottom: -4,
            left: 0,
            width: "100%",
            height: underlineThickness,
            backgroundColor: keywordColor,
            transform: `scaleX(${underlineScaleX})`,
            transformOrigin: "left center",
          }}
        />
      )}
    </span>
  );
};

/* ─── Context Line ─── */

const DispatchContext: React.FC<{
  entry: DispatchContextLine;
  contextFontSize: number;
  contextColor: string;
}> = ({ entry, contextFontSize, contextColor }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const appearFrame = msToFrames(entry.appearAtMs, fps);
  const disappearFrame = msToFrames(entry.disappearAtMs, fps);

  if (frame < appearFrame - 2 || frame > disappearFrame + 8) return null;

  const fadeIn = interpolate(
    frame,
    [appearFrame, appearFrame + 6],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const fadeOut = interpolate(
    frame,
    [disappearFrame - 6, disappearFrame],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <span
      style={{
        fontFamily: FONT_FAMILIES.lora,
        fontSize: contextFontSize,
        fontWeight: 400,
        fontStyle: "italic",
        color: contextColor,
        whiteSpace: "nowrap",
        opacity: Math.min(fadeIn, fadeOut),
      }}
    >
      {entry.text}
    </span>
  );
};

/* ─── Page ─── */

const DispatchPage: React.FC<{
  page: TikTokPage;
  lines: TikTokToken[][];
  kwSet: Set<string>;
  textColor: string;
  keywordColor: string;
  primaryFontSize: number;
  primaryFontWeight: number;
  textTransform: "uppercase" | "none" | "capitalize";
  letterSpacing: string;
  textShadow: string;
  underlineThickness: number;
  lineGap: number;
  wordGap: number;
  positionStyle: React.CSSProperties;
  contextLines: DispatchContextLine[];
  contextFontSize: number;
  contextColor: string;
  contextGap: number;
}> = ({
  page,
  lines,
  kwSet,
  lineGap,
  wordGap,
  positionStyle,
  contextLines,
  contextFontSize,
  contextColor,
  contextGap,
  ...wordProps
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pageLocalMs = (frame / fps) * 1000;
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
        {/* Primary caption lines */}
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
              <DispatchWord
                key={idx}
                token={token}
                pageStartMs={page.startMs}
                isKw={isKeyword(token.text, kwSet)}
                {...wordProps}
              />
            ))}
          </div>
        ))}

        {/* Context line below caption */}
        {contextLines.length > 0 && (
          <div style={{ marginTop: contextGap, textAlign: "center" }}>
            {contextLines.map((entry, i) => (
              <DispatchContext
                key={i}
                entry={entry}
                contextFontSize={contextFontSize}
                contextColor={contextColor}
              />
            ))}
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};

/* ─── Main Component ─── */

export const Dispatch: React.FC<DispatchProps> = ({
  pages,
  keywords = [],
  textColor = "#FFFFFF",
  keywordColor = "#4A90D9",
  primaryFontSize = 72,
  primaryFontWeight = 700,
  textTransform = "uppercase",
  position = "bottom",
  letterSpacing = "0.04em",
  maxWordsPerLine = 4,
  lineGap = 8,
  wordGap = 12,
  underlineThickness = 3,
  contextLines = [],
  contextFontSize = 36,
  contextColor = "rgba(255,255,255,0.6)",
  contextGap = 18,
  textShadow = "0 2px 10px rgba(0,0,0,0.6)",
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
            <DispatchPage
              page={page}
              lines={lines}
              kwSet={kwSet}
              textColor={textColor}
              keywordColor={keywordColor}
              primaryFontSize={primaryFontSize}
              primaryFontWeight={primaryFontWeight}
              textTransform={textTransform}
              letterSpacing={letterSpacing}
              textShadow={textShadow}
              underlineThickness={underlineThickness}
              lineGap={lineGap}
              wordGap={wordGap}
              positionStyle={positionStyle}
              contextLines={contextLines}
              contextFontSize={contextFontSize}
              contextColor={contextColor}
              contextGap={contextGap}
            />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
