import React from "react";
import {
  AbsoluteFill,
  Sequence,
  interpolate,
  interpolateColors,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { TikTokToken, TikTokPage } from "../shared/types";
import type { PaperIIProps } from "./types";
import { FONT_FAMILIES } from "../../../utils/fonts";
import { msToFrames } from "../../../utils/timing";
import { getCaptionPositionStyle } from "../../../utils/captionPosition";

// ---------------------------------------------------------------------------
// PaperIIWord
// ---------------------------------------------------------------------------

const PaperIIWord: React.FC<{
  token: TikTokToken;
  pageStartMs: number;
  upcomingColor: string;
  activeColor: string;
  allCaps: boolean;
  fontSize: number;
  fontFamily: string;
  fontWeight: number | string;
  letterSpacing: string;
  colorTransitionMs: number;
}> = ({
  token,
  pageStartMs,
  upcomingColor,
  activeColor,
  allCaps,
  fontSize,
  fontFamily,
  fontWeight,
  letterSpacing,
  colorTransitionMs,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const currentTimeMs = (frame / fps) * 1000 + pageStartMs;
  const isPast = currentTimeMs >= token.toMs;

  // Smooth color transition over colorTransitionMs
  const transitionProgress = interpolate(
    currentTimeMs,
    [token.fromMs, token.fromMs + colorTransitionMs],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const color =
    transitionProgress >= 1 || isPast
      ? activeColor
      : interpolateColors(transitionProgress, [0, 1], [upcomingColor, activeColor]);

  return (
    <span
      style={{
        display: "inline-block",
        fontFamily,
        fontSize,
        fontWeight,
        color,
        textTransform: allCaps ? "uppercase" : "none",
        letterSpacing,
        lineHeight: 1.1,
        whiteSpace: "nowrap",
      }}
    >
      {token.text}
    </span>
  );
};

// ---------------------------------------------------------------------------
// PaperIIStrip — one rounded white strip containing one line of words
// ---------------------------------------------------------------------------

const PaperIIStrip: React.FC<{
  tokens: TikTokToken[];
  pageStartMs: number;
  paperColor: string;
  upcomingColor: string;
  activeColor: string;
  allCaps: boolean;
  fontSize: number;
  fontFamily: string;
  fontWeight: number | string;
  letterSpacing: string;
  colorTransitionMs: number;
  stripPaddingX: number;
  stripPaddingY: number;
  borderRadius: number;
}> = ({
  tokens,
  pageStartMs,
  paperColor,
  upcomingColor,
  activeColor,
  allCaps,
  fontSize,
  fontFamily,
  fontWeight,
  letterSpacing,
  colorTransitionMs,
  stripPaddingX,
  stripPaddingY,
  borderRadius,
}) => {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
        padding: `${stripPaddingY}px ${stripPaddingX}px`,
        backgroundColor: paperColor,
        borderRadius,
        boxShadow: "0 2px 6px rgba(0,0,0,0.10), 0 1px 2px rgba(0,0,0,0.06)",
      }}
    >
      {tokens.map((token, idx) => (
        <PaperIIWord
          key={idx}
          token={token}
          pageStartMs={pageStartMs}
          upcomingColor={upcomingColor}
          activeColor={activeColor}
          allCaps={allCaps}
          fontSize={fontSize}
          fontFamily={fontFamily}
          fontWeight={fontWeight}
          letterSpacing={letterSpacing}
          colorTransitionMs={colorTransitionMs}
        />
      ))}
    </div>
  );
};

// ---------------------------------------------------------------------------
// PaperIIPage — one caption page (Sequence), splits tokens into strip lines
// ---------------------------------------------------------------------------

const PaperIIPage: React.FC<{
  page: TikTokPage;
  maxWordsPerLine: number;
  stripGap: number;
  slideDistance: number;
  paperColor: string;
  upcomingColor: string;
  activeColor: string;
  allCaps: boolean;
  fontSize: number;
  fontFamily: string;
  fontWeight: number | string;
  letterSpacing: string;
  colorTransitionMs: number;
  stripPaddingX: number;
  stripPaddingY: number;
  borderRadius: number;
}> = ({
  page,
  maxWordsPerLine,
  stripGap,
  slideDistance,
  ...stripProps
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Split tokens into lines
  const lines: TikTokToken[][] = [];
  for (let i = 0; i < page.tokens.length; i += maxWordsPerLine) {
    lines.push(page.tokens.slice(i, i + maxWordsPerLine));
  }

  // Simple fade in/out
  const pageLocalMs = (frame / fps) * 1000;
  const fadeInOpacity = interpolate(
    pageLocalMs,
    [0, 120],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const fadeOutOpacity = interpolate(
    pageLocalMs,
    [page.durationMs - 150, page.durationMs],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: stripGap,
        opacity: Math.min(fadeInOpacity, fadeOutOpacity),
      }}
    >
      {lines.map((lineTokens, lineIdx) => (
        <PaperIIStrip
          key={lineIdx}
          tokens={lineTokens}
          pageStartMs={page.startMs}
          {...stripProps}
        />
      ))}
    </div>
  );
};

// ---------------------------------------------------------------------------
// PaperII — main exported component
// ---------------------------------------------------------------------------

export const PaperII: React.FC<PaperIIProps> = ({
  pages,
  paperColor = "#FFFFFF",
  upcomingColor = "#B0B0B0",
  activeColor = "#1A1A1A",
  fontFamily = FONT_FAMILIES.montserrat,
  fontSize = 64,
  fontWeight = 900,
  position = "bottom",
  maxWordsPerLine = 4,
  allCaps = false,
  letterSpacing = "0.03em",
  stripPaddingX = 44,
  stripPaddingY = 26,
  stripGap = 10,
  borderRadius = 28,
  slideDistance = 20,
  colorTransitionMs = 60,
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
            premountFor={10}
          >
            <AbsoluteFill
              style={{
                display: "flex",
                alignItems: "center",
                ...positionStyle,
              }}
            >
              <PaperIIPage
                page={page}
                maxWordsPerLine={maxWordsPerLine}
                stripGap={stripGap}
                slideDistance={slideDistance}
                paperColor={paperColor}
                upcomingColor={upcomingColor}
                activeColor={activeColor}
                allCaps={allCaps}
                fontSize={fontSize}
                fontFamily={fontFamily}
                fontWeight={fontWeight}
                letterSpacing={letterSpacing}
                colorTransitionMs={colorTransitionMs}
                stripPaddingX={stripPaddingX}
                stripPaddingY={stripPaddingY}
                borderRadius={borderRadius}
              />
            </AbsoluteFill>
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
