import React from "react";
import { AbsoluteFill, staticFile } from "remotion";
import { Video } from "@remotion/media";
import { Quintessence } from "./Quintessence";
import type { TikTokPage } from "../../types/captions";

const PAGES: TikTokPage[] = [
  {
    text: "the stakes have never been this high",
    startMs: 100,
    durationMs: 3500,
    tokens: [
      { text: "the", fromMs: 100, toMs: 550 },
      { text: "stakes", fromMs: 550, toMs: 1100 },
      { text: "have", fromMs: 1100, toMs: 1550 },
      { text: "never", fromMs: 1550, toMs: 2100 },
      { text: "been", fromMs: 2100, toMs: 2550 },
      { text: "this", fromMs: 2550, toMs: 3000 },
      { text: "high", fromMs: 3000, toMs: 3500 },
    ],
  },
  {
    text: "you either win or you die trying",
    startMs: 3700,
    durationMs: 3500,
    tokens: [
      { text: "you", fromMs: 3700, toMs: 4150 },
      { text: "either", fromMs: 4150, toMs: 4700 },
      { text: "win", fromMs: 4700, toMs: 5300 },
      { text: "or", fromMs: 5300, toMs: 5700 },
      { text: "you", fromMs: 5700, toMs: 6100 },
      { text: "die", fromMs: 6100, toMs: 6600 },
      { text: "trying", fromMs: 6600, toMs: 7100 },
    ],
  },
];

export const QuintessenceDemo: React.FC = () => {
  return (
    <AbsoluteFill>
      <Video
        src={staticFile("sample-video.mp4")}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
      <Quintessence pages={PAGES} />
    </AbsoluteFill>
  );
};
