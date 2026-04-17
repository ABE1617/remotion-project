import React from "react";
import { staticFile } from "remotion";
import { StepZoom } from "../components/zoom/StepZoom";
import type { ZoomEvent } from "../components/zoom/types";

// Clean jump cuts between framings — wide, tight, wide, tighter
const EVENTS: ZoomEvent[] = [
  { startMs: 0, durationMs: 1500, scale: 1.0 },
  { startMs: 1500, durationMs: 1200, scale: 1.35, originX: 0.5, originY: 0.38 },
  { startMs: 2700, durationMs: 1500, scale: 1.0 },
  { startMs: 4200, durationMs: 1000, scale: 1.5, originX: 0.48, originY: 0.36 },
  { startMs: 5200, durationMs: 1300, scale: 1.15, originX: 0.52, originY: 0.42 },
  { startMs: 6500, durationMs: 1200, scale: 1.4, originX: 0.5, originY: 0.35 },
  { startMs: 7700, durationMs: 2300, scale: 1.0 },
];

export const StepZoomDemo: React.FC = () => {
  return (
    <StepZoom src={staticFile("sample-video.mp4")} events={EVENTS} />
  );
};
