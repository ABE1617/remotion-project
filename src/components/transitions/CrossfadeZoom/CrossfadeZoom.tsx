import React from "react";
import { AbsoluteFill, interpolate, Easing, OffthreadVideo } from "remotion";
import type { CrossfadeZoomProps } from "../types";

/** Crossfade Zoom — Clip A zooms in slightly + fades, Clip B fades in + zooms out slightly. Premium cross-dissolve with motion. */
export const CrossfadeZoom: React.FC<CrossfadeZoomProps> = ({
  clipA, clipB, progress, style,
}) => {
  const ease = Easing.bezier(0.25, 0.46, 0.45, 0.94);

  const scaleA = interpolate(progress, [0, 1], [1, 1.12], { easing: ease, extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const opacityA = interpolate(progress, [0.1, 0.7], [1, 0], { easing: ease, extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const scaleB = interpolate(progress, [0, 1], [1.12, 1], { easing: ease, extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const opacityB = interpolate(progress, [0.3, 0.9], [0, 1], { easing: ease, extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ overflow: "hidden", ...style }}>
      <AbsoluteFill style={{ transform: `scale(${scaleB})`, opacity: opacityB }}>
        <OffthreadVideo src={clipB} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </AbsoluteFill>
      {opacityA > 0.01 && (
        <AbsoluteFill style={{ transform: `scale(${scaleA})`, opacity: opacityA }}>
          <OffthreadVideo src={clipA} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
