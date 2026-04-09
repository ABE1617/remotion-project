import React from "react";
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
} from "remotion";
import type { WeightShiftCaptionProps } from "./types";
import { FONT_FAMILIES } from "../../../utils/fonts";
import { msToFrames } from "../../../utils/timing";
import { getCaptionPositionStyle } from "../../../utils/captionPosition";

const UPCOMING_OPACITY = 0.55;

const WeightShiftWord: React.FC<{
  text: string;
  tokenStart: number;
  tokenEnd: number;
  currentTimeMs: number;
  fontSize: number;
  lightWeight: number;
  boldWeight: number;
  textColor: string;
  letterSpacing: string;
  lineHeight: number;
  enableShadow: boolean;
  shiftDurationMs: number;
}> = ({
  text,
  tokenStart,
  tokenEnd,
  currentTimeMs,
  fontSize,
  lightWeight,
  boldWeight,
  textColor,
  letterSpacing,
  lineHeight,
  enableShadow,
  shiftDurationMs,
}) => {
  const msIntoWord = currentTimeMs - tokenStart;
  const shiftProgress = interpolate(msIntoWord, [0, shiftDurationMs], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const easedShift = Easing.out(Easing.cubic)(shiftProgress);

  const hasBeenSpoken = currentTimeMs >= tokenEnd;
  const isActive = currentTimeMs >= tokenStart && currentTimeMs < tokenEnd;
  const isUpcoming = currentTimeMs < tokenStart;

  let lightOpacity: number;
  let boldOpacity: number;

  if (isUpcoming) {
    lightOpacity = UPCOMING_OPACITY;
    boldOpacity = 0;
  } else if (isActive) {
    lightOpacity = interpolate(easedShift, [0, 1], [UPCOMING_OPACITY, 0]);
    boldOpacity = interpolate(easedShift, [0, 1], [0, 1]);
  } else if (hasBeenSpoken) {
    lightOpacity = 0;
    boldOpacity = 1;
  } else {
    lightOpacity = UPCOMING_OPACITY;
    boldOpacity = 0;
  }

  const textShadow = enableShadow
    ? "0 2px 4px rgba(0,0,0,0.35), 0 4px 10px rgba(0,0,0,0.2)"
    : "none";

  const sharedStyle: React.CSSProperties = {
    fontFamily: FONT_FAMILIES.montserrat,
    fontSize,
    letterSpacing,
    lineHeight,
    textShadow,
    color: textColor,
    whiteSpace: "nowrap",
    position: "absolute",
    top: 0,
    left: 0,
  };

  return (
    <span style={{ display: "inline-block", position: "relative" }}>
      <span
        style={{
          fontFamily: FONT_FAMILIES.montserrat,
          fontSize,
          fontWeight: boldWeight,
          letterSpacing,
          lineHeight,
          visibility: "hidden",
          whiteSpace: "nowrap",
        }}
      >
        {text}
      </span>
      <span style={{ ...sharedStyle, fontWeight: lightWeight, opacity: lightOpacity }}>
        {text}
      </span>
      <span style={{ ...sharedStyle, fontWeight: boldWeight, opacity: boldOpacity }}>
        {text}
      </span>
    </span>
  );
};

const WeightShiftPage: React.FC<{
  page: { text: string; startMs: number; durationMs: number; tokens: { text: string; fromMs: number; toMs: number }[] };
  fontSize: number;
  lightWeight: number;
  boldWeight: number;
  textColor: string;
  fadeInDurationMs: number;
  fadeOutDurationMs: number;
  weightShiftDurationMs: number;
  letterSpacing: string;
  lineHeight: number;
  lowercase: boolean;
  enableShadow: boolean;
  maxWidth: number;
}> = ({
  page,
  fontSize,
  lightWeight,
  boldWeight,
  textColor,
  fadeInDurationMs,
  fadeOutDurationMs,
  weightShiftDurationMs,
  letterSpacing,
  lineHeight,
  lowercase,
  enableShadow,
  maxWidth,
}) => {
  // Inside a Sequence, useCurrentFrame() is relative to Sequence start
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  // Convert back to absolute time
  const currentTimeMs = page.startMs + (frame / fps) * 1000;

  const pageLocalMs = currentTimeMs - page.startMs;
  const fadeIn = interpolate(pageLocalMs, [0, fadeInDurationMs], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fadeOutStart = page.durationMs - fadeOutDurationMs;
  const fadeOut = interpolate(pageLocalMs, [fadeOutStart, page.durationMs], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const pageOpacity = Math.min(fadeIn, fadeOut);

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        alignItems: "baseline",
        gap: "6px 14px",
        opacity: pageOpacity,
        maxWidth,
      }}
    >
      {page.tokens.map((token, idx) => {
        const word = lowercase ? token.text.toLowerCase() : token.text;
        return (
          <WeightShiftWord
            key={idx}
            text={word}
            tokenStart={token.fromMs}
            tokenEnd={token.toMs}
            currentTimeMs={currentTimeMs}
            fontSize={fontSize}
            lightWeight={lightWeight}
            boldWeight={boldWeight}
            textColor={textColor}
            letterSpacing={letterSpacing}
            lineHeight={lineHeight}
            enableShadow={enableShadow}
            shiftDurationMs={weightShiftDurationMs}
          />
        );
      })}
    </div>
  );
};

export const WeightShiftCaption: React.FC<WeightShiftCaptionProps> = ({
  pages,
  fontSize = 60,
  position = "bottom",
  lightWeight = 300,
  boldWeight = 700,
  textColor = "#FFFFFF",
  fadeInDurationMs = 150,
  fadeOutDurationMs = 150,
  weightShiftDurationMs = 200,
  letterSpacing = "0.02em",
  lineHeight = 1.3,
  lowercase = true,
  enableShadow = true,
}) => {
  const { fps, width } = useVideoConfig();
  const maxWidth = width * 0.85;

  const positionStyle: React.CSSProperties = getCaptionPositionStyle(position);

  return (
    <AbsoluteFill>
      {pages.map((page, pageIndex) => {
        const startFrame = msToFrames(page.startMs, fps);
        const durationFrames = msToFrames(page.durationMs, fps);
        if (durationFrames <= 0) return null;

        return (
          <Sequence
            premountFor={10}
            key={pageIndex}
            from={startFrame}
            durationInFrames={durationFrames}
            name={page.tokens.map((t) => t.text).join(" ")}
          >
            <AbsoluteFill
              style={{
                display: "flex",
                alignItems: "center",
                ...positionStyle,
              }}
            >
              <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
                <WeightShiftPage
                  page={page}
                  fontSize={fontSize}
                  lightWeight={lightWeight}
                  boldWeight={boldWeight}
                  textColor={textColor}
                  fadeInDurationMs={fadeInDurationMs}
                  fadeOutDurationMs={fadeOutDurationMs}
                  weightShiftDurationMs={weightShiftDurationMs}
                  letterSpacing={letterSpacing}
                  lineHeight={lineHeight}
                  lowercase={lowercase}
                  enableShadow={enableShadow}
                  maxWidth={maxWidth}
                />
              </div>
            </AbsoluteFill>
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
