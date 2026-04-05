import type { SpringConfig } from "remotion";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { SPRING_SNAPPY } from "../utils/animations";

/**
 * Returns a spring value (0 -> 1) from a given start frame.
 * Useful for entry animations.
 */
export function useSpringEntry(
  delay: number = 0,
  config: SpringConfig = SPRING_SNAPPY,
): number {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return spring({
    fps,
    frame: frame - delay,
    config,
  });
}
