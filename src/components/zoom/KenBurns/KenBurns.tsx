import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
} from "remotion";
import { Video } from "@remotion/media";
import { msToFrames } from "../../../utils/timing";
import type { KenBurnsProps } from "../types";

export const KenBurns: React.FC<KenBurnsProps> = ({
  src,
  events,
  style,
  direction = "in",
  startScale = 1.0,
  endScale = 1.15,
  driftX = 30,
  driftY = 15,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const isZoomOut = direction === "out";
  const scaleFrom = isZoomOut ? endScale : startScale;
  const scaleTo = isZoomOut ? startScale : endScale;
  const dxFrom = isZoomOut ? driftX : 0;
  const dxTo = isZoomOut ? 0 : driftX;
  const dyFrom = isZoomOut ? driftY : 0;
  const dyTo = isZoomOut ? 0 : driftY;

  let scale: number;
  let translateX: number;
  let translateY: number;
  let originX = 0.5;
  let originY = 0.5;

  if (events.length === 0) {
    // Full-duration continuous mode
    const progress = interpolate(frame, [0, durationInFrames], [0, 1], {
      easing: Easing.inOut(Easing.sin),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

    scale = scaleFrom + (scaleTo - scaleFrom) * progress;
    translateX = dxFrom + (dxTo - dxFrom) * progress;
    translateY = dyFrom + (dyTo - dyFrom) * progress;
  } else {
    // Event-driven mode
    scale = 1;
    translateX = 0;
    translateY = 0;

    for (const event of events) {
      const eventStart = msToFrames(event.startMs, fps);
      const eventEnd = msToFrames(event.startMs + event.durationMs, fps);
      const eventScale = event.scale ?? scaleTo;

      if (frame < eventStart || frame > eventEnd) continue;

      const progress = interpolate(frame, [eventStart, eventEnd], [0, 1], {
        easing: Easing.inOut(Easing.sin),
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });

      scale = 1 + (eventScale - 1) * progress;
      translateX = dxFrom + (dxTo - dxFrom) * progress;
      translateY = dyFrom + (dyTo - dyFrom) * progress;
      originX = event.originX ?? 0.5;
      originY = event.originY ?? 0.5;
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
          transformOrigin: `${originX * 100}% ${originY * 100}%`,
        }}
      />
    </AbsoluteFill>
  );
};
