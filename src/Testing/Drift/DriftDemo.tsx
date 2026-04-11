import React from "react";
import { AbsoluteFill, staticFile } from "remotion";
import { Video } from "@remotion/media";
import { Drift } from "./Drift";
import type { TikTokPage } from "../../types/captions";

const PAGES: TikTokPage[] = [
  {
    text: "they stop the scroll boost watch time",
    startMs: 200,
    durationMs: 2800,
    tokens: [
      { text: "they", fromMs: 200, toMs: 500 },
      { text: "stop", fromMs: 500, toMs: 900 },
      { text: "the", fromMs: 900, toMs: 1150 },
      { text: "scroll,", fromMs: 1150, toMs: 1600 },
      { text: "boost", fromMs: 1600, toMs: 2000 },
      { text: "watch", fromMs: 2000, toMs: 2500 },
      { text: "time", fromMs: 2500, toMs: 2900 },
    ],
  },
  {
    text: "and make people actually listen",
    startMs: 3100,
    durationMs: 2400,
    tokens: [
      { text: "and", fromMs: 3100, toMs: 3350 },
      { text: "make", fromMs: 3350, toMs: 3650 },
      { text: "people", fromMs: 3650, toMs: 4050 },
      { text: "actually", fromMs: 4050, toMs: 4500 },
      { text: "listen", fromMs: 4500, toMs: 5400 },
    ],
  },
  {
    text: "this is how you win attention",
    startMs: 5600,
    durationMs: 2200,
    tokens: [
      { text: "this", fromMs: 5600, toMs: 5850 },
      { text: "is", fromMs: 5850, toMs: 6000 },
      { text: "how", fromMs: 6000, toMs: 6250 },
      { text: "you", fromMs: 6250, toMs: 6450 },
      { text: "win", fromMs: 6450, toMs: 6800 },
      { text: "attention", fromMs: 6800, toMs: 7700 },
    ],
  },
];

export const DriftDemo: React.FC = () => {
  return (
    <AbsoluteFill>
      <Video
        src={staticFile("sample-video.mp4")}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
      <Drift
        pages={PAGES}
        highlightWords={["stop", "boost", "watch", "win", "attention"]}
      />
    </AbsoluteFill>
  );
};
