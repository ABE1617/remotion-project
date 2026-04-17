import React from "react";
import { AbsoluteFill, interpolate, spring, useVideoConfig } from "remotion";
import { SPRING_SNAPPY } from "../../../utils/animations";
import { FONT_FAMILIES } from "../../../utils/fonts";
import { useMGPhase } from "../shared/useMGPhase";
import type { ProgressBarProps } from "./types";

// ---------------------------------------------------------------------------
// ProgressBar — premium fill bar with synchronized counter + leading-edge glow
// ---------------------------------------------------------------------------
//
// Choreography (40-frame entrance, 12-frame exit):
//   0-8    track scales scaleX(0→1) from left
//   8-34   fill animates 0→target with ease-out cubic
//          counter syncs to the same curve
//          leading-edge glow rides the right end of the fill
//   34-40  landing pulse: glow intensifies, fill bar does subtle scaleY pulse
//   exit   whole component fades + drifts down 8px
//
// The premium signal is the synchronized counter (one easing curve drives
// both the bar and the number — never desynced) and the leading-edge glow
// that "leads" the fill so the eye tracks the progression.

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

const FILL_START = 8;
const FILL_END = 34;
const PULSE_END = 40;

export const ProgressBar: React.FC<ProgressBarProps> = (props) => {
  const {
    startMs,
    durationMs,
    enterFrames,
    exitFrames,
    label,
    width = 820,
    trackHeight = 16,
    accentColor = "#FF3B30",
    trackColor = "rgba(255,255,255,0.14)",
    position = "center",
    milestones = [],
    formatValue,
  } = props;
  const { fps } = useVideoConfig();
  const { visible, localFrame, exitProgress } = useMGPhase(
    { startMs, durationMs, enterFrames, exitFrames },
    { defaultEnterFrames: 40, defaultExitFrames: 12 },
  );

  if (!visible) return null;

  // --- Resolve target percentage and value formatting -------------------------

  const isValueMode = "value" in props && props.value !== undefined;
  const targetPercent = isValueMode
    ? Math.max(0, Math.min(1, props.value / props.total))
    : Math.max(0, Math.min(1, (props.percentage ?? 0) / 100));

  // --- Track entrance: scaleX(0→1) from left ---------------------------------

  const trackSpring = spring({
    fps,
    frame: localFrame,
    config: SPRING_SNAPPY,
    durationInFrames: 8,
  });
  const trackScaleX = trackSpring;
  const trackOpacity = interpolate(localFrame, [0, 6], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // --- Fill animation with ease-out cubic ------------------------------------

  const fillRaw = interpolate(localFrame, [FILL_START, FILL_END], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fillEased = easeOutCubic(fillRaw);
  const currentPercent = targetPercent * fillEased;

  // --- Counter values driven by the SAME curve as the fill -------------------
  //
  // Hero shows the current value (counts up). Subtitle shows the target so the
  // viewer always knows the goal — but it's quiet supporting information, not
  // crowding the hero number.

  const currentValue = isValueMode
    ? props.value * fillEased
    : (props.percentage ?? 0) * fillEased;

  const heroText = isValueMode
    ? formatValue
      ? formatValue(currentValue)
      : Math.round(currentValue).toLocaleString()
    : `${Math.round(currentValue)}%`;

  const subtitleText = isValueMode
    ? formatValue
      ? `of ${formatValue(props.total)}`
      : `of ${Math.round(props.total).toLocaleString()}`
    : null;

  // --- Landing pulse: bar scaleY 1 → 1.4 → 1 over frames 34-40 ---------------

  const pulsePhase = interpolate(localFrame, [FILL_END, PULSE_END], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // Triangular: 0→1→0 across the window.
  const pulseTri = pulsePhase < 0.5 ? pulsePhase * 2 : (1 - pulsePhase) * 2;
  const fillScaleY = 1 + pulseTri * 0.4;
  const glowBoost = pulseTri;

  // --- Leading-edge glow: subtle continuous breathing during fill ------------

  const glowBreath = (Math.sin(localFrame * 0.18) * 0.5 + 0.5) * 0.15 + 0.85;

  // --- Exit: fade + drift down 8px -------------------------------------------

  const exitOpacity = 1 - exitProgress;
  const exitDriftY = exitProgress * 8;

  // --- Position on screen ----------------------------------------------------

  const positionStyle: React.CSSProperties =
    position === "top"
      ? { top: 220 }
      : position === "bottom"
        ? { bottom: 220 }
        : { top: "50%", transform: "translateY(-50%)" };

  // --- Geometry --------------------------------------------------------------

  const fillWidth = width * currentPercent;
  const radius = trackHeight / 2;

  // Lighter accent for gradient top-stop. Hex parsing for simple lightening.
  const lighterAccent = lightenHex(accentColor, 0.18);

  // Glow circle sits on the leading edge of the fill.
  const glowSize = trackHeight * 2.6;
  const glowOpacity = (0.55 + glowBoost * 0.35) * glowBreath * exitOpacity;

  return (
    <AbsoluteFill
      style={{
        opacity: exitOpacity,
        transform: `translateY(${exitDriftY}px)`,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: "50%",
          marginLeft: -width / 2,
          width,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          ...positionStyle,
        }}
      >
        {/* Hero counter — the value, stacked vertically and centered */}
        <div
          style={{
            fontFamily: FONT_FAMILIES.anton,
            fontSize: 156,
            fontWeight: 400,
            color: "#FFFFFF",
            letterSpacing: "-0.02em",
            lineHeight: 0.9,
            fontVariantNumeric: "tabular-nums",
            whiteSpace: "nowrap",
            opacity: trackOpacity,
            textShadow: "0 4px 24px rgba(0,0,0,0.55)",
          }}
        >
          {heroText}
        </div>

        {/* Subtitle — quiet target reference (only in value mode) */}
        {subtitleText ? (
          <div
            style={{
              fontFamily: FONT_FAMILIES.inter,
              fontSize: 30,
              fontWeight: 500,
              color: "rgba(255,255,255,0.65)",
              letterSpacing: "0.02em",
              marginTop: 14,
              fontVariantNumeric: "tabular-nums",
              whiteSpace: "nowrap",
              opacity: trackOpacity,
              textShadow: "0 2px 12px rgba(0,0,0,0.5)",
            }}
          >
            {subtitleText}
          </div>
        ) : null}

        {/* Track + fill — sits below the hero block with breathing room */}
        <div
          style={{
            position: "relative",
            width: "100%",
            height: trackHeight,
            marginTop: 56,
            transform: `scaleX(${trackScaleX})`,
            transformOrigin: "left center",
            opacity: trackOpacity,
          }}
        >
          {/* Track background */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundColor: trackColor,
              borderRadius: radius,
            }}
          />

          {/* Fill bar — gradient + scaleY pulse on landing */}
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              height: trackHeight,
              width: fillWidth,
              background: `linear-gradient(90deg, ${accentColor}, ${lighterAccent})`,
              borderRadius: radius,
              transform: `scaleY(${fillScaleY})`,
              transformOrigin: "center",
              boxShadow: `0 0 ${12 + glowBoost * 18}px ${withAlpha(accentColor, 0.55 + glowBoost * 0.3)}`,
            }}
          />

          {/* Milestone markers — small ticks above the track */}
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
                      ? accentColor
                      : "rgba(255,255,255,0.35)",
                    borderRadius: 1,
                  }}
                />
                {m.label ? (
                  <div
                    style={{
                      position: "absolute",
                      left: x,
                      bottom: -36,
                      transform: "translateX(-50%)",
                      fontFamily: FONT_FAMILIES.inter,
                      fontSize: 18,
                      fontWeight: 600,
                      color: reached
                        ? "rgba(255,255,255,0.85)"
                        : "rgba(255,255,255,0.45)",
                      letterSpacing: "0.16em",
                      textTransform: "uppercase",
                      whiteSpace: "nowrap",
                      textShadow: "0 2px 8px rgba(0,0,0,0.5)",
                    }}
                  >
                    {m.label}
                  </div>
                ) : null}
              </React.Fragment>
            );
          })}

          {/* Leading-edge glow — rides the right end of the fill */}
          {currentPercent > 0.001 ? (
            <div
              style={{
                position: "absolute",
                left: fillWidth,
                top: trackHeight / 2,
                width: glowSize,
                height: glowSize,
                marginLeft: -glowSize / 2,
                marginTop: -glowSize / 2,
                borderRadius: glowSize / 2,
                background: `radial-gradient(circle, ${withAlpha(lighterAccent, glowOpacity)} 0%, ${withAlpha(accentColor, 0)} 70%)`,
                pointerEvents: "none",
              }}
            />
          ) : null}
        </div>

        {/* Section label below the bar — quiet, tracked caption */}
        {label ? (
          <div
            style={{
              fontFamily: FONT_FAMILIES.inter,
              fontSize: 26,
              fontWeight: 600,
              color: "rgba(255,255,255,0.75)",
              letterSpacing: "0.24em",
              textTransform: "uppercase",
              marginTop: milestones.some((m) => m.label) ? 64 : 36,
              opacity: trackOpacity,
              textShadow: "0 2px 10px rgba(0,0,0,0.55)",
              whiteSpace: "nowrap",
            }}
          >
            {label}
          </div>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Color helpers (kept inline — small enough that pulling in a lib isn't worth it)
// ---------------------------------------------------------------------------

function parseHex(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  const full = h.length === 3
    ? h.split("").map((c) => c + c).join("")
    : h;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  return [r, g, b];
}

function lightenHex(hex: string, amount: number): string {
  const [r, g, b] = parseHex(hex);
  const lr = Math.min(255, Math.round(r + (255 - r) * amount));
  const lg = Math.min(255, Math.round(g + (255 - g) * amount));
  const lb = Math.min(255, Math.round(b + (255 - b) * amount));
  return `rgb(${lr}, ${lg}, ${lb})`;
}

function withAlpha(color: string, alpha: number): string {
  if (color.startsWith("#")) {
    const [r, g, b] = parseHex(color);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
  if (color.startsWith("rgb(")) {
    return color.replace("rgb(", "rgba(").replace(")", `, ${alpha})`);
  }
  return color;
}
