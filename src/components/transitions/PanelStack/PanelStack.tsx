import React from "react";
import { AbsoluteFill, Easing, interpolate, OffthreadVideo } from "remotion";
import type { PanelStackProps } from "../types";

export const PANEL_STACK_PEAK_PROGRESS = 0.5;

/**
 * PanelStack — iOS App Switcher-style transition. The outgoing clip
 * scales down, tilts back (rotateX), lifts up slightly, and dims —
 * reading as "pushed into the multitask stack." The incoming clip sits
 * behind and is revealed at full scale as clipA recedes.
 *
 * Pure CSS transforms — no video copies, no SVG filters. Performant.
 */
export const PanelStack: React.FC<PanelStackProps> = ({
  clipA,
  clipB,
  progress,
  style,
  tiltDirection = "back",
  backgroundColor = "#000000",
}) => {
  const ease = Easing.bezier(0.4, 0, 0.2, 1);
  const p = interpolate(progress, [0, 1], [0, 1], {
    easing: ease,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Outgoing clip recedes into the stack.
  const scaleA = interpolate(p, [0, 1], [1, 0.72]);
  const translateYA = interpolate(p, [0, 1], [0, -4]); // percent of viewport
  const rotateXA =
    tiltDirection === "back" ? interpolate(p, [0, 1], [0, 14]) : 0;
  const rotateYA =
    tiltDirection === "side" ? interpolate(p, [0, 1], [0, -18]) : 0;
  const translateXA =
    tiltDirection === "side" ? interpolate(p, [0, 1], [0, -30]) : 0;
  const opacityA = interpolate(p, [0, 1], [1, 0.7]);

  // Incoming clip settles slightly.
  const scaleB = interpolate(p, [0, 1], [1.04, 1]);

  return (
    <AbsoluteFill
      style={{
        overflow: "hidden",
        background: backgroundColor,
        perspective: 1600,
        ...style,
      }}
    >
      {/* Incoming — in place, behind */}
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

      {/* Outgoing — tilts away */}
      <AbsoluteFill
        style={{
          transform: `translate(${translateXA}%, ${translateYA}%) rotateX(${rotateXA}deg) rotateY(${rotateYA}deg) scale(${scaleA})`,
          transformOrigin: "center bottom",
          opacity: opacityA,
          boxShadow: `0 ${20 + 40 * p}px ${40 + 60 * p}px rgba(0,0,0,${0.3 + 0.2 * p})`,
          willChange: "transform, opacity",
          borderRadius: `${14 * p}px`,
          overflow: "hidden",
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
