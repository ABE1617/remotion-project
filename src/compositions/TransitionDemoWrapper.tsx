import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
} from "remotion";

/**
 * Shared wrapper for transition demos. Computes progress (0→1)
 * over the transition window. Children receive clipA, clipB, progress.
 */
interface Props {
  transitionStartMs?: number;
  transitionDurationMs?: number;
  children: (props: { progress: number }) => React.ReactNode;
}

export const TransitionDemoWrapper: React.FC<Props> = ({
  transitionStartMs = 3000,
  transitionDurationMs = 2500,
  children,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const startFrame = Math.round((transitionStartMs / 1000) * fps);
  const endFrame = Math.round(((transitionStartMs + transitionDurationMs) / 1000) * fps);

  const progress = interpolate(frame, [startFrame, endFrame], [0, 1], {
    easing: Easing.inOut(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return <>{children({ progress })}</>;
};
