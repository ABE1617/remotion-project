import React from "react";
import { staticFile } from "remotion";
import { FocusWindow } from "../components/zoom/FocusWindow";
import type { ZoomEvent } from "../components/zoom/types";

const EVENTS: ZoomEvent[] = [
  { startMs: 800, durationMs: 4000, scale: 1.8, originX: 0.5, originY: 0.38 },
  { startMs: 6000, durationMs: 3500, scale: 2.0, originX: 0.48, originY: 0.35 },
];

export const DollyZoomDemo: React.FC = () => {
  return (
    <FocusWindow
      src={staticFile("sample-video.mp4")}
      events={EVENTS}
      windowScale={0.72}
      bgScale={1.8}
    />
  );
};
