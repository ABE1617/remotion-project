import React, { useMemo } from "react";
import {
  AbsoluteFill,
  Sequence,
  spring,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { TikTokToken, TikTokPage } from "../../types/captions";
import type { RetroVHSProps } from "./types";
import { FONT_FAMILIES } from "../../utils/fonts";
import { msToFrames } from "../../utils/timing";
import { getCaptionPositionStyle } from "../../utils/captionPosition";

// ── Helpers ────────────────────────────────────────────────────────────────

function seededRand(a: number, b: number): number {
  return Math.abs(Math.sin(a * 127.1 + b * 311.7) * 43758.5453) % 1;
}

function splitIntoLines(
  tokens: TikTokToken[],
  maxPerLine: number,
): TikTokToken[][] {
  const lines: TikTokToken[][] = [];
  for (let i = 0; i < tokens.length; i += maxPerLine) {
    lines.push(tokens.slice(i, i + maxPerLine));
  }
  return lines;
}

// ── ScanlineOverlay ────────────────────────────────────────────────────────
// A repeating horizontal dark-line pattern that mimics CRT scanlines.

const ScanlineOverlay: React.FC = () => (
  <div
    style={{
      position: "absolute",
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundImage: `repeating-linear-gradient(
        to bottom,
        rgba(0,0,0,0) 0px,
        rgba(0,0,0,0) 3px,
        rgba(0,0,0,0.18) 3px,
        rgba(0,0,0,0.18) 4px
      )`,
      pointerEvents: "none",
    }}
  />
);

// ── RetroVHSWord ───────────────────────────────────────────────────────────
//
// All words in the page appear simultaneously at page start, each seeking
// in from a random horizontal direction (simulating VHS head-seeking to
// find the data). Entry is fast with hard stop (no bounce).
//
// • ACTIVE word: bright white + red/blue channel split via drop-shadow.
//   A subtle Y tracking jitter oscillates at a low frequency.
// • PAST words: dimmed warm white, settled.
// • UPCOMING words: dark gray, visible but clearly unactivated.
//   Subtle Y tracking jitter reinforces the "signal not locked" feel.

const RetroVHSWord: React.FC<{
  token: TikTokToken;
  tokenIndex: number;
  pageIndex: number;
  pageStartFrame: number;
  currentTimeMs: number;
  activeColor: string;
  pastColor: string;
  upcomingColor: string;
  chromaticOffset: number;
  trackingAmplitude: number;
  fontFamily: string;
  fontSize: number;
  fontWeight: number | string;
  letterSpacing: number;
  allCaps: boolean;
}> = ({
  token,
  tokenIndex,
  pageIndex,
  pageStartFrame,
  currentTimeMs,
  activeColor,
  pastColor,
  upcomingColor,
  chromaticOffset,
  trackingAmplitude,
  fontFamily,
  fontSize,
  fontWeight,
  letterSpacing,
  allCaps,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const isActive = currentTimeMs >= token.fromMs && currentTimeMs < token.toMs;
  const isPast = currentTimeMs >= token.toMs;

  // ── Seek-in entry (all words start at page start, frame 0) ────────────
  // Each word comes from a random horizontal direction and locks quickly.
  const r1 = seededRand(tokenIndex * 5 + 1, pageIndex * 7 + 2);
  const r2 = seededRand(tokenIndex * 11 + 3, pageIndex * 3 + 8);

  const seekDir = r1 > 0.5 ? 1 : -1;
  const seekDist = 20 + r2 * 24; // 20–44px

  const seekSpring = spring({
    fps,
    frame, // starts at page frame 0 for all words
    config: {
      mass: 0.3,
      damping: 22,
      stiffness: 450,
      overshootClamping: true, // VHS seeks fast and stops — no bounce
    },
  });

  const translateX = interpolate(seekSpring, [0, 1], [seekDir * seekDist, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const entryOpacity = interpolate(seekSpring, [0, 0.12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── Tracking jitter (Y noise — upcoming and active words only) ────────
  // Active word: very subtle high-frequency jitter (tape being read)
  // Upcoming word: slightly more jitter (signal not locked)
  const jitterFreq = isActive ? 2.3 : 1.1;
  const jitterAmp = isActive ? trackingAmplitude * 0.5 : trackingAmplitude;
  const trackingY = !isPast
    ? Math.sin(frame * jitterFreq * 0.21 + tokenIndex * 1.7 + pageIndex * 0.9) * jitterAmp
    : 0;

  // ── Colors ────────────────────────────────────────────────────────────
  const textColor = isPast ? pastColor : isActive ? activeColor : upcomingColor;
  const stateOpacity = isPast ? 0.65 : isActive ? 1.0 : 0.45;
  const finalOpacity = entryOpacity * stateOpacity;

  // ── Chromatic aberration (active only) ────────────────────────────────
  // Simulated via drop-shadow: red shifted left, blue shifted right.
  // The shadowed copies overlay on the video to create the R/G/B channel
  // split look of VHS chromatic bleeding.
  const chromaticFilter = isActive
    ? `drop-shadow(-${chromaticOffset}px 0 0 rgba(255,40,40,0.78)) drop-shadow(${chromaticOffset}px 0 0 rgba(40,80,255,0.78)) drop-shadow(0 2px 6px rgba(0,0,0,0.7))`
    : `drop-shadow(0 2px 4px rgba(0,0,0,0.65))`;

  const displayText = allCaps ? token.text.toUpperCase() : token.text;

  return (
    <span
      style={{
        display: "inline-block",
        opacity: finalOpacity,
        transform: `translateX(${translateX}px) translateY(${trackingY}px)`,
        filter: chromaticFilter,
        fontFamily,
        fontSize,
        fontWeight,
        color: textColor,
        letterSpacing: `${letterSpacing}em`,
        lineHeight: 1.2,
        whiteSpace: "nowrap",
        willChange: "transform, opacity, filter",
      }}
    >
      {displayText}
    </span>
  );
};

// ── RetroVHSPage ───────────────────────────────────────────────────────────

const RetroVHSPage: React.FC<{
  page: TikTokPage;
  pageIndex: number;
  pageStartFrame: number;
  activeColor: string;
  pastColor: string;
  upcomingColor: string;
  chromaticOffset: number;
  showScanlines: boolean;
  trackingAmplitude: number;
  fontFamily: string;
  fontSize: number;
  fontWeight: number | string;
  letterSpacing: number;
  allCaps: boolean;
  maxWordsPerLine: number;
  lineGap: number;
  wordGap: number;
}> = ({
  page,
  pageIndex,
  pageStartFrame,
  activeColor,
  pastColor,
  upcomingColor,
  chromaticOffset,
  showScanlines,
  trackingAmplitude,
  fontFamily,
  fontSize,
  fontWeight,
  letterSpacing,
  allCaps,
  maxWordsPerLine,
  lineGap,
  wordGap,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const currentTimeMs = page.startMs + (frame / fps) * 1000;

  const lines = useMemo(
    () => splitIntoLines(page.tokens, maxWordsPerLine),
    [page.tokens, maxWordsPerLine],
  );

  return (
    <div
      style={{
        position: "relative",
        display: "inline-flex",
        flexDirection: "column",
        alignItems: "center",
        gap: lineGap,
      }}
    >
      {showScanlines && <ScanlineOverlay />}
      {lines.map((lineTokens, li) => (
        <div
          key={li}
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            flexWrap: "nowrap",
            gap: wordGap,
          }}
        >
          {lineTokens.map((token, ti) => {
            const tokenIndex = li * maxWordsPerLine + ti;
            return (
              <RetroVHSWord
                key={`${li}-${ti}`}
                token={token}
                tokenIndex={tokenIndex}
                pageIndex={pageIndex}
                pageStartFrame={pageStartFrame}
                currentTimeMs={currentTimeMs}
                activeColor={activeColor}
                pastColor={pastColor}
                upcomingColor={upcomingColor}
                chromaticOffset={chromaticOffset}
                trackingAmplitude={trackingAmplitude}
                fontFamily={fontFamily}
                fontSize={fontSize}
                fontWeight={fontWeight}
                letterSpacing={letterSpacing}
                allCaps={allCaps}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
};

// ── RetroVHS (main export) ─────────────────────────────────────────────────

export const RetroVHS: React.FC<RetroVHSProps> = ({
  pages,
  fontFamily = FONT_FAMILIES.spaceMono,
  fontSize = 64,
  fontWeight = 700,
  position = "center",
  activeColor = "#FFFFFF",
  pastColor = "#B8B2A0",
  upcomingColor = "#6B6560",
  chromaticOffset = 3,
  showScanlines = true,
  trackingAmplitude = 1.5,
  letterSpacing = 0.04,
  allCaps = true,
  maxWordsPerLine = 3,
  lineGap = 14,
  wordGap = 18,
}) => {
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill>
      {pages.map((page, pageIndex) => {
        const pageStartFrame = msToFrames(page.startMs, fps);
        const pageDurationFrames = msToFrames(page.durationMs, fps);

        return (
          <Sequence
            key={pageIndex}
            from={pageStartFrame}
            durationInFrames={Math.max(pageDurationFrames, 1)}
            premountFor={5}
          >
            <AbsoluteFill
              style={{
                ...getCaptionPositionStyle(position),
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <RetroVHSPage
                page={page}
                pageIndex={pageIndex}
                pageStartFrame={pageStartFrame}
                activeColor={activeColor}
                pastColor={pastColor}
                upcomingColor={upcomingColor}
                chromaticOffset={chromaticOffset}
                showScanlines={showScanlines}
                trackingAmplitude={trackingAmplitude}
                fontFamily={fontFamily}
                fontSize={fontSize}
                fontWeight={fontWeight}
                letterSpacing={letterSpacing}
                allCaps={allCaps}
                maxWordsPerLine={maxWordsPerLine}
                lineGap={lineGap}
                wordGap={wordGap}
              />
            </AbsoluteFill>
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
