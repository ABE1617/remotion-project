import React from "react";
import { AbsoluteFill, interpolate, Easing, OffthreadVideo } from "remotion";
import type { MorphProps } from "../types";

/** Morph — Clip A blurs + scales down to a point, Clip B expands + sharpens from that point. */
export const Morph: React.FC<MorphProps> = ({
  clipA, clipB, progress, style,
}) => {
  const ease = Easing.bezier(0.32, 0.72, 0, 1);

  // Clip A: scale down, blur up, fade out
  const scaleA = interpolate(progress, [0, 0.5], [1, 0.7], { easing: ease, extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const blurA = interpolate(progress, [0, 0.45], [0, 12], { easing: ease, extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const opacityA = interpolate(progress, [0.3, 0.55], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Clip B: expand from small, sharpen, fade in
  const scaleB = interpolate(progress, [0.45, 1], [0.7, 1], { easing: Easing.out(Easing.cubic), extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const blurB = interpolate(progress, [0.45, 0.9], [12, 0], { easing: Easing.out(Easing.cubic), extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const opacityB = interpolate(progress, [0.4, 0.6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#000", ...style }}>
      {opacityB > 0.01 && (
        <AbsoluteFill style={{ transform: `scale(${scaleB})`, filter: blurB > 0.2 ? `blur(${blurB}px)` : undefined, opacity: opacityB }}>
          <OffthreadVideo src={clipB} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </AbsoluteFill>
      )}
      {opacityA > 0.01 && (
        <AbsoluteFill style={{ transform: `scale(${scaleA})`, filter: blurA > 0.2 ? `blur(${blurA}px)` : undefined, opacity: opacityA }}>
          <OffthreadVideo src={clipA} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
