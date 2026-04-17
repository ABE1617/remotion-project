import React from "react";
import { AbsoluteFill, interpolate, spring, useVideoConfig } from "remotion";
import { SPRING_SNAPPY } from "../../../utils/animations";
import { FONT_FAMILIES } from "../../../utils/fonts";
import { resolveMGPosition } from "../shared/positioning";
import { useMGPhase } from "../shared/useMGPhase";
import type { ProgressBarProps } from "./types";

// ---------------------------------------------------------------------------
// ProgressBar — no-card goal-tracker floating on the video.
// ---------------------------------------------------------------------------
//
// Viral creator pattern: small eyebrow with the goal context → hero value
// counting up → thin accent hairline → track → milestone ticks + tiny
// tracked labels. Matches StatCard / LowerThird / etc. as one kit.
//
// Choreography (40f entrance, 12f exit):
//   0-6    eyebrow + "of total" fade in
//   0-8    track scaleX(0→1) from left
//   6-12   hero value fades (and starts at 0 so it can count up)
//   8-34   fill animates 0→target (ease-out cubic)
//          hero value counts in sync with the same curve
//   34-40  subtle landing pulse (scaleY 1 → 1.08 → 1) + small glow boost
//   exit   whole component drifts up 8px + fades

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

const FILL_START = 8;
const FILL_END = 34;
const PULSE_END = 40;

// Theme palettes — text, track, fill, and accent defaults. Individual color
// props on the component override these.
const THEMES = {
  dark: {
    fillColor: "#FFFFFF",
    trackColor: "rgba(255,255,255,0.14)",
    accentColor: "#D4A12A",
    heroText: "#FFFFFF",
    totalText: "rgba(255,255,255,0.55)",
    tickReached: "#FFFFFF",
    tickUnreached: "rgba(255,255,255,0.3)",
    labelText: "#FFFFFF",
    labelDim: "rgba(255,255,255,0.5)",
    shadowLarge:
      "0 4px 20px rgba(0,0,0,0.65), 0 2px 4px rgba(0,0,0,0.5)",
    shadowSmall:
      "0 2px 10px rgba(0,0,0,0.75), 0 1px 2px rgba(0,0,0,0.55)",
    trackInset: "inset 0 1px 2px rgba(0,0,0,0.35)",
  },
  light: {
    fillColor: "#16120E",
    trackColor: "rgba(22,18,14,0.12)",
    accentColor: "#C8551F",
    heroText: "#16120E",
    totalText: "rgba(22,18,14,0.4)",
    tickReached: "#16120E",
    tickUnreached: "rgba(22,18,14,0.3)",
    labelText: "#16120E",
    labelDim: "rgba(22,18,14,0.4)",
    // Light-theme shadows use a subtle white halo to separate dark text from
    // dark regions of the video without casting a hard dark drop.
    shadowLarge:
      "0 2px 12px rgba(255,255,255,0.55), 0 0 4px rgba(255,255,255,0.4)",
    shadowSmall:
      "0 1px 6px rgba(255,255,255,0.5), 0 0 2px rgba(255,255,255,0.35)",
    trackInset: "inset 0 1px 2px rgba(0,0,0,0.18)",
  },
} as const;

export const ProgressBar: React.FC<ProgressBarProps> = (props) => {
  const {
    startMs,
    durationMs,
    enterFrames,
    exitFrames,
    label,
    width = 860,
    trackHeight = 18,
    theme = "dark",
    fillColor,
    accentColor,
    trackColor,
    milestones = [],
    formatValue,
    anchor,
    offsetX,
    offsetY,
    scale,
  } = props;
  const palette = THEMES[theme];
  const resolvedFillColor = fillColor ?? palette.fillColor;
  const resolvedAccentColor = accentColor ?? palette.accentColor;
  const resolvedTrackColor = trackColor ?? palette.trackColor;
  const { containerStyle, wrapperStyle } = resolveMGPosition({
    anchor,
    offsetX,
    offsetY,
    scale,
  });
  const { fps } = useVideoConfig();
  const { visible, localFrame, exitProgress } = useMGPhase(
    { startMs, durationMs, enterFrames, exitFrames },
    { defaultEnterFrames: 40, defaultExitFrames: 12 },
  );

  if (!visible) return null;

  const isValueMode = "value" in props && props.value !== undefined;
  const targetPercent = isValueMode
    ? Math.max(0, Math.min(1, props.value / props.total))
    : Math.max(0, Math.min(1, (props.percentage ?? 0) / 100));

  // --- Track entrance -----------------------------------------------------
  const trackSpring = spring({
    fps,
    frame: localFrame,
    config: SPRING_SNAPPY,
    durationInFrames: 8,
  });
  const trackScaleX = trackSpring;
  const eyebrowFadeIn = interpolate(localFrame, [0, 6], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const heroFadeIn = interpolate(localFrame, [6, 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // --- Fill animation (ease-out cubic) -----------------------------------
  const fillRaw = interpolate(localFrame, [FILL_START, FILL_END], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fillEased = easeOutCubic(fillRaw);
  const currentPercent = targetPercent * fillEased;

  // --- Hero counter counts with the fill curve ---------------------------
  const currentValue = isValueMode
    ? props.value * fillEased
    : (props.percentage ?? 0) * fillEased;

  const heroText = isValueMode
    ? formatValue
      ? formatValue(currentValue)
      : Math.round(currentValue).toLocaleString()
    : `${Math.round(currentValue)}%`;

  const totalText = isValueMode
    ? formatValue
      ? formatValue(props.total)
      : Math.round(props.total).toLocaleString()
    : null;

  // --- Landing pulse — SUBTLE (1 → 1.08 → 1), not the old 1.4 ------------
  const pulsePhase = interpolate(localFrame, [FILL_END, PULSE_END], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const pulseTri = pulsePhase < 0.5 ? pulsePhase * 2 : (1 - pulsePhase) * 2;
  const fillScaleY = 1 + pulseTri * 0.08;

  // --- Exit --------------------------------------------------------------
  const exitOpacity = 1 - exitProgress;
  const exitDriftY = exitProgress * -8;

  // --- Geometry ----------------------------------------------------------
  const fillWidth = width * currentPercent;
  const radius = trackHeight / 2;

  return (
    <AbsoluteFill style={containerStyle}>
      <div style={wrapperStyle}>
      <div
        style={{
          opacity: exitOpacity,
          transform: `translateY(${exitDriftY}px)`,
          width,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* Eyebrow — small rust caps with the goal context */}
        {label ? (
          <div
            style={{
              fontFamily: FONT_FAMILIES.inter,
              fontSize: 24,
              fontWeight: 600,
              color: resolvedAccentColor,
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              lineHeight: 1,
              opacity: eyebrowFadeIn,
              textShadow: palette.shadowSmall,
              whiteSpace: "nowrap",
              marginBottom: 22,
            }}
          >
            {label}
          </div>
        ) : null}

        {/* Hero row — current value big + "/ total" smaller inline */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "baseline",
            justifyContent: "center",
            opacity: heroFadeIn,
            color: palette.heroText,
            lineHeight: 0.9,
            fontVariantNumeric: "tabular-nums",
            textShadow: palette.shadowLarge,
            whiteSpace: "nowrap",
          }}
        >
          <span
            style={{
              fontFamily: FONT_FAMILIES.anton,
              fontSize: 140,
              fontWeight: 400,
              letterSpacing: "-0.02em",
              lineHeight: 0.9,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {heroText}
          </span>
          {totalText ? (
            <span
              style={{
                fontFamily: FONT_FAMILIES.anton,
                fontSize: 60,
                fontWeight: 400,
                letterSpacing: "-0.01em",
                color: palette.totalText,
                marginLeft: 18,
                lineHeight: 0.9,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              / {totalText}
            </span>
          ) : null}
        </div>

        {/* Thin rust hairline — family detail */}
        <div
          style={{
            width: 48,
            height: 2,
            backgroundColor: resolvedAccentColor,
            marginTop: 22,
            marginBottom: 24,
            opacity: heroFadeIn,
            boxShadow: "0 2px 6px rgba(0,0,0,0.5)",
          }}
        />

        {/* Track + fill */}
        <div
          style={{
            position: "relative",
            width: "100%",
            height: trackHeight,
            transform: `scaleX(${trackScaleX})`,
            transformOrigin: "left center",
            opacity: eyebrowFadeIn,
          }}
        >
          {/* Track background */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundColor: resolvedTrackColor,
              borderRadius: radius,
              boxShadow: palette.trackInset,
            }}
          />

          {/* Fill bar — solid fillColor (default white) with subtle pulse */}
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              height: trackHeight,
              width: fillWidth,
              backgroundColor: resolvedFillColor,
              borderRadius: radius,
              transform: `scaleY(${fillScaleY})`,
              transformOrigin: "center",
              boxShadow: `0 4px 12px ${withAlpha(resolvedFillColor, 0.35)}`,
            }}
          />

          {/* Milestone ticks — small vertical marks above/below the track */}
          {milestones.map((m, i) => {
            const x = width * m.at;
            const reached = currentPercent >= m.at;
            return (
              <React.Fragment key={i}>
                <div
                  style={{
                    position: "absolute",
                    left: x - 1,
                    top: -4,
                    width: 2,
                    height: trackHeight + 8,
                    backgroundColor: reached
                      ? palette.tickReached
                      : palette.tickUnreached,
                    borderRadius: 1,
                  }}
                />
                {m.label ? (
                  <div
                    style={{
                      position: "absolute",
                      left: x,
                      bottom: -38,
                      transform: "translateX(-50%)",
                      fontFamily: FONT_FAMILIES.inter,
                      fontSize: 18,
                      fontWeight: 600,
                      color: reached ? palette.labelText : palette.labelDim,
                      letterSpacing: "0.2em",
                      textTransform: "uppercase",
                      whiteSpace: "nowrap",
                      textShadow: palette.shadowSmall,
                    }}
                  >
                    {m.label}
                  </div>
                ) : null}
              </React.Fragment>
            );
          })}
        </div>
      </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Color helper (inline — single use)
// ---------------------------------------------------------------------------

function withAlpha(color: string, alpha: number): string {
  if (color.startsWith("#")) {
    const h = color.replace("#", "");
    const full =
      h.length === 3
        ? h
            .split("")
            .map((c) => c + c)
            .join("")
        : h;
    const r = parseInt(full.slice(0, 2), 16);
    const g = parseInt(full.slice(2, 4), 16);
    const b = parseInt(full.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
  if (color.startsWith("rgb(")) {
    return color.replace("rgb(", "rgba(").replace(")", `, ${alpha})`);
  }
  return color;
}
