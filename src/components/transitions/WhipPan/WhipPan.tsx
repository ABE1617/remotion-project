import React from "react";
import { AbsoluteFill, interpolate, Easing, OffthreadVideo } from "remotion";
import type { WhipPanProps } from "../types";

export const WHIP_PAN_PEAK_PROGRESS = 0.5;

type Axis = { x: number; y: number };

const DIRECTION_AXIS: Record<NonNullable<WhipPanProps["direction"]>, Axis> = {
  "horizontal-right": { x: 1, y: 0 },
  "horizontal-left": { x: -1, y: 0 },
  "vertical-down": { x: 0, y: 1 },
  "vertical-up": { x: 0, y: -1 },
  "diagonal-tl-br": { x: 0.7071, y: 0.7071 },
  "diagonal-tr-bl": { x: -0.7071, y: 0.7071 },
};

/**
 * WhipPan — fast camera-pan simulation with directional motion blur.
 * Velocity at the cut is matched on both halves (mirrored easing) so the
 * eye reads a single continuous camera movement interrupted by a cut.
 */
export const WhipPan: React.FC<WhipPanProps> = ({
  clipA,
  clipB,
  progress,
  style,
  direction = "horizontal-right",
  intensity = 1.0,
}) => {
  const axis = DIRECTION_AXIS[direction];
  const showClipB = progress >= WHIP_PAN_PEAK_PROGRESS;

  // Velocity-mirrored easing across the cut.
  const easeIn = Easing.bezier(0.4, 0, 1, 1); // accelerating out (clipA)
  const easeOut = Easing.bezier(0, 0, 0.6, 1); // decelerating in (clipB)

  // Translation amplitude (percent of viewport). Amplified slightly by intensity.
  const amp = 120 * intensity;

  // clipA: 0 → -amp across its axis during progress 0..0.5
  const travelA = interpolate(progress, [0, 0.5], [0, -amp], {
    easing: easeIn,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const translateAX = travelA * axis.x;
  const translateAY = travelA * axis.y;

  // clipB: +amp → 0 during progress 0.5..1
  const travelB = interpolate(progress, [0.5, 1], [amp, 0], {
    easing: easeOut,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const translateBX = travelB * axis.x;
  const translateBY = travelB * axis.y;

  // Scale peak at the cut (1.04) adding weight at peak motion
  const scaleA = interpolate(progress, [0, 0.45, 0.5], [1, 1.04, 1.04], {
    easing: easeIn,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const scaleB = interpolate(progress, [0.5, 1], [1.04, 1], {
    easing: easeOut,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Blur magnitude — mirrored around the cut. Peaks at progress 0.5.
  const blurPeak = 60 * intensity;
  const blurA = interpolate(progress, [0, 0.5], [0, blurPeak], {
    easing: easeIn,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const blurB = interpolate(progress, [0.5, 1], [blurPeak, 0], {
    easing: easeOut,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Directional blur — project magnitude onto axis so diagonals blur both axes.
  const blurAX = Math.abs(axis.x) * blurA;
  const blurAY = Math.abs(axis.y) * blurA;
  const blurBX = Math.abs(axis.x) * blurB;
  const blurBY = Math.abs(axis.y) * blurB;

  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#000", ...style }}>
      <svg style={{ position: "absolute", width: 0, height: 0 }} aria-hidden>
        <defs>
          <filter id="whip-blur-a" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur
              stdDeviation={`${blurAX} ${blurAY}`}
              edgeMode="duplicate"
            />
          </filter>
          <filter id="whip-blur-b" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur
              stdDeviation={`${blurBX} ${blurBY}`}
              edgeMode="duplicate"
            />
          </filter>
        </defs>
      </svg>

      {!showClipB && (
        <AbsoluteFill
          style={{
            transform: `translate(${translateAX}%, ${translateAY}%) scale(${scaleA})`,
            filter: "url(#whip-blur-a)",
            willChange: "transform, filter",
          }}
        >
          <OffthreadVideo
            src={clipA}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </AbsoluteFill>
      )}

      {showClipB && (
        <AbsoluteFill
          style={{
            transform: `translate(${translateBX}%, ${translateBY}%) scale(${scaleB})`,
            filter: "url(#whip-blur-b)",
            willChange: "transform, filter",
          }}
        >
          <OffthreadVideo
            src={clipB}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
