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
import type { SplitColorKaraokeProps } from "./types";
import { FONT_FAMILIES } from "../../utils/fonts";
import { msToFrames } from "../../utils/timing";
import { getCaptionPositionStyle } from "../../utils/captionPosition";

// ── Helpers ────────────────────────────────────────────────────────────────

function clamp(v: number, lo: number, hi: number): number {
  return Math.min(Math.max(v, lo), hi);
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

// ── SplitColorKaraokeWord ──────────────────────────────────────────────────
//
// Hero effect: liquid fill from bottom to top via a hard two-stop gradient
// clipped to text glyphs with background-clip:text. As the word is spoken,
// fillPercent climbs 0 → 100, pushing the fill line up through each letter.
//
// • UPCOMING words:  not yet visible (spring opacity = 0 before fromMs)
// • ACTIVE word:     springs in from below + karaoke fill progressing
// • PAST words:      fully filled with solid pastWordColor + slight scale down

const SplitColorKaraokeWord: React.FC<{
  token: TikTokToken;
  pageStartFrame: number;
  currentTimeMs: number;
  fontFamily: string;
  fontSize: number;
  fontWeight: number | string;
  accentColor: string;
  baseColor: string;
  pastWordColor: string;
  letterSpacing: number;
  allCaps: boolean;
}> = ({
  token,
  pageStartFrame,
  currentTimeMs,
  fontFamily,
  fontSize,
  fontWeight,
  accentColor,
  baseColor,
  pastWordColor,
  letterSpacing,
  allCaps,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const isActive = currentTimeMs >= token.fromMs && currentTimeMs < token.toMs;
  const isPast = currentTimeMs >= token.toMs;

  // Frame offset of this word within its page Sequence
  const wordOnsetFrame = msToFrames(token.fromMs, fps) - pageStartFrame;

  // ── Entry spring ───────────────────────────────────────────────────────
  // Fast, slightly bouncy: word pops up from just below its final position
  const entrySpring = spring({
    fps,
    frame: frame - wordOnsetFrame,
    config: {
      mass: 0.45,
      damping: 13,
      stiffness: 230,
      overshootClamping: false,
    },
  });

  const translateY = interpolate(entrySpring, [0, 1], [26, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const opacity = interpolate(entrySpring, [0, 0.28], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── Karaoke fill percent ───────────────────────────────────────────────
  // Progress 0→1 within the word's spoken duration
  const rawProgress =
    token.toMs > token.fromMs
      ? (currentTimeMs - token.fromMs) / (token.toMs - token.fromMs)
      : 1;

  const fillPercent = isPast
    ? 100
    : isActive
      ? clamp(rawProgress * 100, 0, 100)
      : 0;

  // ── Background gradient (clipped to text) ─────────────────────────────
  // Hard two-stop: accent fills from bottom, base fills from above the line
  const background =
    isPast
      ? pastWordColor
      : isActive
        ? `linear-gradient(to top, ${accentColor} 0%, ${accentColor} ${fillPercent}%, ${baseColor} ${fillPercent}%, ${baseColor} 100%)`
        : baseColor;

  // ── Active scale lift ──────────────────────────────────────────────────
  // Word "rises" slightly when active, settles back when done.
  // Using simple constants — the fill animation IS the focus, not the scale.
  const scale = isPast ? 1.0 : isActive ? 1.045 : 1.0;

  // ── Drop shadow (filter, not textShadow — textShadow breaks clip:text) ─
  const dropShadow = isActive
    ? `drop-shadow(0 0 14px ${accentColor}AA) drop-shadow(0 2px 6px rgba(0,0,0,0.7))`
    : `drop-shadow(0 2px 5px rgba(0,0,0,0.65))`;

  const displayText = allCaps ? token.text.toUpperCase() : token.text;

  return (
    <span
      style={{
        display: "inline-block",
        opacity,
        transform: `translateY(${translateY}px) scale(${scale})`,
        transformOrigin: "center bottom",
        filter: dropShadow,
        willChange: "transform, opacity, filter",
      }}
    >
      {/* Inner span owns the gradient + clip — must be inline-block for correct bg sizing */}
      <span
        style={{
          display: "inline-block",
          fontFamily,
          fontSize,
          fontWeight,
          letterSpacing: `${letterSpacing}em`,
          lineHeight: 1.2,
          whiteSpace: "nowrap",
          background,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          color: "transparent",
        }}
      >
        {displayText}
      </span>
    </span>
  );
};

// ── SplitColorKaraokePage ──────────────────────────────────────────────────

const SplitColorKaraokePage: React.FC<{
  page: TikTokPage;
  pageStartFrame: number;
  fontFamily: string;
  fontSize: number;
  fontWeight: number | string;
  accentColor: string;
  baseColor: string;
  pastWordColor: string;
  letterSpacing: number;
  allCaps: boolean;
  maxWordsPerLine: number;
  lineGap: number;
  wordGap: number;
}> = ({
  page,
  pageStartFrame,
  fontFamily,
  fontSize,
  fontWeight,
  accentColor,
  baseColor,
  pastWordColor,
  letterSpacing,
  allCaps,
  maxWordsPerLine,
  lineGap,
  wordGap,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Absolute playhead time — used to compute karaoke state per word
  const currentTimeMs = page.startMs + (frame / fps) * 1000;

  const lines = useMemo(
    () => splitIntoLines(page.tokens, maxWordsPerLine),
    [page.tokens, maxWordsPerLine],
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: lineGap,
      }}
    >
      {lines.map((lineTokens, li) => (
        <div
          key={li}
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "flex-end",
            justifyContent: "center",
            flexWrap: "nowrap",
            gap: wordGap,
          }}
        >
          {lineTokens.map((token, ti) => (
            <SplitColorKaraokeWord
              key={`${li}-${ti}`}
              token={token}
              pageStartFrame={pageStartFrame}
              currentTimeMs={currentTimeMs}
              fontFamily={fontFamily}
              fontSize={fontSize}
              fontWeight={fontWeight}
              accentColor={accentColor}
              baseColor={baseColor}
              pastWordColor={pastWordColor}
              letterSpacing={letterSpacing}
              allCaps={allCaps}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

// ── SplitColorKaraoke (main export) ───────────────────────────────────────

export const SplitColorKaraoke: React.FC<SplitColorKaraokeProps> = ({
  pages,
  fontFamily = FONT_FAMILIES.montserrat,
  fontSize = 76,
  fontWeight = 900,
  primaryColor = "#FFFFFF",
  position = "center",
  accentColor = "#FF3CAC",
  baseColor = "rgba(255,255,255,0.32)",
  pastWordColor,
  letterSpacing = 0.02,
  allCaps = true,
  maxWordsPerLine = 3,
  lineGap = 14,
  wordGap = 22,
}) => {
  const { fps } = useVideoConfig();

  // pastWordColor defaults to accentColor when not supplied
  const resolvedPastColor = pastWordColor ?? accentColor;

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
            premountFor={10}
          >
            <AbsoluteFill
              style={{
                ...getCaptionPositionStyle(position),
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <SplitColorKaraokePage
                page={page}
                pageStartFrame={pageStartFrame}
                fontFamily={fontFamily}
                fontSize={fontSize}
                fontWeight={fontWeight}
                accentColor={accentColor}
                baseColor={baseColor}
                pastWordColor={resolvedPastColor}
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
