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
// Exit (12 frames):
//   everything fades + drifts translateX(-25px),
//   accent bar retracts scaleY(1→0) from top (opposite of entrance).

const CARD_PADDING_X = 56;
const CARD_PADDING_Y = 34;
const ACCENT_WIDTH = 5;
const CARD_RADIUS = 4;
const AVATAR_SIZE = 96;
const AVATAR_GAP = 28;

export const LowerThird: React.FC<LowerThirdProps> = ({
  startMs,
  durationMs,
  enterFrames,
  exitFrames,
  name,
  title,
  accentColor = "#FF3B30",
  avatarSrc,
  cardColor = "#0A0A0A",
}) => {
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

  // Group drift: everything slides a touch to the left as it fades.
  const exitDriftX = exitProgress * -25;
  // Global exit fade (applied to the whole card group).
  const exitOpacity = 1 - exitProgress;
  // Accent bar retracts upward (opposite of entrance: origin top, 1→0).
  const barExitScaleY = 1 - exitProgress;

  // --- Compose final values ----------------------------------------------

  const barOpacity = barFadeIn * exitOpacity;
  const cardOpacity = cardFadeIn * exitOpacity;
  const nameOpacity = nameFadeIn * exitOpacity;
  const titleOpacity = titleFadeIn * exitOpacity;
  const avatarOpacity = avatarFadeIn * exitOpacity;

  // During entrance the accent bar uses scaleY from bottom (barSpring).
  // During exit it uses scaleY from top (barExitScaleY). Because the exit
  // window occurs well after entrance is complete, barSpring is pinned at 1
  // and barExitScaleY will be the only driver, so we can combine by
  // multiplying — but we need to switch transform-origin based on phase.
  const isExiting = exitProgress > 0;
  const barScaleY = isExiting ? barExitScaleY : barSpring;
  const barOrigin = isExiting ? "top" : "bottom";

  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: 80,
          bottom: 180,
          display: "flex",
          alignItems: "center",
          transform: `translate(${exitDriftX}px, ${parallaxY}px)`,
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

        {/* Card (contains accent bar + text) */}
        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "stretch",
            transform: `translateX(${cardX}px)`,
            borderRadius: CARD_RADIUS,
            overflow: "hidden",
            boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
          }}
        >
          {/* Accent bar — flush to the card's left edge */}
          <div
            style={{
              width: ACCENT_WIDTH,
              backgroundColor: accentColor,
              transform: `scaleY(${barScaleY})`,
              transformOrigin: barOrigin,
              opacity: barOpacity,
              flexShrink: 0,
            }}
          />

          {/* Dark card body — fully opaque (#0A0A0A by default) */}
          <div
            style={{
              backgroundColor: cardColor,
              paddingTop: CARD_PADDING_Y,
              paddingBottom: CARD_PADDING_Y,
              paddingLeft: CARD_PADDING_X,
              paddingRight: CARD_PADDING_X + 24,
              opacity: cardOpacity,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              minWidth: 360,
            }}
          >
            {/* Name */}
            <div
              style={{
                fontFamily: FONT_FAMILIES.anton,
                fontSize: 78,
                fontWeight: 400,
                color: "#FFFFFF",
                letterSpacing: "-0.01em",
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
                color: "#B8B8B8",
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
    </AbsoluteFill>
  );
};
