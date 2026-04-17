import React from "react";
import { staticFile } from "remotion";
import { CircleMask } from "../components/zoom/CircleMask";
import type { ZoomEvent } from "../components/zoom/types";

const EVENTS: ZoomEvent[] = [
  { startMs: 800, durationMs: 5000, scale: 1.5, originX: 0.5, originY: 0.4 },
];

export const CircleMaskDemo: React.FC = () => {
  return (
    <CircleMask
      src={staticFile("sample-video.mp4")}
      events={EVENTS}
      innerScale={1.5}
    />
  );
};
