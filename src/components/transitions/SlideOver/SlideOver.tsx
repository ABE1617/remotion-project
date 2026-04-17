import React from "react";
import { AbsoluteFill, interpolate, Easing, OffthreadVideo } from "remotion";
import type { SlideOverProps } from "../types";

/** Slide Over — Clip B slides over Clip A with shadow, pushing it aside. */
export const SlideOver: React.FC<SlideOverProps> = ({
  clipA, clipB, progress, style, direction = "left",
}) => {
  const sign = direction === "left" ? -1 : 1;
  const ease = Easing.bezier(0.25, 0.46, 0.45, 0.94);

  // Clip A shifts slightly in opposite direction + scales down
  const translateA = interpolate(progress, [0, 1], [0, sign * -25], { easing: ease, extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const scaleA = interpolate(progress, [0, 1], [1, 0.92], { easing: ease, extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Clip B slides in from edge
  const translateB = interpolate(progress, [0, 1], [-sign * 100, 0], { easing: ease, extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const shadowOpacity = interpolate(progress, [0, 0.5, 1], [0, 0.5, 0.3], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#000", ...style }}>
      <AbsoluteFill style={{ transform: `translateX(${translateA}%) scale(${scaleA})` }}>
        <OffthreadVideo src={clipA} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ transform: `translateX(${translateB}%)`, boxShadow: `${sign * -20}px 0 60px rgba(0,0,0,${shadowOpacity})` }}>
        <OffthreadVideo src={clipB} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
