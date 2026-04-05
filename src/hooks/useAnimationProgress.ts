import { useCurrentFrame, useVideoConfig } from "remotion";

/**
 * Returns a normalized 0-1 progress value within the current Sequence.
 */
export function useAnimationProgress(): number {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  return frame / Math.max(durationInFrames - 1, 1);
}
