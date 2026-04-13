import React from "react";
import { AbsoluteFill, staticFile } from "remotion";
import { Video } from "@remotion/media";
import { EditorialPop } from "./EditorialPop";
import type { TikTokPage } from "../../types/captions";

const PAGES: TikTokPage[] = [
  {
    text: "your videos like",
    startMs: 100,
    durationMs: 1800,
    tokens: [
      { text: "your", fromMs: 100, toMs: 500 },
      { text: "videos", fromMs: 500, toMs: 1200 },
      { text: "like", fromMs: 1200, toMs: 1900 },
    ],
  },
  {
    text: "need better captions",
    startMs: 2000,
    durationMs: 1800,
    tokens: [
      { text: "need", fromMs: 2000, toMs: 2500 },
      { text: "better", fromMs: 2500, toMs: 3000 },
      { text: "captions", fromMs: 3000, toMs: 3800 },
    ],
  },
  {
    text: "to stop the scroll",
    startMs: 3900,
    durationMs: 1600,
    tokens: [
      { text: "to", fromMs: 3900, toMs: 4100 },
      { text: "stop", fromMs: 4100, toMs: 4500 },
      { text: "the", fromMs: 4500, toMs: 4700 },
      { text: "scroll", fromMs: 4700, toMs: 5500 },
    ],
  },
  {
    text: "and boost engagement",
    startMs: 5600,
    durationMs: 1600,
    tokens: [
      { text: "and", fromMs: 5600, toMs: 5800 },
      { text: "boost", fromMs: 5800, toMs: 6300 },
      { text: "engagement", fromMs: 6300, toMs: 7200 },
    ],
  },
  {
    text: "this is how you grow",
    startMs: 7300,
    durationMs: 1600,
    tokens: [
      { text: "this", fromMs: 7300, toMs: 7500 },
      { text: "is", fromMs: 7500, toMs: 7700 },
      { text: "how", fromMs: 7700, toMs: 7900 },
      { text: "you", fromMs: 7900, toMs: 8100 },
      { text: "grow", fromMs: 8100, toMs: 8900 },
    ],
  },
];

const KEYWORDS = ["videos", "captions", "stop", "scroll", "boost", "engagement", "grow"];

export const EditorialPopDemo: React.FC = () => {
  return (
    <AbsoluteFill>
      <Video
        src={staticFile("sample-video.mp4")}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
      <EditorialPop pages={PAGES} keywords={KEYWORDS} position="bottom" />
    </AbsoluteFill>
  );
};
