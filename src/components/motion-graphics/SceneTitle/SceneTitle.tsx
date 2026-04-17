import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useVideoConfig,
} from "remotion";
import { SPRING_SNAPPY } from "../../../utils/animations";
import { FONT_FAMILIES } from "../../../utils/fonts";
import { useMGPhase } from "../shared/useMGPhase";
import type { SceneTitleProps } from "./types";

// ---------------------------------------------------------------------------
// SceneTitle — full or half-frame section card that breaks a video into
// chapters. Solid accent panel (never translucent), magazine-grade typography.
// ---------------------------------------------------------------------------
//
// Choreography (entrance @ 30fps, 18 frames total):
//   0-10  panel clipPath wipe in (top→down, or bottom→up for half-bottom).
//         Cubic ease-out — no spring bounce on a full-screen color field.
//   8-14  section label drops from translateY(-20) + fades.
//   8-14  divider scaleX(0→1) from center origin.
//   12-18 title slides from translateY(20) + fades.
//
// Exit (12 frames) — mirrored but snappier and opposite direction:
//   0-8   title drifts +20y fading.
//   0-8   label + divider drift -15y fading.
//   4-12  panel wipes out (cubic ease-in) in the opposite direction.

const TITLE_SIZE = 130;
const LABEL_SIZE = 34;
const DIVIDER_WIDTH = 100;
const DIVIDER_HEIGHT = 2;
const LABEL_TO_DIVIDER_GAP = 28;
const DIVIDER_TO_TITLE_GAP = 32;

// Solid diagonal gradients — fully opaque, add depth vs a flat color field.
const THEMES = {
  dark: {
    panelGradient:
      "linear-gradient(135deg, #0A0A0A 0%, #141416 55%, #1C1C1F 100%)",
    panelFallback: "#0F0F10",
    titleColor: "#F2E9D6",
    labelColor: "#E8DFD0",
  },
  light: {
    // Warm cream/bone — magazine cover feel.
    panelGradient:
      "linear-gradient(135deg, #F2E9D6 0%, #ECE2CB 55%, #E3D8BE 100%)",
    panelFallback: "#ECE2CB",
    titleColor: "#16120E",
    labelColor: "#5A4E3D",
  },
} as const;

export const SceneTitle: React.FC<SceneTitleProps> = ({
  startMs,
  durationMs,
  enterFrames,
  exitFrames,
  title,
  label,
  variant = "full",
  theme = "dark",
  accentColor = "#C8551F",
  titleColor,
  labelColor,
  showDivider = true,
}) => {
  const palette = THEMES[theme];
  const resolvedTitleColor = titleColor ?? palette.titleColor;
  const resolvedLabelColor = labelColor ?? palette.labelColor;
  const { fps } = useVideoConfig();
  const { visible, localFrame, exitProgress } = useMGPhase(
    { startMs, durationMs, enterFrames, exitFrames },
    { defaultEnterFrames: 18, defaultExitFrames: 12 },
  );

  if (!visible) return null;

  const isExiting = exitProgress > 0;
  const hasLabel = Boolean(label);
  const renderDivider = hasLabel && showDivider;

  // ------------------------------------------------------------------------
  // Panel geometry — full, half-top, or half-bottom. The outer positioned
  // div is clipped via inset() to produce the wipe.
  // ------------------------------------------------------------------------

  const panelStyle: React.CSSProperties = (() => {
    if (variant === "half-top") {
      return { top: 0, left: 0, right: 0, height: "50%" };
    }
    if (variant === "half-bottom") {
      return { bottom: 0, left: 0, right: 0, height: "50%" };
    }
    return { top: 0, left: 0, right: 0, bottom: 0 };
  })();

  // ------------------------------------------------------------------------
  // Panel reveal — clipPath wipe.
  // Entrance: full + half-top wipe top→down (reveal grows downward),
  //           half-bottom wipes bottom→up (reveal grows upward).
  // Exit    : reverse the direction — panel collapses off the side it
  //           entered from's opposite.
  // ------------------------------------------------------------------------

  // Smooth cubic ease-out — no spring bounce on the full-screen panel.
  // Slightly longer (10f) than the original 8f spring so the sweep feels
  // gracious rather than snappy.
  const entranceClip = interpolate(localFrame, [0, 10], [100, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Exit wipe — 4-frame stagger vs. text, cubic ease-in so the panel
  // accelerates off rather than leaving linearly.
  const exitWipe = interpolate(exitProgress, [0.33, 1], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.cubic),
  });

  // Build clipPath per variant + phase.
  // Exit direction is OPPOSITE of entrance:
  //   full + half-top entered top→down, so they exit top→up (top inset grows).
  //   half-bottom entered bottom→up, so it exits bottom→down (bottom inset grows).
  const clipPath: string = (() => {
    if (variant === "half-bottom") {
      if (isExiting) {
        // Top inset 0, bottom inset grows 0→100.
        return `inset(0% 0 ${exitWipe}% 0)`;
      }
      // Entering: top inset starts at 100, shrinks to 0.
      return `inset(${entranceClip}% 0 0% 0)`;
    }
    // full + half-top
    if (isExiting) {
      // Top inset grows 0→100 (panel collapses upward).
      return `inset(${exitWipe}% 0 0% 0)`;
    }
    // Entering: bottom inset starts at 100, shrinks to 0.
    return `inset(0% 0 ${entranceClip}% 0)`;
  })();

  // ------------------------------------------------------------------------
  // Label (frames 8-14).
  // ------------------------------------------------------------------------

  const labelSpring = spring({
    fps,
    frame: localFrame - 8,
    config: SPRING_SNAPPY,
    durationInFrames: 8,
  });
  const labelEnterY = interpolate(labelSpring, [0, 1], [-20, 0]);
  const labelFadeIn = interpolate(localFrame, [8, 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // Exit: drift up -15 over the first 8 exit frames.
  const labelExitY = interpolate(exitProgress, [0, 0.67], [0, -15], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const labelExitFade = interpolate(exitProgress, [0, 0.67], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const labelY = labelEnterY + labelExitY;
  const labelOpacity = labelFadeIn * labelExitFade;

  // ------------------------------------------------------------------------
  // Divider (frames 8-14). scaleX from 0 → 1 at center origin.
  // ------------------------------------------------------------------------

  const dividerSpring = spring({
    fps,
    frame: localFrame - 8,
    config: SPRING_SNAPPY,
    durationInFrames: 8,
  });
  const dividerScaleEnter = interpolate(dividerSpring, [0, 1], [0, 1]);
  // On exit, shares label drift + fade.
  const dividerY = labelExitY;
  const dividerOpacity = labelFadeIn * labelExitFade;

  // ------------------------------------------------------------------------
  // Title (frames 12-18).
  // ------------------------------------------------------------------------

  const titleSpring = spring({
    fps,
    frame: localFrame - 12,
    config: SPRING_SNAPPY,
    durationInFrames: 8,
  });
  const titleEnterY = interpolate(titleSpring, [0, 1], [20, 0]);
  const titleFadeIn = interpolate(localFrame, [12, 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // Exit: drift down +20 over the first 8 exit frames.
  const titleExitY = interpolate(exitProgress, [0, 0.67], [0, 20], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const titleExitFade = interpolate(exitProgress, [0, 0.67], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const titleY = titleEnterY + titleExitY;
  const titleOpacity = titleFadeIn * titleExitFade;

  // ------------------------------------------------------------------------
  // Render.
  // ------------------------------------------------------------------------

  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          ...panelStyle,
          backgroundColor: palette.panelFallback,
          backgroundImage: palette.panelGradient,
          clipPath,
          WebkitClipPath: clipPath,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 80px",
          boxSizing: "border-box",
        }}
      >
        {hasLabel ? (
          <div
            style={{
              fontFamily: FONT_FAMILIES.inter,
              fontSize: LABEL_SIZE,
              fontWeight: 600,
              color: resolvedLabelColor,
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              lineHeight: 1,
              transform: `translateY(${labelY}px)`,
              opacity: labelOpacity,
              marginBottom: renderDivider ? LABEL_TO_DIVIDER_GAP : 40,
              // Letter-spacing visually shifts the text right of center;
              // pull it back so the label reads optically centered.
              paddingLeft: "0.28em",
            }}
          >
            {label}
          </div>
        ) : null}

        {renderDivider ? (
          <div
            style={{
              width: DIVIDER_WIDTH,
              height: DIVIDER_HEIGHT,
              backgroundColor: accentColor,
              transform: `translateY(${dividerY}px) scaleX(${dividerScaleEnter})`,
              transformOrigin: "center",
              opacity: dividerOpacity,
              marginBottom: DIVIDER_TO_TITLE_GAP,
            }}
          />
        ) : null}

        <div
          style={{
            fontFamily: FONT_FAMILIES.dmSerifDisplay,
            fontSize: TITLE_SIZE,
            fontWeight: 400,
            color: resolvedTitleColor,
            lineHeight: 0.98,
            letterSpacing: "0.01em",
            textTransform: "uppercase",
            textAlign: "center",
            whiteSpace: "pre-line",
            transform: `translateY(${titleY}px)`,
            opacity: titleOpacity,
          }}
        >
          {title}
        </div>
      </div>
    </AbsoluteFill>
  );
};
