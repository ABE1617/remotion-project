import React from "react";
import { AbsoluteFill, interpolate, Easing, OffthreadVideo } from "remotion";
import type { FlipProps } from "../types";

/** Flip — Full 3D card flip. Clip A on front, Clip B on back. */
export const Flip: React.FC<FlipProps> = ({
  clipA, clipB, progress, style, direction = "horizontal",
}) => {
  const ease = Easing.bezier(0.25, 0.46, 0.45, 0.94);
  const axis = direction === "horizontal" ? "Y" : "X";
  const rotation = interpolate(progress, [0, 1], [0, 180], { easing: ease, extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const showFront = progress < 0.5;

  return (
    <AbsoluteFill style={{ overflow: "hidden", perspective: 1400, ...style }}>
      <AbsoluteFill style={{ transformStyle: "preserve-3d", transform: `rotate${axis}(${rotation}deg)` }}>
        {/* Front — Clip A */}
        <AbsoluteFill style={{ backfaceVisibility: "hidden" }}>
          {showFront && (
            <OffthreadVideo src={clipA} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          )}
        </AbsoluteFill>
        {/* Back — Clip B (pre-rotated so it's right-side-up when flipped) */}
        <AbsoluteFill style={{ backfaceVisibility: "hidden", transform: `rotate${axis}(180deg)` }}>
          {!showFront && (
            <OffthreadVideo src={clipB} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          )}
        </AbsoluteFill>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
