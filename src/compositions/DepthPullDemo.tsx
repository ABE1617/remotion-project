import React from "react";
import { staticFile } from "remotion";
import { DepthPull } from "../components/zoom/DepthPull";
import type { ZoomEvent } from "../components/zoom/types";

const EVENTS: ZoomEvent[] = [
  { startMs: 500, durationMs: 7000, scale: 1.15, originX: 0.5, originY: 0.42 },
];

export const DepthPullDemo: React.FC = () => {
  return (
    <DepthPull
      src={staticFile("sample-video.mp4")}
      events={EVENTS}
      edgeBlur={4}
      frameLines={true}
    />
  );
};
