import React, { useMemo } from "react";
import {
  AbsoluteFill,
  Sequence,
  spring,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { SpringConfig } from "remotion";
import { noise2D } from "@remotion/noise";
import type { TikTokToken, TikTokPage } from "../../types/captions";
import type { BeatBounceProps, WaveformConfig } from "./types";
import { FONT_FAMILIES } from "../../utils/fonts";
import { msToFrames } from "../../utils/timing";
import { getCaptionPositionStyle } from "../../utils/captionPosition";
import { hexToRgba } from "../../utils/colors";
import { clamp } from "../../utils/math";

// ── Default constants ─────────────────────────────────────────────────────

const DEFAULT_BOUNCE_SPRING: SpringConfig = {
  damping: 12,
  mass: 0.4,
  stiffness: 260,
  overshootClamping: false,
};

const DEFAULT_WAVEFORM: Required<WaveformConfig> = {
  barCount: 24,
  maxBarHeight: 80,
  minBarHeight: 6,
  barWidth: 8,
  barGap: 4,
  barBorderRadius: 4,
  opacity: 0.6,
};

// ── Amplitude Engine ──────────────────────────────────────────────────────
// Builds a per-frame amplitude timeline (0-1) from token onset times.
// Each word onset spikes to 1.0, then exponentially decays between words.
// This simulates audio amplitude without requiring real audio data.

function buildAmplitudeTimeline(
  totalFrames: number,
  fps: number,
  allTokens: TikTokToken[],
  decayRate = 0.85,
): number[] {
  const timeline = new Array<number>(totalFrames).fill(0);

  // Mark spike frames at each word onset
  const spikeFrames = new Set<number>();
  for (const token of allTokens) {
    const f = msToFrames(token.fromMs, fps);
    if (f >= 0 && f < totalFrames) {
      spikeFrames.add(f);
    }
  }

  // Forward pass: spike → 1.0, else → previous * decayRate
  for (let i = 0; i < totalFrames; i++) {
    if (spikeFrames.has(i)) {
      timeline[i] = 1.0;
    } else if (i > 0) {
      timeline[i] = timeline[i - 1] * decayRate;
    }
    timeline[i] = clamp(timeline[i], 0, 1);
  }

  return timeline;
}

// ── Stroke Shadow Builder ─────────────────────────────────────────────────
// 8-direction text-shadow stroke (same pattern as HormoziPopIn).
// Stroke width is dynamic — driven by current amplitude each frame.

function buildStrokeShadow(strokeWidth: number, color: string): string {
  const s = Math.ceil(strokeWidth / 2);
  const shadows: string[] = [
    `${-s}px ${-s}px 0 ${color}`,
    `${s}px ${-s}px 0 ${color}`,
    `${-s}px ${s}px 0 ${color}`,
    `${s}px ${s}px 0 ${color}`,
    `0 ${-s}px 0 ${color}`,
    `0 ${s}px 0 ${color}`,
    `${-s}px 0 0 ${color}`,
    `${s}px 0 0 ${color}`,
  ];
  // Soft depth shadow for readability
  shadows.push("0 4px 8px rgba(0,0,0,0.5)");
  return shadows.join(", ");
}

// ── WaveformBars ──────────────────────────────────────────────────────────
// Renders an equalizer-style row of vertical bars behind the text.
// Bar heights pulse with amplitude; per-bar noise keeps them organic.
// Bars near center react first, edges are delayed 1-2 frames.

const WaveformBars: React.FC<{
  amplitude: number;
  frame: number;
  config: Required<WaveformConfig>;
  accentColor: string;
}> = ({ amplitude, frame, config, accentColor }) => {
  const {
    barCount,
    maxBarHeight,
    minBarHeight,
    barWidth,
    barGap,
    barBorderRadius,
    opacity,
  } = config;

  const bars = useMemo(() => {
    const result: { index: number; centerDistance: number }[] = [];
    for (let i = 0; i < barCount; i++) {
      result.push({
        index: i,
        centerDistance: Math.abs(i - (barCount - 1) / 2),
      });
    }
    return result;
  }, [barCount]);

  const maxCenterDist = (barCount - 1) / 2;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: barGap,
        opacity,
      }}
    >
      {bars.map(({ index, centerDistance }) => {
        // Per-bar delay: center reacts first, edges delayed
        const delayFrames = (centerDistance / Math.max(maxCenterDist, 1)) * 2;
        const delayedFrame = Math.max(0, frame - delayFrames);

        // Noise for organic variation: maps [-1,1] → [0.7, 1.0]
        const noiseVal = noise2D("waveform", index * 0.3, delayedFrame * 0.05);
        const noiseFactor = 0.7 + (noiseVal + 1) * 0.15;

        const height =
          minBarHeight +
          (maxBarHeight - minBarHeight) * amplitude * noiseFactor;

        return (
          <div
            key={index}
            style={{
              width: barWidth,
              height: Math.max(minBarHeight, height),
              borderRadius: barBorderRadius,
              background: `linear-gradient(to top, ${hexToRgba(accentColor, 0.3)}, ${accentColor})`,
              willChange: "height",
            }}
          />
        );
      })}
    </div>
  );
};

// ── BeatBounceWord ────────────────────────────────────────────────────────
// Single word with spring bounce entrance and amplitude-driven effects.
// Active word gets accent color + optional scale pulse.
// Stroke width responds to current amplitude (louder = thicker).

const BeatBounceWord: React.FC<{
  token: TikTokToken;
  wordIndex: number;
  pageStartFrame: number;
  amplitude: number;
  currentTimeMs: number;
  fontFamily: string;
  fontSize: number;
  fontWeight: number | string;
  primaryColor: string;
  accentColor: string;
  strokeColor: string;
  bounceDistance: number;
  bounceSpring: SpringConfig;
  enableScalePulse: boolean;
  pulseScale: number;
  letterSpacing: number;
  allCaps: boolean;
  minStrokeWidth: number;
  maxStrokeWidth: number;
}> = ({
  token,
  wordIndex,
  pageStartFrame,
  amplitude,
  currentTimeMs,
  fontFamily,
  fontSize,
  fontWeight,
  primaryColor,
  accentColor,
  strokeColor,
  bounceDistance,
  bounceSpring,
  enableScalePulse,
  pulseScale,
  letterSpacing,
  allCaps,
  minStrokeWidth,
  maxStrokeWidth,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Word timing relative to page Sequence
  const wordOnsetFrame = msToFrames(token.fromMs, fps) - pageStartFrame;
  const isActive =
    currentTimeMs >= token.fromMs && currentTimeMs <= token.toMs;
  const isPast = currentTimeMs > token.toMs;

  // Spring bounce entrance: fires at word onset
  const bounceProgress = spring({
    fps,
    frame: frame - wordOnsetFrame,
    config: bounceSpring,
  });

  // translateY: drops from bounceDistance to 0
  const translateY = interpolate(bounceProgress, [0, 1], [bounceDistance, 0]);

  // Opacity: fade in with bounce
  const opacity = interpolate(bounceProgress, [0, 0.3], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Active scale pulse driven by amplitude
  let scale = 1;
  if (isActive && enableScalePulse) {
    scale = 1 + (pulseScale - 1) * amplitude;
  }

  // Dynamic stroke width based on amplitude
  const strokeWidth =
    minStrokeWidth + (maxStrokeWidth - minStrokeWidth) * amplitude;
  const textShadow = buildStrokeShadow(strokeWidth, strokeColor);

  // Color: active = accent, past/future = primary
  const color = isActive ? accentColor : isPast ? primaryColor : primaryColor;

  const displayText = allCaps ? token.text.toUpperCase() : token.text;

  return (
    <span
      style={{
        display: "inline-block",
        fontFamily,
        fontSize,
        fontWeight,
        color,
        textShadow,
        letterSpacing: `${letterSpacing}em`,
        lineHeight: 1.2,
        transform: `translateY(${translateY}px) scale(${scale})`,
        transformOrigin: "center bottom",
        opacity,
        willChange: "transform, opacity",
        marginRight: "0.25em",
        whiteSpace: "nowrap",
      }}
      key={wordIndex}
    >
      {displayText}
    </span>
  );
};

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

// ── BeatBouncePage ────────────────────────────────────────────────────────
// Renders one page: waveform bars (behind, z-index 0) + word rows (z-index 1).
// Page exit fades out over the last fadeOutDurationMs.

const BeatBouncePage: React.FC<{
  page: TikTokPage;
  pageIndex: number;
  amplitudeTimeline: number[];
  pageStartFrame: number;
  fontFamily: string;
  fontSize: number;
  fontWeight: number | string;
  primaryColor: string;
  accentColor: string;
  strokeColor: string;
  bounceDistance: number;
  bounceSpring: SpringConfig;
  enableScalePulse: boolean;
  pulseScale: number;
  maxWordsPerLine: number;
  letterSpacing: number;
  allCaps: boolean;
  minStrokeWidth: number;
  maxStrokeWidth: number;
  showWaveform: boolean;
  waveformConfig: Required<WaveformConfig>;
  fadeOutDurationMs: number;
}> = ({
  page,
  pageIndex,
  amplitudeTimeline,
  pageStartFrame,
  fontFamily,
  fontSize,
  fontWeight,
  primaryColor,
  accentColor,
  strokeColor,
  bounceDistance,
  bounceSpring,
  enableScalePulse,
  pulseScale,
  maxWordsPerLine,
  letterSpacing,
  allCaps,
  minStrokeWidth,
  maxStrokeWidth,
  showWaveform,
  waveformConfig,
  fadeOutDurationMs,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Absolute frame for amplitude lookup
  const absoluteFrame = pageStartFrame + frame;
  const amplitude =
    absoluteFrame < amplitudeTimeline.length
      ? amplitudeTimeline[absoluteFrame]
      : 0;

  // Current time in ms for this page
  const currentTimeMs = page.startMs + (frame / fps) * 1000;

  // Page fade-out in last fadeOutDurationMs
  const pageEndMs = page.startMs + page.durationMs;
  const fadeOutStartMs = pageEndMs - fadeOutDurationMs;
  const fadeOutOpacity = interpolate(
    currentTimeMs,
    [fadeOutStartMs, pageEndMs],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // Split tokens into lines
  const lines = useMemo(
    () => splitIntoLines(page.tokens, maxWordsPerLine),
    [page.tokens, maxWordsPerLine],
  );

  // Running word index offset for consistent indexing
  const baseWordIndex = pageIndex * 100; // simple offset per page

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        opacity: fadeOutOpacity,
      }}
    >
      {/* Waveform bars — behind text */}
      {showWaveform && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 0,
            pointerEvents: "none",
          }}
        >
          <WaveformBars
            amplitude={amplitude}
            frame={absoluteFrame}
            config={waveformConfig}
            accentColor={accentColor}
          />
        </div>
      )}

      {/* Word rows — above waveform */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 4,
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
                baseWordIndex +
                lineIndex * maxWordsPerLine +
                tokenIndex;

              return (
                <BeatBounceWord
                  key={wordIndex}
                  token={token}
                  wordIndex={wordIndex}
                  pageStartFrame={pageStartFrame}
                  amplitude={amplitude}
                  currentTimeMs={currentTimeMs}
                  fontFamily={fontFamily}
                  fontSize={fontSize}
                  fontWeight={fontWeight}
                  primaryColor={primaryColor}
                  accentColor={accentColor}
                  strokeColor={strokeColor}
                  bounceDistance={bounceDistance}
                  bounceSpring={bounceSpring}
                  enableScalePulse={enableScalePulse}
                  pulseScale={pulseScale}
                  letterSpacing={letterSpacing}
                  allCaps={allCaps}
                  minStrokeWidth={minStrokeWidth}
                  maxStrokeWidth={maxStrokeWidth}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

// ── BeatBounce (main export) ──────────────────────────────────────────────
// Orchestrates pages into Sequences. Builds (or accepts) amplitude timeline.
// Defaults: Poppins 800, center position, cyan accent.

export const BeatBounce: React.FC<BeatBounceProps> = ({
  pages,
  fontFamily = FONT_FAMILIES.poppins,
  fontSize = 72,
  fontWeight = 800,
  primaryColor = "#FFFFFF",
  position = "center",
  strokeColor = "#000000",
  accentColor = "#00D4FF",
  amplitudeData,
  waveform,
  bounceDistance = 12,
  bounceSpring = DEFAULT_BOUNCE_SPRING,
  enableScalePulse = true,
  pulseScale = 1.08,
  maxWordsPerLine = 4,
  letterSpacing = 0.03,
  allCaps = false,
  minStrokeWidth = 2,
  maxStrokeWidth = 5,
  showWaveform = true,
  fadeOutDurationMs = 120,
}) => {
  const { fps, durationInFrames } = useVideoConfig();

  // Resolve waveform config with defaults
  const waveformConfig: Required<WaveformConfig> = useMemo(
    () => ({ ...DEFAULT_WAVEFORM, ...waveform }),
    [waveform],
  );

  // Flatten all tokens for amplitude computation
  const allTokens: TikTokToken[] = useMemo(() => {
    const tokens: TikTokToken[] = [];
    for (const page of pages) {
      for (const token of page.tokens) {
        tokens.push(token);
      }
    }
    return tokens;
  }, [pages]);

  // Build amplitude timeline (or use provided data)
  const amplitudeTimeline: number[] = useMemo(() => {
    if (amplitudeData && amplitudeData.length >= durationInFrames) {
      return amplitudeData;
    }
    return buildAmplitudeTimeline(durationInFrames, fps, allTokens);
  }, [amplitudeData, durationInFrames, fps, allTokens]);

  // Position styling
  const positionStyle = getCaptionPositionStyle(position);

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
          >
            <AbsoluteFill
              style={{
                ...positionStyle,
                alignItems: "center",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <BeatBouncePage
                page={page}
                pageIndex={pageIndex}
                amplitudeTimeline={amplitudeTimeline}
                pageStartFrame={pageStartFrame}
                fontFamily={fontFamily}
                fontSize={fontSize}
                fontWeight={fontWeight}
                primaryColor={primaryColor}
                accentColor={accentColor}
                strokeColor={strokeColor}
                bounceDistance={bounceDistance}
                bounceSpring={bounceSpring}
                enableScalePulse={enableScalePulse}
                pulseScale={pulseScale}
                maxWordsPerLine={maxWordsPerLine}
                letterSpacing={letterSpacing}
                allCaps={allCaps}
                minStrokeWidth={minStrokeWidth}
                maxStrokeWidth={maxStrokeWidth}
                showWaveform={showWaveform}
                waveformConfig={waveformConfig}
                fadeOutDurationMs={fadeOutDurationMs}
              />
            </AbsoluteFill>
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
