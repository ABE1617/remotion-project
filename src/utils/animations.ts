import type { SpringConfig } from "remotion";
import { interpolate, spring } from "remotion";

// --- Spring presets ---

export const SPRING_SNAPPY: SpringConfig = {
  damping: 15,
  mass: 0.5,
  stiffness: 200,
  overshootClamping: false,
};

export const SPRING_BOUNCY: SpringConfig = {
  damping: 8,
  mass: 0.8,
  stiffness: 150,
  overshootClamping: false,
};

export const SPRING_GENTLE: SpringConfig = {
  damping: 20,
  mass: 1,
  stiffness: 100,
  overshootClamping: false,
};

export const SPRING_ELASTIC: SpringConfig = {
  damping: 6,
  mass: 0.5,
  stiffness: 180,
  overshootClamping: false,
};

// --- Interpolation helpers ---

export function fadeIn(
  frame: number,
  startFrame: number,
  duration: number,
): number {
  return interpolate(frame, [startFrame, startFrame + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
}

export function fadeOut(
  frame: number,
  startFrame: number,
  duration: number,
): number {
  return interpolate(frame, [startFrame, startFrame + duration], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
}

export function slideIn(
  frame: number,
  fps: number,
  config: SpringConfig = SPRING_SNAPPY,
): number {
  return spring({ fps, frame, config });
}

export function scaleSpring(
  frame: number,
  fps: number,
  config: SpringConfig = SPRING_BOUNCY,
): number {
  return spring({ fps, frame, config });
}

export function staggeredDelay(index: number, delayPerItem: number): number {
  return index * delayPerItem;
}
