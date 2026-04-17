import React from "react";
import { AbsoluteFill, Easing, interpolate, OffthreadVideo } from "remotion";
import type { CardLiftProps } from "../types";

export const CARD_LIFT_PEAK_PROGRESS = 0.5;

/**
 * CardLift — iOS modal-dismiss style. The outgoing clip lifts up,
 * shrinks slightly, gains a soft drop-shadow, and fades — revealing the
 * incoming clip already in place underneath. Reads as "closing a card
 * to reveal the screen behind it."
 *
 * Pure CSS transforms. Designed to feel gentle — not a hard cut, a
 * physical interaction.
 */
export const CardLift: React.FC<CardLiftProps> = ({
  clipA,
  clipB,
  progress,
  style,
  liftAmount = 10,
  liftScale = 0.9,
}) => {
  const ease = Easing.bezier(0.4, 0, 0.2, 1);
  const p = interpolate(progress, [0, 1], [0, 1], {
    easing: ease,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const translateYA = -liftAmount * p; // percent of viewport
  const scaleA = interpolate(p, [0, 1], [1, liftScale]);
  const opacityA = interpolate(p, [0, 1], [1, 0]);

  // Incoming settles with a very subtle scale so it feels "welcoming"
  // rather than instantly static.
  const scaleB = interpolate(p, [0, 1], [1.02, 1]);

  // Drop shadow intensifies as the card lifts — gives the lift weight.
  const shadowBlur = 20 + 60 * p;
  const shadowY = 10 + 40 * p;
  const shadowAlpha = 0.25 + 0.3 * p;
  const shadow = `0 ${shadowY}px ${shadowBlur}px rgba(0,0,0,${shadowAlpha})`;

  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#000", ...style }}>
      {/* Incoming clip in place underneath */}
      <AbsoluteFill
        style={{
          transform: `scale(${scaleB})`,
          willChange: "transform",
        }}
      >
        <OffthreadVideo
          src={clipB}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </AbsoluteFill>

      {/* Outgoing card lifts off */}
      <AbsoluteFill
        style={{
          transform: `translateY(${translateYA}%) scale(${scaleA})`,
          transformOrigin: "center center",
          opacity: opacityA,
          boxShadow: shadow,
          borderRadius: `${18 * p}px`,
          overflow: "hidden",
          willChange: "transform, opacity",
        }}
      >
        <OffthreadVideo
          src={clipA}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
