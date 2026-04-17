import React from "react";
import { staticFile } from "remotion";
import { LetterboxPush } from "../components/zoom/LetterboxPush";
import type { ZoomEvent } from "../components/zoom/types";

const EVENTS: ZoomEvent[] = [
  { startMs: 500, durationMs: 5000, scale: 1.2, originX: 0.5, originY: 0.42 },
];

export const LetterboxPushDemo: React.FC = () => {
  return (
    <LetterboxPush
      src={staticFile("sample-video.mp4")}
      events={EVENTS}
      maxBarHeight={0.12}
    />
  );
};
