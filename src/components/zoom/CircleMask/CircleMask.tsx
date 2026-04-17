import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
  OffthreadVideo,
} from "remotion";
import { msToFrames } from "../../../utils/timing";
import type { CircleMaskProps } from "../types";

/**
 * Circle Mask Zoom — circular window expands from center revealing
 * a zoomed-in view of the video, with the normal video visible outside.
 * Smooth expand, hold, then contract back. Clean, editorial.
 */
export const CircleMask: React.FC<CircleMaskProps> = ({
  src,
  events,
  style,
  innerScale = 1.5,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  let maskProgress = 0;
  let originX = 0.5;
  let originY = 0.45;
  let eventInnerScale = innerScale;

  if (events.length === 0) {
    const rampIn = Math.round(durationInFrames * 0.3);
    const holdEnd = Math.round(durationInFrames * 0.65);

    if (frame < rampIn) {
      maskProgress = interpolate(frame, [0, rampIn], [0, 1], {
        easing: Easing.out(Easing.cubic),
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
    } else if (frame < holdEnd) {
      maskProgress = 1;
    } else {
      maskProgress = interpolate(frame, [holdEnd, durationInFrames], [1, 0], {
        easing: Easing.in(Easing.cubic),
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
    }
  } else {
    for (const event of events) {
      const eventStart = msToFrames(event.startMs, fps);
      const eventEnd = msToFrames(event.startMs + event.durationMs, fps);
      if (frame < eventStart || frame > eventEnd) continue;

      eventInnerScale = event.scale ?? innerScale;
      originX = event.originX ?? 0.5;
      originY = event.originY ?? 0.45;

      const eventDuration = eventEnd - eventStart;
      const rampIn = eventStart + Math.round(eventDuration * 0.25);
      const holdEnd = eventStart + Math.round(eventDuration * 0.65);

      if (frame < rampIn) {
        maskProgress = interpolate(frame, [eventStart, rampIn], [0, 1], {
          easing: Easing.out(Easing.cubic),
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
      } else if (frame < holdEnd) {
        maskProgress = 1;
      } else {
        maskProgress = interpolate(frame, [holdEnd, eventEnd], [1, 0], {
          easing: Easing.in(Easing.cubic),
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
      }
    }
  }

  // Circle radius as % of frame — 0% to 55% (covers most of the frame)
  const circleRadius = 55 * maskProgress;

  return (
    <AbsoluteFill style={{ overflow: "hidden", ...style }}>
      {/* Background: normal video */}
      <OffthreadVideo
        src={src}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />

      {/* Darken background when circle is active */}
      <AbsoluteFill
        style={{
          backgroundColor: `rgba(0,0,0,${0.3 * maskProgress})`,
          pointerEvents: "none",
        }}
      />

      {/* Circle window: zoomed-in video */}
      {maskProgress > 0.01 && (
        <AbsoluteFill
          style={{
            clipPath: `circle(${circleRadius}% at ${originX * 100}% ${originY * 100}%)`,
          }}
        >
          <OffthreadVideo
            src={src}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transform: `scale(${1 + (eventInnerScale - 1) * maskProgress})`,
              transformOrigin: `${originX * 100}% ${originY * 100}%`,
            }}
          />
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
