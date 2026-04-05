import { interpolateColors, useCurrentFrame, useVideoConfig } from "remotion";

/**
 * Smoothly interpolates between colors over the duration of the current Sequence.
 */
export function useColorInterpolation(colors: readonly string[]): string {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  if (colors.length < 2) {
    return colors[0] ?? "#FFFFFF";
  }

  const step = durationInFrames / (colors.length - 1);
  const inputRange = colors.map((_, i) => i * step);

  return interpolateColors(frame, inputRange, [...colors]);
}
