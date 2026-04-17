import React from "react";
import { staticFile } from "remotion";
import { AnamorphicBreathe } from "../components/zoom/AnamorphicBreathe";
import type { ZoomEvent } from "../components/zoom/types";

const EVENTS: ZoomEvent[] = [
  { startMs: 500, durationMs: 6000, scale: 1.12, originX: 0.5, originY: 0.42 },
];

export const AnamorphicBreatheDemo: React.FC = () => {
  return (
    <AnamorphicBreathe
      src={staticFile("sample-video.mp4")}
      events={EVENTS}
      caStrength={2.5}
      streakIntensity={0.6}
      grainOpacity={0.04}
    />
  );
};
