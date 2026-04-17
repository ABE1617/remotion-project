import React from "react";
import { staticFile } from "remotion";
import { SmoothPush } from "../components/zoom/SmoothPush";
import type { ZoomEvent } from "../components/zoom/types";

const EVENTS: ZoomEvent[] = [
  { startMs: 500, durationMs: 4000, scale: 1.2, originX: 0.5, originY: 0.4 },
  { startMs: 6000, durationMs: 3500, scale: 1.15, originX: 0.45, originY: 0.45 },
];

export const PunchZoomDemo: React.FC = () => {
  return (
    <SmoothPush src={staticFile("sample-video.mp4")} events={EVENTS} />
  );
};
