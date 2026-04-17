import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  useVideoConfig,
} from "remotion";
import { SPRING_SNAPPY } from "../../../utils/animations";
import { FONT_FAMILIES } from "../../../utils/fonts";
import { resolveMGPosition } from "../shared/positioning";
import { useMGPhase } from "../shared/useMGPhase";
import type { LowerThirdProps } from "./types";

// ---------------------------------------------------------------------------
// LowerThird — premium broadcast-style name/title card
// ---------------------------------------------------------------------------
//
// Choreography (entrance @ 30fps):
//   0-6   accent bar scaleY(0→1) from bottom + fade
//   2-12  avatar scale 0.85→1 + fade (if present)
//   4-14  card slides in from translateX(-30px) + fades
//   6-16  name slides in from translateX(-20px) + fades
//   10-18 title slides in from translateX(-20px) + fades
//
// Hold: sub-pixel sinusoidal Y parallax (~1px).
//
// Exit (12 frames): everything fades + drifts translateX(-25px); accent bar
// retracts scaleY(1→0) from top. Exit fade is applied to the outer wrapper
// so the shadow fades with the card (prevents a lingering shadow square).

const CARD_PADDING_X = 56;
const CARD_PADDING_Y = 34;
const ACCENT_WIDTH = 5;
const CARD_RADIUS = 4;
const AVATAR_SIZE = 96;
const AVATAR_GAP = 28;

// Solid diagonal gradients — fully opaque, add depth vs a flat rectangle.
const THEMES = {
  dark: {
    cardGradient:
      "linear-gradient(135deg, #0A0A0A 0%, #141416 55%, #1C1C1F 100%)",
    cardFallback: "#0F0F10",
    nameColor: "#FFFFFF",
    titleColor: "#B8B8B8",
  },
  light: {
    // Warm cream/bone — magazine newsprint feel.
    cardGradient:
      "linear-gradient(135deg, #F2E9D6 0%, #ECE2CB 55%, #E3D8BE 100%)",
    cardFallback: "#ECE2CB",
    nameColor: "#16120E",
    titleColor: "#5A4E3D",
  },
} as const;

export const LowerThird: React.FC<LowerThirdProps> = ({
  startMs,
  durationMs,
  enterFrames,
  exitFrames,
  name,
  title,
  accentColor = "#C8551F",
  avatarSrc,
  theme = "dark",
  anchor,
  offsetX,
  offsetY,
  scale,
}) => {
  const palette = THEMES[theme];
  // LowerThird anchors to bottom-left of the frame by default, 80px from the
  // left edge and 180px above the bottom.
  const { containerStyle, wrapperStyle } = resolveMGPosition(
    { anchor, offsetX, offsetY, scale },
    { anchor: "bottom-left", offsetX: 80, offsetY: -180 },
  );
  const { fps } = useVideoConfig();
  const { visible, localFrame, exitProgress } = useMGPhase(
    { startMs, durationMs, enterFrames, exitFrames },
    { defaultEnterFrames: 18, defaultExitFrames: 12 },
  );

  if (!visible) return null;

  // --- Per-element entrance springs ---------------------------------------

  // Accent bar: frames 0-6, scaleY(0→1) from bottom.
  const barSpring = spring({
    fps,
    frame: localFrame,
    config: SPRING_SNAPPY,
    durationInFrames: 6,
  });
  const barFadeIn = interpolate(localFrame, [0, 6], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Card: frames 4-14, translateX(-30px → 0) + fade.
  const cardSpring = spring({
    fps,
    frame: localFrame - 4,
    config: SPRING_SNAPPY,
    durationInFrames: 10,
  });
  const cardX = interpolate(cardSpring, [0, 1], [-30, 0]);
  const cardFadeIn = interpolate(localFrame, [4, 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Name: frames 6-16.
  const nameSpring = spring({
    fps,
    frame: localFrame - 6,
    config: SPRING_SNAPPY,
    durationInFrames: 10,
  });
  const nameX = interpolate(nameSpring, [0, 1], [-20, 0]);
  const nameFadeIn = interpolate(localFrame, [6, 16], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Title: frames 10-18.
  const titleSpring = spring({
    fps,
    frame: localFrame - 10,
    config: SPRING_SNAPPY,
    durationInFrames: 8,
  });
  const titleX = interpolate(titleSpring, [0, 1], [-20, 0]);
  const titleFadeIn = interpolate(localFrame, [10, 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Avatar: frames 2-12, scale 0.85→1 + fade.
  const avatarSpring = spring({
    fps,
    frame: localFrame - 2,
    config: SPRING_SNAPPY,
    durationInFrames: 10,
  });
  const avatarScale = interpolate(avatarSpring, [0, 1], [0.85, 1]);
  const avatarFadeIn = interpolate(localFrame, [2, 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // --- Hold-state parallax (sub-pixel sine on Y) --------------------------

  const parallaxY = Math.sin(localFrame * 0.06) * 1;

  // --- Exit ---------------------------------------------------------------

  const exitDriftX = exitProgress * -25;
  const exitOpacity = 1 - exitProgress;
  const barExitScaleY = 1 - exitProgress;

  // Per-element opacities cover entrance only. Exit fade is on the outer
  // wrapper so the shadow fades with the card (no lingering shadow square).
  const barOpacity = barFadeIn;
  const cardOpacity = cardFadeIn;
  const nameOpacity = nameFadeIn;
  const titleOpacity = titleFadeIn;
  const avatarOpacity = avatarFadeIn;

  const isExiting = exitProgress > 0;
  const barScaleY = isExiting ? barExitScaleY : barSpring;
  const barOrigin = isExiting ? "top" : "bottom";

  return (
    <AbsoluteFill style={containerStyle}>
      <div style={wrapperStyle}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          transform: `translate(${exitDriftX}px, ${parallaxY}px)`,
          opacity: exitOpacity,
        }}
      >
        {/* Avatar (outside card, to the left of the accent bar) */}
        {avatarSrc ? (
          <div
            style={{
              width: AVATAR_SIZE,
              height: AVATAR_SIZE,
              borderRadius: AVATAR_SIZE / 2,
              overflow: "hidden",
              marginRight: AVATAR_GAP,
              transform: `scale(${avatarScale})`,
              opacity: avatarOpacity,
              flexShrink: 0,
              boxShadow: "0 6px 18px rgba(0,0,0,0.35)",
            }}
          >
            <Img
              src={avatarSrc}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
            />
          </div>
        ) : null}

        {/* Card (accent bar + body as siblings so each fades its own shadow) */}
        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "stretch",
            transform: `translateX(${cardX}px)`,
          }}
        >
          {/* Accent bar — rounded on the leading edge only */}
          <div
            style={{
              width: ACCENT_WIDTH,
              backgroundColor: accentColor,
              borderTopLeftRadius: CARD_RADIUS,
              borderBottomLeftRadius: CARD_RADIUS,
              transform: `scaleY(${barScaleY})`,
              transformOrigin: barOrigin,
              opacity: barOpacity,
              flexShrink: 0,
            }}
          />

          {/* Card body — shadow lives here so it fades with the body */}
          <div
            style={{
              backgroundColor: palette.cardFallback,
              backgroundImage: palette.cardGradient,
              paddingTop: CARD_PADDING_Y,
              paddingBottom: CARD_PADDING_Y,
              paddingLeft: CARD_PADDING_X,
              paddingRight: CARD_PADDING_X,
              opacity: cardOpacity,
              borderTopRightRadius: CARD_RADIUS,
              borderBottomRightRadius: CARD_RADIUS,
              boxShadow:
                "0 14px 40px rgba(0,0,0,0.45), 0 2px 4px rgba(0,0,0,0.3)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              minWidth: 280,
            }}
          >
            {/* Name — editorial serif caps */}
            <div
              style={{
                fontFamily: FONT_FAMILIES.dmSerifDisplay,
                fontSize: 68,
                fontWeight: 400,
                color: palette.nameColor,
                letterSpacing: "0.01em",
                lineHeight: 1,
                textTransform: "uppercase",
                transform: `translateX(${nameX}px)`,
                opacity: nameOpacity,
                whiteSpace: "nowrap",
              }}
            >
              {name}
            </div>

            {/* Title */}
            <div
              style={{
                fontFamily: FONT_FAMILIES.inter,
                fontSize: 32,
                fontWeight: 500,
                color: palette.titleColor,
                letterSpacing: "0.12em",
                lineHeight: 1.2,
                textTransform: "uppercase",
                marginTop: 14,
                transform: `translateX(${titleX}px)`,
                opacity: titleOpacity,
                whiteSpace: "nowrap",
              }}
            >
              {title}
            </div>
          </div>
        </div>
      </div>
      </div>
    </AbsoluteFill>
  );
};
