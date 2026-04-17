import React from "react";
import { staticFile } from "remotion";
import { SplitFrame } from "../components/zoom/SplitFrame";
import type { ZoomEvent } from "../components/zoom/types";

const EVENTS: ZoomEvent[] = [
  { startMs: 500, durationMs: 5000 },
];

export const ElasticBounceDemo: React.FC = () => {
  return (
    <SplitFrame
      src={staticFile("sample-video.mp4")}
      events={EVENTS}
      panels={2}
      gap={6}
    />
  );
};
