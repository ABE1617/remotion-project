import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
} from "remotion";
import { Video } from "@remotion/media";
import { msToFrames } from "../../../utils/timing";
import type { BreatheProps } from "../types";

/**
 * Breathe — ultra-subtle continuous scale oscillation that gives static
 * shots a hint of life. Barely perceptible. Like the micro-movements
 * a stabilized camera naturally has. Premium brand film feel.
 */
export const Breathe: React.FC<BreatheProps> = ({
  src,
  events,
  style,
  amplitude = 1.0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  let scale = 1;
  let translateX = 0;
  let translateY = 0;

  if (events.length === 0) {
    // Full-duration breathe
    const t = frame / fps;

    // Subtle scale pulse — always >= 1.0 (never zooms out past frame)
    scale =
      1.03 +
      0.018 * amplitude * Math.sin(t * 0.7) +
      0.008 * amplitude * Math.sin(t * 1.6);

    // Tiny lateral drift
    translateX = 4 * amplitude * Math.sin(t * 0.5);
    translateY = 3 * amplitude * Math.sin(t * 0.65);
  } else {
    for (const event of events) {
      const eventStart = msToFrames(event.startMs, fps);
      const eventEnd = msToFrames(event.startMs + event.durationMs, fps);

      if (frame < eventStart || frame > eventEnd) continue;

      const eventDuration = eventEnd - eventStart;
      const localFrame = frame - eventStart;
      const t = localFrame / fps;

      // Smooth fade envelope so breathe eases in and out
      const fadeIn = interpolate(
        localFrame,
        [0, Math.min(15, eventDuration / 3)],
        [0, 1],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
      );
      const fadeOut = interpolate(
        localFrame,
        [eventDuration - Math.min(15, eventDuration / 3), eventDuration],
        [1, 0],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
      );
      const envelope = fadeIn * fadeOut;
      const a = amplitude * envelope;

      scale =
        1.03 +
        0.018 * a * Math.sin(t * 0.7) +
        0.008 * a * Math.sin(t * 1.6);

      translateX = 4 * a * Math.sin(t * 0.5);
      translateY = 3 * a * Math.sin(t * 0.65);
    }
  }

  return (
    <AbsoluteFill style={{ overflow: "hidden", ...style }}>
      <Video
        src={src}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${scale}) translate(${translateX}px, ${translateY}px)`,
          transformOrigin: "center center",
        }}
      />
    </AbsoluteFill>
  );
};
