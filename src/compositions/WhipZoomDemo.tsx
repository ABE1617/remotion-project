import React from "react";
import { staticFile } from "remotion";
import { SnapReframe } from "../components/zoom/SnapReframe";
import type { ZoomEvent } from "../components/zoom/types";

const EVENTS: ZoomEvent[] = [
  { startMs: 1500, durationMs: 2000, scale: 1.35, originX: 0.5, originY: 0.38 },
  { startMs: 5500, durationMs: 1800, scale: 1.25, originX: 0.48, originY: 0.42 },
];

export const WhipZoomDemo: React.FC = () => {
  return (
    <SnapReframe src={staticFile("sample-video.mp4")} events={EVENTS} />
  );
};
