import React from "react";
import { AbsoluteFill, interpolate, Easing, OffthreadVideo } from "remotion";
import { MotionBlurWrap } from "../shared/MotionBlurWrap";
import type { MotionBlurSlideProps } from "../types";

export const MOTION_BLUR_SLIDE_PEAK_PROGRESS = 0.5;

/**
 * MotionBlurSlide — a refined directional slide where both clips travel
 * the same direction simultaneously, with asymmetric motion blur peaks
 * (clipA peaks at 0.4, clipB at 0.6) that sell the "passing past each
 * other" page-turn feel. A calmer cousin of WhipPan.
 *
 * Uses MotionBlurWrap for multi-sample directional streaks (not soft
 * isotropic blur). Streaks follow the slide direction for a real sense
 * of motion rather than a generic "blurry everything" look.
 */
export const MotionBlurSlide: React.FC<MotionBlurSlideProps> = ({
  clipA,
  clipB,
  progress,
  style,
  direction = "left",
  blurStrength = 24,
  gap = 0,
}) => {
  const ease = Easing.bezier(0.4, 0, 0.2, 1);

  const isHorizontal = direction === "left" || direction === "right";
  // Sign describes the direction the clips travel TOWARD.
  // "left": clipA goes to -100%, clipB comes from +100%.
  const sign = direction === "left" || direction === "up" ? -1 : 1;

  // Translate as a percentage of the viewport, plus a gap contribution.
  const translateAPct = interpolate(progress, [0, 1], [0, sign * 100], {
    easing: ease,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const translateBPct = interpolate(progress, [0, 1], [sign * -100, 0], {
    easing: ease,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const gapOffsetA = interpolate(progress, [0, 1], [0, sign * gap], {
    easing: ease,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const gapOffsetB = interpolate(progress, [0, 1], [sign * -gap, 0], {
    easing: ease,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Asymmetric triangular blur peaks — clipA peaks at 0.4, clipB at 0.6.
  // Scale the pixel magnitude up vs the old soft-blur value because sampled
  // blur reads less strong per-unit than a Gaussian at the same stdDeviation.
  const sampleStrength = blurStrength * 4;
  const clipABlur = interpolate(
    progress,
    [0, 0.4, 1],
    [0, sampleStrength, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const clipBBlur = interpolate(
    progress,
    [0, 0.6, 1],
    [0, sampleStrength, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const transformA = isHorizontal
    ? `translateX(calc(${translateAPct}% + ${gapOffsetA}px))`
    : `translateY(calc(${translateAPct}% + ${gapOffsetA}px))`;
  const transformB = isHorizontal
    ? `translateX(calc(${translateBPct}% + ${gapOffsetB}px))`
    : `translateY(calc(${translateBPct}% + ${gapOffsetB}px))`;

  // Trail direction — matches the slide direction so streaks extend behind
  // where each clip is heading.
  const axisX = isHorizontal ? sign : 0;
  const axisY = isHorizontal ? 0 : sign;

  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#000", ...style }}>
      <AbsoluteFill style={{ transform: transformA, willChange: "transform" }}>
        <MotionBlurWrap
          samples={7}
          offsetX={axisX * clipABlur}
          offsetY={axisY * clipABlur}
        >
          <OffthreadVideo
            src={clipA}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </MotionBlurWrap>
      </AbsoluteFill>
      <AbsoluteFill style={{ transform: transformB, willChange: "transform" }}>
        <MotionBlurWrap
          samples={7}
          offsetX={axisX * clipBBlur}
          offsetY={axisY * clipBBlur}
        >
          <OffthreadVideo
            src={clipB}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </MotionBlurWrap>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
