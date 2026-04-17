import React from "react";
import { AbsoluteFill, interpolate, spring, useVideoConfig } from "remotion";
import { SPRING_SNAPPY } from "../../../utils/animations";
import { FONT_FAMILIES } from "../../../utils/fonts";
import { useMGPhase } from "../shared/useMGPhase";
import type { StatCardProps } from "./types";

// ---------------------------------------------------------------------------
// StatCard — Apple-keynote-style single-stat reveal.
// ---------------------------------------------------------------------------
//
// Choreography (entrance @ 30fps):
//   0-10  card scales 0.96→1 (SPRING_SNAPPY) + fades 0→1
//   6-26  NUMBER counts up fromValue → value with ease-out cubic (weighty)
//   26-32 LANDING PULSE — number scales 1.0→1.08→1.0 (triangular)
//   28-36 label fades + drifts translateY(8px → 0)
//   32-38 source fades in (no drift)
//
// Hold: nothing — stat sits still so viewers can read it.
//
// Exit (12 frames):
//   whole card scales 1.0→0.96 + fades to 0.
//
// Quality notes:
//   - tabular-nums on the number + prefix/suffix so digit widths never shift
//   - toLocaleString() for thousands separators (500,000 not 500000)
//   - solid backgrounds only (no translucency — client has been burned before)

const CARD_RADIUS = 16;
const CARD_PADDING_X = 80;
const CARD_PADDING_Y = 72;
const CARD_MIN_WIDTH = 540;

const NUMBER_SIZE = 168;
const AFFIX_SIZE = 96;
const AFFIX_GAP = 8;

const LABEL_GAP = 28;
const SOURCE_GAP = 32;

// Ease-out cubic — slow, weighty landing.
const easeOutCubic = (t: number): number => 1 - Math.pow(1 - t, 3);

interface Palette {
  bg: string;
  stat: string;
  label: string;
  source: string;
  shadow: string;
  topBorder: string | null;
}

const getPalette = (style: "light" | "dark", accent: string): Palette => {
  if (style === "dark") {
    return {
      bg: "#0A0A0A",
      stat: "#FFFFFF",
      label: "#E5E5E5",
      source: "#9A9A9A",
      shadow: "0 16px 48px rgba(0,0,0,0.5)",
      topBorder: accent,
    };
  }
  return {
    bg: "#F8F7F4",
    stat: "#0A0A0A",
    label: "#1A1A1A",
    source: "#6B6B6B",
    shadow: "0 16px 48px rgba(0,0,0,0.25)",
    topBorder: null,
  };
};

export const StatCard: React.FC<StatCardProps> = ({
  startMs,
  durationMs,
  enterFrames,
  exitFrames,
  value,
  fromValue = 0,
  prefix,
  suffix,
  decimals,
  label,
  source,
  cardStyle = "light",
  accentColor = "#FF3B30",
}) => {
  const { fps } = useVideoConfig();
  const { visible, localFrame, exitProgress } = useMGPhase(
    { startMs, durationMs, enterFrames, exitFrames },
    { defaultEnterFrames: 38, defaultExitFrames: 12 },
  );

  if (!visible) return null;

  const palette = getPalette(cardStyle, accentColor);

  // --- Card entrance (frames 0-10) ---------------------------------------

  const cardEnterSpring = spring({
    fps,
    frame: localFrame,
    config: SPRING_SNAPPY,
    durationInFrames: 10,
  });
  const cardEnterScale = interpolate(cardEnterSpring, [0, 1], [0.96, 1]);
  const cardFadeIn = interpolate(localFrame, [0, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // --- Count-up (frames 6-26) --------------------------------------------

  const countProgress = interpolate(localFrame, [6, 26], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const easedCount = easeOutCubic(countProgress);
  const currentValue = fromValue + (value - fromValue) * easedCount;
  const display =
    decimals !== undefined
      ? currentValue.toFixed(decimals)
      : Math.round(currentValue).toLocaleString();

  // --- Landing pulse (frames 26-32) --------------------------------------
  // Triangular curve: 26→29 scales 1→1.08, 29→32 scales 1.08→1.
  const pulseScale = interpolate(
    localFrame,
    [26, 29, 32],
    [1, 1.08, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // --- Label (frames 28-36) ----------------------------------------------

  const labelFadeIn = interpolate(localFrame, [28, 36], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const labelY = interpolate(localFrame, [28, 36], [8, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // --- Source (frames 32-38) ---------------------------------------------

  const sourceFadeIn = interpolate(localFrame, [32, 38], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // --- Exit (last 12 frames) ---------------------------------------------
  // Whole card scales 1→0.96 and fades out.
  const exitScale = interpolate(exitProgress, [0, 1], [1, 0.96]);
  const exitOpacity = 1 - exitProgress;

  // --- Compose -----------------------------------------------------------

  const cardScale = cardEnterScale * exitScale;
  const cardOpacity = cardFadeIn * exitOpacity;

  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: palette.bg,
          borderRadius: CARD_RADIUS,
          paddingLeft: CARD_PADDING_X,
          paddingRight: CARD_PADDING_X,
          paddingTop: CARD_PADDING_Y,
          paddingBottom: CARD_PADDING_Y,
          minWidth: CARD_MIN_WIDTH,
          maxWidth: "85%",
          boxShadow: palette.shadow,
          transform: `scale(${cardScale})`,
          opacity: cardOpacity,
          overflow: "hidden",
        }}
      >
        {/* Top accent border — dark variant only */}
        {palette.topBorder ? (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 1,
              backgroundColor: palette.topBorder,
            }}
          />
        ) : null}

        {/* Number row — prefix + value + suffix, baseline-aligned */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "baseline",
            justifyContent: "center",
            transform: `scale(${pulseScale})`,
            transformOrigin: "center",
            fontVariantNumeric: "tabular-nums",
            color: palette.stat,
            lineHeight: 1,
          }}
        >
          {prefix ? (
            <span
              style={{
                fontFamily: FONT_FAMILIES.anton,
                fontSize: AFFIX_SIZE,
                fontWeight: 400,
                letterSpacing: "-0.02em",
                lineHeight: 1,
                opacity: 0.85,
                marginRight: AFFIX_GAP,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {prefix}
            </span>
          ) : null}

          <span
            style={{
              fontFamily: FONT_FAMILIES.anton,
              fontSize: NUMBER_SIZE,
              fontWeight: 400,
              letterSpacing: "-0.02em",
              lineHeight: 1,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {display}
          </span>

          {suffix ? (
            <span
              style={{
                fontFamily: FONT_FAMILIES.anton,
                fontSize: AFFIX_SIZE,
                fontWeight: 400,
                letterSpacing: "-0.02em",
                lineHeight: 1,
                opacity: 0.85,
                marginLeft: AFFIX_GAP,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {suffix}
            </span>
          ) : null}
        </div>

        {/* Label */}
        <div
          style={{
            marginTop: LABEL_GAP,
            fontFamily: FONT_FAMILIES.inter,
            fontSize: 28,
            fontWeight: 600,
            color: palette.label,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            textAlign: "center",
            lineHeight: 1.2,
            opacity: labelFadeIn,
            transform: `translateY(${labelY}px)`,
          }}
        >
          {label}
        </div>

        {/* Source citation */}
        {source ? (
          <div
            style={{
              marginTop: SOURCE_GAP,
              fontFamily: FONT_FAMILIES.inter,
              fontSize: 20,
              fontWeight: 400,
              color: palette.source,
              textAlign: "center",
              lineHeight: 1.3,
              opacity: sourceFadeIn,
            }}
          >
            {source}
          </div>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};
