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
import type { LiquidMorphProps } from "./types";
import { FONT_FAMILIES } from "../../utils/fonts";
import { msToFrames } from "../../utils/timing";
import { getCaptionPositionStyle } from "../../utils/captionPosition";
import { lerp } from "../../utils/math";

// ── Line splitter ─────────────────────────────────────────────────────────
// Splits tokens into rows of maxWordsPerLine for multi-word pages.

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

// ── LiquidMorphWord ───────────────────────────────────────────────────────
// Single karaoke word: determines state (active / past / upcoming) from
// currentTimeMs vs token timing. Active word gets accent color + slight
// scale bump via spring. Word-by-word reveal with spring-driven opacity.

const LiquidMorphWord: React.FC<{
  token: TikTokToken;
  wordIndex: number;
  pageStartFrame: number;
  currentTimeMs: number;
  fontFamily: string;
  fontSize: number;
  fontWeight: number | string;
  activeWordColor: string;
  pastWordColor: string;
  upcomingWordColor: string;
  letterSpacing: number;
  allCaps: boolean;
  textShadow: string;
}> = ({
  token,
  wordIndex,
  pageStartFrame,
  currentTimeMs,
  fontFamily,
  fontSize,
  fontWeight,
  activeWordColor,
  pastWordColor,
  upcomingWordColor,
  letterSpacing,
  allCaps,
  textShadow,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const isActive =
    currentTimeMs >= token.fromMs && currentTimeMs <= token.toMs;
  const isPast = currentTimeMs > token.toMs;

  // Word onset frame relative to the Sequence start
  const wordOnsetFrame = msToFrames(token.fromMs, fps) - pageStartFrame;

  // Spring-driven word reveal: fires when word's fromMs arrives
  const revealProgress = spring({
    fps,
    frame: frame - wordOnsetFrame,
    config: {
      damping: 14,
      mass: 0.5,
      stiffness: 200,
      overshootClamping: false,
    },
  });

  // Opacity: word appears at its onset
  const opacity = interpolate(revealProgress, [0, 0.3], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Active word: slight scale bump
  const activeScale = isActive
    ? spring({
        fps,
        frame: frame - wordOnsetFrame,
        config: {
          damping: 12,
          mass: 0.3,
          stiffness: 280,
          overshootClamping: false,
        },
      })
    : 1;
  const scale = isActive ? interpolate(activeScale, [0, 1], [1.0, 1.1]) : 1;

  // Color based on state
  const color = isActive
    ? activeWordColor
    : isPast
      ? pastWordColor
      : upcomingWordColor;

  const displayText = allCaps ? token.text.toUpperCase() : token.text;

  return (
    <span
      key={wordIndex}
      style={{
        display: "inline-block",
        fontFamily,
        fontSize,
        fontWeight,
        color,
        textShadow,
        letterSpacing: `${letterSpacing}em`,
        lineHeight: 1.2,
        transform: `scale(${scale})`,
        transformOrigin: "center center",
        opacity,
        willChange: "transform, opacity, color",
        marginRight: "0.25em",
        whiteSpace: "nowrap",
      }}
    >
      {displayText}
    </span>
  );
};

// ── LiquidMorphPage ───────────────────────────────────────────────────────
// Renders one page with SVG liquid distortion for enter/exit transitions.
// The SVG filter uses feTurbulence + feDisplacementMap for liquid effect.
// Filter is only applied when displacement > 0.5 for performance.

const LiquidMorphPage: React.FC<{
  page: TikTokPage;
  pageIndex: number;
  hasTransitionIn: boolean;
  hasTransitionOut: boolean;
  transitionDurationMs: number;
  distortionIntensity: number;
  turbulenceFrequency: number;
  turbulenceOctaves: number;
  transitionBlur: number;
  seqStartMs: number;
  seqDurationMs: number;
  fontFamily: string;
  fontSize: number;
  fontWeight: number | string;
  activeWordColor: string;
  pastWordColor: string;
  upcomingWordColor: string;
  letterSpacing: number;
  allCaps: boolean;
  textShadow: string;
  maxWordsPerLine: number;
}> = ({
  page,
  pageIndex,
  hasTransitionIn,
  hasTransitionOut,
  transitionDurationMs,
  distortionIntensity,
  turbulenceFrequency,
  turbulenceOctaves,
  transitionBlur,
  seqStartMs,
  seqDurationMs,
  fontFamily,
  fontSize,
  fontWeight,
  activeWordColor,
  pastWordColor,
  upcomingWordColor,
  letterSpacing,
  allCaps,
  textShadow,
  maxWordsPerLine,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Page-local time in ms (time since this Sequence started)
  const pageLocalMs = (frame / fps) * 1000;

  // ── Enter transition ──────────────────────────────────────────────────
  let enterDistortion = 0;
  let enterOpacity = 1;
  let enterProgress = 0;

  if (hasTransitionIn && transitionDurationMs > 0) {
    enterProgress = interpolate(
      pageLocalMs,
      [0, transitionDurationMs],
      [0, 1],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
    );
    // Distortion settles from full to zero as page enters
    enterDistortion = interpolate(enterProgress, [0, 1], [distortionIntensity, 0]);
    // Fade in during enter
    enterOpacity = enterProgress;
  }

  // ── Exit transition ───────────────────────────────────────────────────
  let exitDistortion = 0;
  let exitOpacity = 1;
  let exitProgress = 0;

  if (hasTransitionOut && transitionDurationMs > 0) {
    const exitStartMs = seqDurationMs - transitionDurationMs;
    exitProgress = interpolate(
      pageLocalMs,
      [exitStartMs, seqDurationMs],
      [0, 1],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
    );
    // Distortion builds from zero to full as page exits
    exitDistortion = interpolate(exitProgress, [0, 1], [0, distortionIntensity]);
    // Fade out during exit
    exitOpacity = interpolate(exitProgress, [0, 1], [1, 0]);
  }

  // ── Combined distortion and opacity ───────────────────────────────────
  const displacementScale = Math.max(enterDistortion, exitDistortion);
  const opacity = Math.min(enterOpacity, exitOpacity);
  const normalizedDistortion =
    distortionIntensity > 0 ? displacementScale / distortionIntensity : 0;
  const blur = normalizedDistortion * transitionBlur;

  // Animate turbulence frequency: more chaotic at peak distortion
  const animatedFreq = lerp(
    turbulenceFrequency,
    turbulenceFrequency * 1.8,
    normalizedDistortion,
  );

  // ── Filter setup ──────────────────────────────────────────────────────
  const filterId = `liquid-${pageIndex}`;
  const applyFilter = displacementScale > 0.5;

  // ── Karaoke timing ────────────────────────────────────────────────────
  // The Sequence starts at seqStartMs (which may be earlier than the
  // page's actual startMs if there's a transition-in). We compute
  // currentTimeMs in global timeline terms for karaoke highlighting.
  const currentTimeMs = seqStartMs + pageLocalMs;

  // The Sequence starts at seqStartMs, so the page-start frame in
  // global terms is msToFrames(seqStartMs, fps).
  const seqStartFrame = msToFrames(seqStartMs, fps);

  // Split tokens into lines
  const lines = useMemo(
    () => splitIntoLines(page.tokens, maxWordsPerLine),
    [page.tokens, maxWordsPerLine],
  );

  const baseWordIndex = pageIndex * 100;

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
      }}
    >
      {/* SVG filter definition — always rendered so ID is available */}
      <svg
        style={{
          position: "absolute",
          width: 0,
          height: 0,
          overflow: "hidden",
        }}
      >
        <defs>
          <filter
            id={filterId}
            x="-20%"
            y="-20%"
            width="140%"
            height="140%"
          >
            <feTurbulence
              type="fractalNoise"
              baseFrequency={animatedFreq}
              numOctaves={turbulenceOctaves}
              seed={pageIndex + 1}
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale={displacementScale}
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      {/* Text container with liquid filter */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 4,
          filter: applyFilter
            ? `url(#${filterId}) blur(${blur}px)`
            : "none",
          opacity,
          willChange: "filter, opacity",
        }}
      >
        {lines.map((lineTokens, lineIndex) => (
          <div
            key={lineIndex}
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              flexWrap: "nowrap",
            }}
          >
            {lineTokens.map((token, tokenIndex) => {
              const wordIndex =
                baseWordIndex + lineIndex * maxWordsPerLine + tokenIndex;

              return (
                <LiquidMorphWord
                  key={wordIndex}
                  token={token}
                  wordIndex={wordIndex}
                  pageStartFrame={seqStartFrame}
                  currentTimeMs={currentTimeMs}
                  fontFamily={fontFamily}
                  fontSize={fontSize}
                  fontWeight={fontWeight}
                  activeWordColor={activeWordColor}
                  pastWordColor={pastWordColor}
                  upcomingWordColor={upcomingWordColor}
                  letterSpacing={letterSpacing}
                  allCaps={allCaps}
                  textShadow={textShadow}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

// ── LiquidMorph (main export) ─────────────────────────────────────────────
// Orchestrates pages into overlapping Sequences. Adjacent pages overlap by
// transitionDurationMs so their liquid enter/exit transitions blend together.

export const LiquidMorph: React.FC<LiquidMorphProps> = ({
  pages,
  fontFamily = FONT_FAMILIES.montserrat,
  fontSize = 72,
  fontWeight = 900,
  primaryColor: _primaryColor = "#FFFFFF",
  position = "center",
  transitionDurationMs = 300,
  distortionIntensity = 80,
  turbulenceFrequency = 0.015,
  turbulenceOctaves = 3,
  activeWordColor = "#FFD700",
  pastWordColor = "#FFFFFF",
  upcomingWordColor = "rgba(255,255,255,0.5)",
  allCaps = true,
  letterSpacing = 0.05,
  maxWordsPerLine = 4,
  textShadow = "0 3px 10px rgba(0,0,0,0.8)",
  transitionBlur = 3,
}) => {
  const { fps } = useVideoConfig();

  // Position styling
  const positionStyle = getCaptionPositionStyle(position);

  // Pre-compute extended Sequence timing for each page
  const pageTimings = useMemo(() => {
    return pages.map((page, i) => {
      const hasTransitionIn = i > 0;
      const hasTransitionOut = i < pages.length - 1;

      // Extend Sequence to overlap with neighbors
      const seqStartMs = hasTransitionIn
        ? page.startMs - transitionDurationMs
        : page.startMs;
      const seqEndMs = hasTransitionOut
        ? page.startMs + page.durationMs + transitionDurationMs
        : page.startMs + page.durationMs;

      const seqDurationMs = seqEndMs - seqStartMs;
      const startFrame = msToFrames(seqStartMs, fps);
      const durationFrames = msToFrames(seqDurationMs, fps);

      return {
        hasTransitionIn,
        hasTransitionOut,
        seqStartMs,
        seqDurationMs,
        startFrame,
        durationFrames,
      };
    });
  }, [pages, transitionDurationMs, fps]);

  return (
    <AbsoluteFill>
      {pages.map((page, pageIndex) => {
        const timing = pageTimings[pageIndex];

        return (
          <Sequence
            key={pageIndex}
            from={timing.startFrame}
            durationInFrames={Math.max(timing.durationFrames, 1)}
          >
            <AbsoluteFill
              style={{
                ...positionStyle,
                alignItems: "center",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <LiquidMorphPage
                page={page}
                pageIndex={pageIndex}
                hasTransitionIn={timing.hasTransitionIn}
                hasTransitionOut={timing.hasTransitionOut}
                transitionDurationMs={transitionDurationMs}
                distortionIntensity={distortionIntensity}
                turbulenceFrequency={turbulenceFrequency}
                turbulenceOctaves={turbulenceOctaves}
                transitionBlur={transitionBlur}
                seqStartMs={timing.seqStartMs}
                seqDurationMs={timing.seqDurationMs}
                fontFamily={fontFamily}
                fontSize={fontSize}
                fontWeight={fontWeight}
                activeWordColor={activeWordColor}
                pastWordColor={pastWordColor}
                upcomingWordColor={upcomingWordColor}
                letterSpacing={letterSpacing}
                allCaps={allCaps}
                textShadow={textShadow}
                maxWordsPerLine={maxWordsPerLine}
              />
            </AbsoluteFill>
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
