import React from "react";
import { AbsoluteFill, staticFile } from "remotion";
import { Video } from "@remotion/media";
import { Magazine } from "./Magazine";
import type { TikTokPage } from "../../types/captions";

const PAGES: TikTokPage[] = [
  {
    text: "nobody talks about this",
    startMs: 100,
    durationMs: 1800,
    tokens: [
      { text: "nobody", fromMs: 100, toMs: 500 },
      { text: "talks", fromMs: 500, toMs: 900 },
      { text: "about", fromMs: 900, toMs: 1300 },
      { text: "this", fromMs: 1300, toMs: 1900 },
    ],
  },
  {
    text: "but your content is dying",
    startMs: 2000,
    durationMs: 1800,
    tokens: [
      { text: "but", fromMs: 2000, toMs: 2300 },
      { text: "your", fromMs: 2300, toMs: 2600 },
      { text: "content", fromMs: 2600, toMs: 3000 },
      { text: "is", fromMs: 3000, toMs: 3200 },
      { text: "dying", fromMs: 3200, toMs: 3800 },
    ],
  },
  {
    text: "without captions you lose",
    startMs: 3900,
    durationMs: 1800,
    tokens: [
      { text: "without", fromMs: 3900, toMs: 4300 },
      { text: "captions", fromMs: 4300, toMs: 4800 },
      { text: "you", fromMs: 4800, toMs: 5100 },
      { text: "lose", fromMs: 5100, toMs: 5700 },
    ],
  },
  {
    text: "eighty percent of viewers",
    startMs: 5800,
    durationMs: 1600,
    tokens: [
      { text: "eighty", fromMs: 5800, toMs: 6200 },
      { text: "percent", fromMs: 6200, toMs: 6600 },
      { text: "of", fromMs: 6600, toMs: 6800 },
      { text: "viewers", fromMs: 6800, toMs: 7400 },
    ],
  },
  {
    text: "fix it now and grow",
    startMs: 7500,
    durationMs: 1500,
    tokens: [
      { text: "fix", fromMs: 7500, toMs: 7800 },
      { text: "it", fromMs: 7800, toMs: 8000 },
      { text: "now", fromMs: 8000, toMs: 8300 },
      { text: "and", fromMs: 8300, toMs: 8500 },
      { text: "grow", fromMs: 8500, toMs: 9000 },
    ],
  },
];

const KEYWORDS = ["dying", "content", "captions", "eighty", "grow"];

export const MagazineDemo: React.FC = () => {
  return (
    <AbsoluteFill>
      <Video
        src={staticFile("sample-video.mp4")}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
      <Magazine pages={PAGES} keywords={KEYWORDS} position="bottom" />
    </AbsoluteFill>
  );
};
