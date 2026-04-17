import React from "react";
import { AbsoluteFill, interpolate, Easing, OffthreadVideo } from "remotion";
import type { CardSwipeProps } from "../types";

/** Card Swipe — Clip A swipes off with 3D tilt like dismissing an app, Clip B rises from behind. */
export const CardSwipe: React.FC<CardSwipeProps> = ({
  clipA, clipB, progress, style, direction = "left",
}) => {
  const sign = direction === "left" ? -1 : 1;
  const ease = Easing.bezier(0.32, 0.72, 0, 1);

  const translateA = interpolate(progress, [0, 1], [0, sign * 120], { easing: ease, extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const rotateA = interpolate(progress, [0, 1], [0, sign * -15], { easing: ease, extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const scaleA = interpolate(progress, [0, 1], [1, 0.88], { easing: ease, extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const opacityA = interpolate(progress, [0.5, 1], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const translateB = interpolate(progress, [0, 1], [60, 0], { easing: ease, extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const scaleB = interpolate(progress, [0, 1], [0.92, 1], { easing: ease, extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const opacityB = interpolate(progress, [0, 0.3], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#000", ...style }}>
      <AbsoluteFill style={{ transform: `translateY(${translateB}px) scale(${scaleB})`, opacity: opacityB, borderRadius: 20, overflow: "hidden" }}>
        <OffthreadVideo src={clipB} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </AbsoluteFill>
      {opacityA > 0.01 && (
        <AbsoluteFill style={{ transform: `translateX(${translateA}%) rotate(${rotateA}deg) scale(${scaleA})`, opacity: opacityA, borderRadius: 20, overflow: "hidden", boxShadow: `0 20px 60px rgba(0,0,0,${0.4 * (1 - progress)})` }}>
          <OffthreadVideo src={clipA} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
