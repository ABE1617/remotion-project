import React from "react";
import { AbsoluteFill, staticFile } from "remotion";
import { Video } from "@remotion/media";
import { Serif } from "./Serif";
import type { TikTokPage } from "../../types/captions";

const PAGES: TikTokPage[] = [
  {
    text: "the best design",
    startMs: 100,
    durationMs: 1800,
    tokens: [
      { text: "the", fromMs: 100, toMs: 400 },
      { text: "best", fromMs: 400, toMs: 800 },
      { text: "design", fromMs: 800, toMs: 1900 },
    ],
  },
  {
    text: "speaks through silence",
    startMs: 2000,
    durationMs: 1800,
    tokens: [
      { text: "speaks", fromMs: 2000, toMs: 2500 },
      { text: "through", fromMs: 2500, toMs: 3000 },
      { text: "silence", fromMs: 3000, toMs: 3800 },
    ],
  },
  {
    text: "every detail matters",
    startMs: 3900,
    durationMs: 1800,
    tokens: [
      { text: "every", fromMs: 3900, toMs: 4400 },
      { text: "detail", fromMs: 4400, toMs: 5000 },
      { text: "matters", fromMs: 5000, toMs: 5700 },
    ],
  },
  {
    text: "when nothing is wasted",
    startMs: 5800,
    durationMs: 1600,
    tokens: [
      { text: "when", fromMs: 5800, toMs: 6100 },
      { text: "nothing", fromMs: 6100, toMs: 6600 },
      { text: "is", fromMs: 6600, toMs: 6900 },
      { text: "wasted", fromMs: 6900, toMs: 7400 },
    ],
  },
  {
    text: "elegance remains",
    startMs: 7500,
    durationMs: 1500,
    tokens: [
      { text: "elegance", fromMs: 7500, toMs: 8200 },
      { text: "remains", fromMs: 8200, toMs: 9000 },
    ],
  },
];

const KEYWORDS = ["design", "silence", "detail", "nothing", "elegance"];

export const SerifDemo: React.FC = () => {
  return (
    <AbsoluteFill>
      <Video
        src={staticFile("sample-video.mp4")}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
      <Serif pages={PAGES} keywords={KEYWORDS} position="bottom" />
    </AbsoluteFill>
  );
};
