import React from "react";
import { AbsoluteFill, Easing, interpolate, OffthreadVideo } from "remotion";
import type { DollyZoomProps } from "../types";

export const DOLLY_ZOOM_PEAK_PROGRESS = 0.5;

/**
 * DollyZoom — Hitchcock vertigo transition.
 *
 * The optical illusion on a real camera is "camera dollies back while lens
 * zooms in": the subject stays the same size but the background stretches
 * forward. On a flat video clip we can't separate subject from background,
 * so we fake the vertigo feel with asymmetric scaling: scaleY grows faster
 * than scaleX, producing the signature vertical-stretch warp around the
 * focal point. Incoming clip reveals with a small settling zoom.
 *
 * "in"  = outgoing clip pushes IN (scales up, stretches); "out" flips so
 *         the incoming clip is the one that stretches.
 */
export const DollyZoom: React.FC<DollyZoomProps> = ({
  clipA,
  clipB,
  progress,
  style,
  direction = "in",
  focalPoint = { x: 0.5, y: 0.5 },
  intensity = 0.7,
}) => {
  const easeIn = Easing.bezier(0.5, 0, 0.75, 0);
  const easeOut = Easing.bezier(0.25, 1, 0.5, 1);

  const showB = progress >= DOLLY_ZOOM_PEAK_PROGRESS;

  // Vertigo stretch math. scaleY goes up, scaleX goes slightly down — the
  // ratio difference is what creates the optical vertigo warp.
  // At intensity 0.7: scaleY reaches 1.35, scaleX drops to 0.895.
  const yStretch = 0.5 * intensity;
  const xSqueeze = 0.15 * intensity;

  const scaleYA =
    direction === "in"
      ? interpolate(progress, [0, 0.5], [1, 1 + yStretch], {
          easing: easeIn,
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : 1;
  const scaleXA =
    direction === "in"
      ? interpolate(progress, [0, 0.5], [1, 1 - xSqueeze], {
          easing: easeIn,
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : 1;

  const scaleYB =
    direction === "in"
      ? interpolate(progress, [0.5, 1], [1.08, 1], {
          easing: easeOut,
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : interpolate(progress, [0.5, 1], [1 + yStretch, 1], {
          easing: easeOut,
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
  const scaleXB =
    direction === "in"
      ? interpolate(progress, [0.5, 1], [1.05, 1], {
          easing: easeOut,
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : interpolate(progress, [0.5, 1], [1 - xSqueeze, 1], {
          easing: easeOut,
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

  const origin = `${focalPoint.x * 100}% ${focalPoint.y * 100}%`;

  const activeClip = showB ? clipB : clipA;
  const scaleX = showB ? scaleXB : scaleXA;
  const scaleY = showB ? scaleYB : scaleYA;

  // Subtle opacity pulse at the cut — the beat under the visual warp.
  const pulse = interpolate(progress, [0.46, 0.5, 0.54], [1, 0.94, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#000", ...style }}>
      <AbsoluteFill
        style={{
          transform: `scale(${scaleX}, ${scaleY})`,
          transformOrigin: origin,
          opacity: pulse,
          willChange: "transform",
        }}
      >
        <OffthreadVideo
          src={activeClip}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
