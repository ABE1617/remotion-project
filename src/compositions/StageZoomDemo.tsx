import React from "react";
import { staticFile } from "remotion";
import { StageZoom } from "../components/zoom/StageZoom";
import type { ZoomEvent } from "../components/zoom/types";

const EVENTS: ZoomEvent[] = [
  { startMs: 500, durationMs: 7000, scale: 1.35, originX: 0.5, originY: 0.4 },
];

export const StageZoomDemo: React.FC = () => {
  return (
    <StageZoom
      src={staticFile("sample-video.mp4")}
      events={EVENTS}
      firstStage={1.15}
      secondStage={1.35}
    />
  );
};
