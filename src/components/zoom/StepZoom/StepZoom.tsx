import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Video } from "@remotion/media";
import { msToFrames } from "../../../utils/timing";
import type { StepZoomProps } from "../types";

/**
 * Step Zoom — instant jump cuts between zoom levels. No smooth animation,
 * no easing. Clean, precise editorial reframes that happen on the beat.
 * Like cutting between a wide and tight shot of the same camera.
 */
export const StepZoom: React.FC<StepZoomProps> = ({
  src,
  events,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  let scale = 1;
  let originX = 0.5;
  let originY = 0.5;

  // Find which event is active — events define zoom "levels" to hold at
  for (const event of events) {
    const eventStart = msToFrames(event.startMs, fps);
    const eventEnd = msToFrames(event.startMs + event.durationMs, fps);

    if (frame >= eventStart && frame < eventEnd) {
      scale = event.scale ?? 1.3;
      originX = event.originX ?? 0.5;
      originY = event.originY ?? 0.5;
      break;
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
          transform: `scale(${scale})`,
          transformOrigin: `${originX * 100}% ${originY * 100}%`,
        }}
      />
    </AbsoluteFill>
  );
};
