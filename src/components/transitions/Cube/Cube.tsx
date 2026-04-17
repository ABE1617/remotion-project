import React from "react";
import { AbsoluteFill, interpolate, Easing, OffthreadVideo } from "remotion";
import type { CubeProps } from "../types";

/** Cube — Frame rotates like a 3D cube to reveal Clip B on the next face. */
export const Cube: React.FC<CubeProps> = ({
  clipA, clipB, progress, style, direction = "left",
}) => {
  const sign = direction === "left" ? -1 : 1;
  const ease = Easing.bezier(0.25, 0.46, 0.45, 0.94);

  const rotation = interpolate(progress, [0, 1], [0, sign * 90], { easing: ease, extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Half the frame width acts as the cube face depth
  const faceOffset = 540; // half of 1080

  return (
    <AbsoluteFill style={{ overflow: "hidden", perspective: 1500, ...style }}>
      <AbsoluteFill style={{ transformStyle: "preserve-3d", transform: `rotateY(${rotation}deg)`, transformOrigin: "center center" }}>
        {/* Front face — Clip A */}
        <AbsoluteFill style={{ backfaceVisibility: "hidden", transform: `translateZ(${faceOffset}px)` }}>
          <OffthreadVideo src={clipA} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </AbsoluteFill>
        {/* Side face — Clip B */}
        <AbsoluteFill style={{ backfaceVisibility: "hidden", transform: `rotateY(${-sign * 90}deg) translateZ(${faceOffset}px)` }}>
          <OffthreadVideo src={clipB} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </AbsoluteFill>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
