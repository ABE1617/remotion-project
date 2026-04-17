import React from "react";
import { AbsoluteFill, interpolate, Easing, OffthreadVideo } from "remotion";
import { MotionBlurWrap } from "../shared/MotionBlurWrap";
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
 * WhipPan — fast camera-pan simulation with sampled directional motion blur.
 * Velocity at the cut is matched on both halves (mirrored easing) so the
 * eye reads a single continuous camera movement interrupted by a cut.
 *
 * Uses MotionBlurWrap for multi-sample streaks (8 samples), not soft SVG
 * Gaussian blur. The trail actually preserves frame detail behind the
 * current position — the premium look.
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

  // Motion-blur sample offset — projected along the axis. Peaks at the cut.
  // The `blurStrength` is how many pixels the furthest sample trails behind.
  const blurStrength = 140 * intensity;
  const blurA = interpolate(progress, [0, 0.5], [0, blurStrength], {
    easing: easeIn,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const blurB = interpolate(progress, [0.5, 1], [blurStrength, 0], {
    easing: easeOut,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Trail direction matches the element's MOTION direction (axis), so the
  // trail extends behind where the element is heading.
  const blurAOffsetX = axis.x * blurA;
  const blurAOffsetY = axis.y * blurA;
  const blurBOffsetX = axis.x * blurB;
  const blurBOffsetY = axis.y * blurB;

  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#000", ...style }}>
      {!showClipB && (
        <AbsoluteFill
          style={{
            transform: `translate(${translateAX}%, ${translateAY}%) scale(${scaleA})`,
            willChange: "transform",
          }}
        >
          <MotionBlurWrap
            samples={8}
            offsetX={blurAOffsetX}
            offsetY={blurAOffsetY}
          >
            <OffthreadVideo
              src={clipA}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </MotionBlurWrap>
        </AbsoluteFill>
      )}

      {showClipB && (
        <AbsoluteFill
          style={{
            transform: `translate(${translateBX}%, ${translateBY}%) scale(${scaleB})`,
            willChange: "transform",
          }}
        >
          <MotionBlurWrap
            samples={8}
            offsetX={blurBOffsetX}
            offsetY={blurBOffsetY}
          >
            <OffthreadVideo
              src={clipB}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </MotionBlurWrap>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
