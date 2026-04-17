import React from "react";
import { AbsoluteFill, Easing, interpolate, OffthreadVideo } from "remotion";
import type { IrisProps } from "../types";

export const IRIS_PEAK_PROGRESS = 0.5;

/**
 * Iris — circular reveal. "in" grows a circle from the focal point to
 * reveal clipB over clipA; "out" shrinks a circle from full-frame to the
 * focal point, letting clipA close over clipB.
 *
 * Cubic ease so the iris opens confidently and lands softly. Optional
 * thin accent ring traces the iris edge — the signature "lens closing"
 * detail you see on cinema bumpers.
 */
export const Iris: React.FC<IrisProps> = ({
  clipA,
  clipB,
  progress,
  style,
  direction = "in",
  focalPoint = { x: 0.5, y: 0.5 },
  accentRing = true,
  accentColor = "#C8551F",
}) => {
  const ease = Easing.bezier(0.4, 0, 0.2, 1);

  // Max radius in % — 71 covers a 50%,50% anchor corner-to-corner (~70.7%).
  // Use 80 for safety with off-center focal points and for overshoot.
  const MAX_R = 80;

  const radiusPct =
    direction === "in"
      ? interpolate(progress, [0, 1], [0, MAX_R], {
          easing: ease,
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : interpolate(progress, [0, 1], [MAX_R, 0], {
          easing: ease,
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

  const fx = `${focalPoint.x * 100}%`;
  const fy = `${focalPoint.y * 100}%`;
  const clipPath = `circle(${radiusPct}% at ${fx} ${fy})`;

  // Accent ring — a thin circle at the iris edge. Using box-shadow on an
  // inner absolute div gives a crisp edge without a separate SVG.
  const ringSize = radiusPct * 2; // diameter as percent of frame
  const showRing = accentRing && radiusPct > 0.5 && radiusPct < MAX_R - 0.5;

  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#000", ...style }}>
      {/* Background layer — whichever clip is being revealed / covered */}
      <AbsoluteFill>
        <OffthreadVideo
          src={direction === "in" ? clipA : clipB}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </AbsoluteFill>

      {/* Foreground layer, clipped to the iris circle */}
      <AbsoluteFill style={{ clipPath, WebkitClipPath: clipPath }}>
        <OffthreadVideo
          src={direction === "in" ? clipB : clipA}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </AbsoluteFill>

      {/* Accent ring outlining the iris edge */}
      {showRing ? (
        <div
          style={{
            position: "absolute",
            left: fx,
            top: fy,
            width: `${ringSize}%`,
            height: `${ringSize}%`,
            borderRadius: "50%",
            border: `3px solid ${accentColor}`,
            boxShadow: `0 0 12px ${accentColor}`,
            transform: "translate(-50%, -50%)",
            pointerEvents: "none",
          }}
        />
      ) : null}
    </AbsoluteFill>
  );
};
