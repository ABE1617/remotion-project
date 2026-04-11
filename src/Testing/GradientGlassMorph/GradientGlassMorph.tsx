import React from "react";
import {
  AbsoluteFill,
  Sequence,
  spring,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { TikTokToken, TikTokPage } from "../../types/captions";
import type { GradientGlassMorphProps, GradientConfig, GlassConfig } from "./types";
import { FONT_FAMILIES } from "../../utils/fonts";
import { msToFrames } from "../../utils/timing";
import { getCaptionPositionStyle } from "../../utils/captionPosition";
import { clamp } from "../../utils/math";

// ── Defaults ────────────────────────────────────────────────────────────────

const DEFAULT_GRADIENT: Required<GradientConfig> = {
  colors: ["#1E90FF", "#00BFFF", "#4169E1"],
  angle: 90,
};

const DEFAULT_GLASS: Required<GlassConfig> = {
  blurAmount: 20,
  tintColor: "rgba(255,255,255,0.1)",
  borderColor: "rgba(255,255,255,0.2)",
  borderRadius: 24,
};

// ── Helpers ─────────────────────────────────────────────────────────────────

/** Build a CSS linear-gradient string from config */
function buildGradientCSS(config: Required<GradientConfig>): string {
  return `linear-gradient(${config.angle}deg, ${config.colors.join(", ")})`;
}

// ── GlassMorphWord ──────────────────────────────────────────────────────────

const GlassMorphWord: React.FC<{
  token: TikTokToken;
  currentTimeMs: number;
  gradientCSS: string;
  pastWordColor: string;
  upcomingOpacity: number;
  fontSize: number;
  fontFamily: string;
  fontWeight: number | string;
  letterSpacing: string;
  allCaps: boolean;
  pageStartMs: number;
}> = ({
  token,
  currentTimeMs,
  gradientCSS,
  pastWordColor,
  upcomingOpacity,
  fontSize,
  fontFamily,
  fontWeight,
  letterSpacing,
  allCaps,
  pageStartMs,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── Word state ──
  const isPast = currentTimeMs >= token.toMs;
  const isActive = currentTimeMs >= token.fromMs && currentTimeMs < token.toMs;
  // isUpcoming = !isPast && !isActive

  // ── Entrance spring (triggers when word's fromMs arrives) ──
  const tokenEntryFrame = msToFrames(token.fromMs - pageStartMs, fps);
  const entranceProgress = spring({
    fps,
    frame: frame - tokenEntryFrame,
    config: {
      mass: 0.5,
      damping: 14,
      stiffness: 200,
      overshootClamping: false,
    },
  });

  const translateY = interpolate(entranceProgress, [0, 1], [8, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── Determine target opacity for the word state ──
  let targetOpacity: number;
  if (isPast) {
    targetOpacity = 1;
  } else if (isActive) {
    targetOpacity = 1;
  } else {
    targetOpacity = upcomingOpacity;
  }

  // Multiply entrance spring into opacity
  const opacity = entranceProgress * targetOpacity;

  // ── Gradient sweep for active word ──
  const tokenDuration = token.toMs - token.fromMs;
  const tokenProgress =
    tokenDuration > 0
      ? clamp((currentTimeMs - token.fromMs) / tokenDuration, 0, 1)
      : 1;
  const sweepPosition = interpolate(tokenProgress, [0, 1], [100, 0]);

  // ── Build style ──
  const baseStyle: React.CSSProperties = {
    display: "inline-block",
    fontFamily,
    fontSize,
    fontWeight,
    letterSpacing,
    textTransform: allCaps ? "uppercase" : "none",
    lineHeight: 1.2,
    verticalAlign: "baseline",
    whiteSpace: "nowrap",
    transform: `translateY(${translateY}px)`,
    opacity,
  };

  if (isActive) {
    // Gradient text via background-clip technique
    return (
      <span
        style={{
          ...baseStyle,
          background: gradientCSS,
          backgroundSize: "300% 100%",
          backgroundPosition: `${sweepPosition}% 0%`,
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          WebkitTextFillColor: "transparent",
          color: "transparent",
        }}
      >
        {token.text}
      </span>
    );
  }

  // Past or upcoming word — solid color
  return (
    <span
      style={{
        ...baseStyle,
        color: pastWordColor,
      }}
    >
      {token.text}
    </span>
  );
};

// ── GlassMorphPage ──────────────────────────────────────────────────────────

const GlassMorphPage: React.FC<{
  page: TikTokPage;
  gradientCSS: string;
  glass: Required<GlassConfig>;
  pastWordColor: string;
  upcomingOpacity: number;
  fontSize: number;
  fontFamily: string;
  fontWeight: number | string;
  letterSpacing: string;
  allCaps: boolean;
  maxWordsPerLine: number;
  pillPaddingX: number;
  pillPaddingY: number;
  animatePageTransition: boolean;
}> = ({
  page,
  gradientCSS,
  glass,
  pastWordColor,
  upcomingOpacity,
  fontSize,
  fontFamily,
  fontWeight,
  letterSpacing,
  allCaps,
  maxWordsPerLine,
  pillPaddingX,
  pillPaddingY,
  animatePageTransition,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pageDurationFrames = msToFrames(page.durationMs, fps);

  // ── Current time in ms (relative to absolute timeline) ──
  // frame is relative to the Sequence start (page.startMs),
  // so absolute time = page.startMs + frame-in-seconds * 1000
  const currentTimeMs = page.startMs + (frame / fps) * 1000;

  // ── Page entrance / exit transitions ──
  let pillScale = 1;
  let pillOpacity = 1;

  if (animatePageTransition) {
    // Entrance: first ~150ms = ~4.5 frames at 30fps
    const entranceFrames = Math.round((150 / 1000) * fps);
    // Exit: last ~120ms = ~3.6 frames at 30fps
    const exitFrames = Math.round((120 / 1000) * fps);

    // Entrance
    if (frame < entranceFrames) {
      const entranceProgress = interpolate(frame, [0, entranceFrames], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
      pillScale = interpolate(entranceProgress, [0, 1], [0.92, 1]);
      pillOpacity = interpolate(entranceProgress, [0, 1], [0, 1]);
    }

    // Exit
    const exitStart = pageDurationFrames - exitFrames;
    if (frame >= exitStart) {
      const exitProgress = interpolate(
        frame,
        [exitStart, pageDurationFrames],
        [0, 1],
        {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        },
      );
      pillScale = interpolate(exitProgress, [0, 1], [1, 0.95]);
      pillOpacity = interpolate(exitProgress, [0, 1], [1, 0]);
    }
  }

  // ── Split tokens into lines ──
  const lines: TikTokToken[][] = [];
  for (let i = 0; i < page.tokens.length; i += maxWordsPerLine) {
    lines.push(page.tokens.slice(i, i + maxWordsPerLine));
  }

  return (
    <div
      style={{
        display: "inline-flex",
        flexDirection: "column",
        alignItems: "center",
        transform: `scale(${pillScale})`,
        opacity: pillOpacity,
      }}
    >
      {/* Glass pill */}
      <div
        style={{
          backdropFilter: `blur(${glass.blurAmount}px)`,
          WebkitBackdropFilter: `blur(${glass.blurAmount}px)`,
          background: glass.tintColor,
          border: `1px solid ${glass.borderColor}`,
          borderRadius: glass.borderRadius,
          padding: `${pillPaddingY}px ${pillPaddingX}px`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 6,
        }}
      >
        {lines.map((lineTokens, lineIdx) => (
          <div
            key={lineIdx}
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              alignItems: "baseline",
              gap: "0 14px",
            }}
          >
            {lineTokens.map((token, tokenIdx) => (
              <GlassMorphWord
                key={`${lineIdx}-${tokenIdx}`}
                token={token}
                currentTimeMs={currentTimeMs}
                gradientCSS={gradientCSS}
                pastWordColor={pastWordColor}
                upcomingOpacity={upcomingOpacity}
                fontSize={fontSize}
                fontFamily={fontFamily}
                fontWeight={fontWeight}
                letterSpacing={letterSpacing}
                allCaps={allCaps}
                pageStartMs={page.startMs}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

// ── GradientGlassMorph (main export) ────────────────────────────────────────

export const GradientGlassMorph: React.FC<GradientGlassMorphProps> = ({
  pages,
  fontFamily = FONT_FAMILIES.inter,
  fontSize = 64,
  fontWeight = 600,
  position = "bottom",
  gradient,
  glass,
  pastWordColor = "#FFFFFF",
  upcomingOpacity = 0.4,
  maxWordsPerLine = 4,
  letterSpacing = "0.02em",
  pillPaddingX = 40,
  pillPaddingY = 20,
  allCaps = false,
  animatePageTransition = true,
}) => {
  const { fps } = useVideoConfig();

  // Merge gradient config with defaults
  const mergedGradient: Required<GradientConfig> = {
    ...DEFAULT_GRADIENT,
    ...gradient,
    colors: gradient?.colors ?? DEFAULT_GRADIENT.colors,
  };

  // Merge glass config with defaults
  const mergedGlass: Required<GlassConfig> = {
    ...DEFAULT_GLASS,
    ...glass,
  };

  const gradientCSS = buildGradientCSS(mergedGradient);
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
              <GlassMorphPage
                page={page}
                gradientCSS={gradientCSS}
                glass={mergedGlass}
                pastWordColor={pastWordColor}
                upcomingOpacity={upcomingOpacity}
                fontSize={fontSize}
                fontFamily={fontFamily}
                fontWeight={fontWeight ?? 600}
                letterSpacing={letterSpacing}
                allCaps={allCaps}
                maxWordsPerLine={maxWordsPerLine}
                pillPaddingX={pillPaddingX}
                pillPaddingY={pillPaddingY}
                animatePageTransition={animatePageTransition}
              />
            </AbsoluteFill>
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
