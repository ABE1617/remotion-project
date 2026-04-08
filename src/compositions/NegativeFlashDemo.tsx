import React from "react";
import { AbsoluteFill, Video, staticFile } from "remotion";
import { NegativeFlash } from "../components/captions/NegativeFlash";
import type { TikTokPage } from "../types/captions";

const BOTTOM_PAGES: TikTokPage[] = [
  {
    // no keywords → shows entire line at once
    text: "the stakes have never been this high",
    startMs: 100,
    durationMs: 2000,
    tokens: [
      { text: "the", fromMs: 100, toMs: 300 },
      { text: "stakes", fromMs: 300, toMs: 600 },
      { text: "have", fromMs: 600, toMs: 800 },
      { text: "never", fromMs: 800, toMs: 1100 },
      { text: "been", fromMs: 1100, toMs: 1400 },
      { text: "this", fromMs: 1400, toMs: 1600 },
      { text: "high", fromMs: 1600, toMs: 2000 },
    ],
  },
  {
    // "win" + "die" are keywords → word by word
    text: "you either win or you die trying",
    startMs: 2200,
    durationMs: 2200,
    tokens: [
      { text: "you", fromMs: 2200, toMs: 2400 },
      { text: "either", fromMs: 2400, toMs: 2700 },
      { text: "win", fromMs: 2700, toMs: 3100 },
      { text: "or", fromMs: 3100, toMs: 3300 },
      { text: "you", fromMs: 3300, toMs: 3500 },
      { text: "die", fromMs: 3500, toMs: 3800 },
      { text: "trying", fromMs: 3800, toMs: 4300 },
    ],
  },
  {
    // no keywords → shows entire line at once
    text: "there is no second chance",
    startMs: 4500,
    durationMs: 1600,
    tokens: [
      { text: "there", fromMs: 4500, toMs: 4700 },
      { text: "is", fromMs: 4700, toMs: 4850 },
      { text: "no", fromMs: 4850, toMs: 5050 },
      { text: "second", fromMs: 5050, toMs: 5350 },
      { text: "chance", fromMs: 5350, toMs: 6000 },
    ],
  },
  {
    // "fight" is keyword → word by word
    text: "so you better fight for it",
    startMs: 6200,
    durationMs: 1800,
    tokens: [
      { text: "so", fromMs: 6200, toMs: 6350 },
      { text: "you", fromMs: 6350, toMs: 6500 },
      { text: "better", fromMs: 6500, toMs: 6800 },
      { text: "fight", fromMs: 6800, toMs: 7200 },
      { text: "for", fromMs: 7200, toMs: 7500 },
      { text: "it", fromMs: 7500, toMs: 7900 },
    ],
  },
];

const TOP_PAGES: TikTokPage[] = [
  {
    // "stop" + "go" are keywords → word by word
    text: "stop playing small and go all in",
    startMs: 8100,
    durationMs: 2200,
    tokens: [
      { text: "stop", fromMs: 8100, toMs: 8400 },
      { text: "playing", fromMs: 8400, toMs: 8700 },
      { text: "small", fromMs: 8700, toMs: 9000 },
      { text: "and", fromMs: 9000, toMs: 9150 },
      { text: "go", fromMs: 9150, toMs: 9450 },
      { text: "all", fromMs: 9450, toMs: 9700 },
      { text: "in", fromMs: 9700, toMs: 10200 },
    ],
  },
  {
    // no keywords → shows entire line at once
    text: "because the only way out is through",
    startMs: 10400,
    durationMs: 1800,
    tokens: [
      { text: "because", fromMs: 10400, toMs: 10650 },
      { text: "the", fromMs: 10650, toMs: 10800 },
      { text: "only", fromMs: 10800, toMs: 11000 },
      { text: "way", fromMs: 11000, toMs: 11200 },
      { text: "out", fromMs: 11200, toMs: 11400 },
      { text: "is", fromMs: 11400, toMs: 11550 },
      { text: "through", fromMs: 11550, toMs: 12100 },
    ],
  },
  {
    // "life" + "fight" are keywords → word by word
    text: "this is your life fight for it",
    startMs: 12300,
    durationMs: 2000,
    tokens: [
      { text: "this", fromMs: 12300, toMs: 12500 },
      { text: "is", fromMs: 12500, toMs: 12650 },
      { text: "your", fromMs: 12650, toMs: 12850 },
      { text: "life", fromMs: 12850, toMs: 13200 },
      { text: "fight", fromMs: 13200, toMs: 13600 },
      { text: "for", fromMs: 13600, toMs: 13800 },
      { text: "it", fromMs: 13800, toMs: 14200 },
    ],
  },
];

export const NegativeFlashDemo: React.FC = () => {
  return (
    <AbsoluteFill>
      <Video
        src={staticFile("sample-video.mp4")}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
      <NegativeFlash pages={BOTTOM_PAGES} position="bottom" colorPreset="red" />
      <NegativeFlash pages={TOP_PAGES} position="top" colorPreset="red" />
    </AbsoluteFill>
  );
};
