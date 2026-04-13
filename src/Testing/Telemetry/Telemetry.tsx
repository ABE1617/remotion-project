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
import type { TelemetryProps, TelemetryAnnotation } from "./types";
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

/* ─── Scan Line ─── */

const TelemetryScanLine: React.FC<{
  scanLineColor: string;
  scanLineCycle: number;
}> = ({ scanLineColor, scanLineCycle }) => {
  const frame = useCurrentFrame();

  const scanY = interpolate(
    frame % scanLineCycle,
    [0, scanLineCycle],
    [0, 1920],
  );

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: 1,
        backgroundColor: scanLineColor,
        transform: `translateY(${scanY}px)`,
        pointerEvents: "none",
      }}
    />
  );
};

/* ─── Corner Annotation ─── */

const TelemetryAnnotationItem: React.FC<{
  annotation: TelemetryAnnotation;
  annotationFontSize: number;
  accentColor: string;
  textColor: string;
  pages: TikTokPage[];
}> = ({ annotation, annotationFontSize, accentColor, textColor, pages }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const currentTimeMs = (frame / fps) * 1000;

  // Compute dynamic values
  let displayValue: string;
  if (annotation.value === "timestamp") {
    const seconds = currentTimeMs / 1000;
    displayValue = `T+${seconds.toFixed(1)}s`;
  } else if (annotation.value === "wordcount") {
    let count = 0;
    for (const page of pages) {
      for (const token of page.tokens) {
        if (currentTimeMs >= token.fromMs) count++;
      }
    }
    displayValue = String(count);
  } else if (annotation.value === "wpm") {
    const elapsed = currentTimeMs / 1000 / 60; // minutes
    let count = 0;
    for (const page of pages) {
      for (const token of page.tokens) {
        if (currentTimeMs >= token.fromMs) count++;
      }
    }
    displayValue = elapsed > 0 ? String(Math.round(count / elapsed)) : "0";
  } else {
    displayValue = annotation.value;
  }

  const cornerStyle: React.CSSProperties = { position: "absolute" };
  switch (annotation.corner) {
    case "top-left":
      cornerStyle.top = 40;
      cornerStyle.left = 40;
      break;
    case "top-right":
      cornerStyle.top = 40;
      cornerStyle.right = 40;
      break;
    case "bottom-left":
      cornerStyle.bottom = 40;
      cornerStyle.left = 40;
      break;
    case "bottom-right":
      cornerStyle.bottom = 40;
      cornerStyle.right = 40;
      break;
  }

  return (
    <div style={cornerStyle}>
      <div
        style={{
          fontFamily: FONT_FAMILIES.jetBrainsMono,
          fontSize: annotationFontSize * 0.75,
          fontWeight: 400,
          color: `${textColor}80`,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          lineHeight: 1.4,
        }}
      >
        {annotation.label}
      </div>
      <div
        style={{
          fontFamily: FONT_FAMILIES.jetBrainsMono,
          fontSize: annotationFontSize,
          fontWeight: 500,
          color: accentColor,
          letterSpacing: "0.02em",
          lineHeight: 1.2,
        }}
      >
        {displayValue}
      </div>
    </div>
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

const DEFAULT_ANNOTATIONS: TelemetryAnnotation[] = [
  { label: "ELAPSED", value: "timestamp", corner: "top-left" },
  { label: "WORDS", value: "wordcount", corner: "top-right" },
  { label: "RATE", value: "wpm", corner: "bottom-left" },
  { label: "SIG", value: "ACTIVE", corner: "bottom-right" },
];

export const Telemetry: React.FC<TelemetryProps> = ({
  pages,
  keywords = [],
  textColor = "#F0EEE9",
  accentColor = "#C5432E",
  baseFontSize = 64,
  baseFontWeight = 500,
  annotationFontSize = 24,
  textTransform = "uppercase",
  position = "bottom",
  letterSpacing = "0.04em",
  maxWordsPerLine = 4,
  lineGap = 10,
  wordGap = 12,
  showScanLine = true,
  scanLineColor = "rgba(197,67,46,0.15)",
  scanLineCycle = 90,
  annotations = DEFAULT_ANNOTATIONS,
  showFrame = true,
  frameBorderColor = "rgba(240,238,233,0.08)",
  textShadow = "0 1px 6px rgba(0,0,0,0.4)",
}) => {
  const { fps } = useVideoConfig();
  const kwSet = useMemo(() => buildKeywordSet(keywords), [keywords]);
  const positionStyle = getCaptionPositionStyle(position);

  return (
    <AbsoluteFill>
      {/* Thin border frame */}
      {showFrame && (
        <div
          style={{
            position: "absolute",
            top: 30,
            left: 30,
            right: 30,
            bottom: 30,
            border: `1px solid ${frameBorderColor}`,
            pointerEvents: "none",
          }}
        />
      )}

      {/* Scan line */}
      {showScanLine && (
        <TelemetryScanLine
          scanLineColor={scanLineColor}
          scanLineCycle={scanLineCycle}
        />
      )}

      {/* Corner annotations */}
      {annotations.map((annotation, i) => (
        <TelemetryAnnotationItem
          key={i}
          annotation={annotation}
          annotationFontSize={annotationFontSize}
          accentColor={accentColor}
          textColor={textColor}
          pages={pages}
        />
      ))}

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
