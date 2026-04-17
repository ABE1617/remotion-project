import React from "react";
import { AbsoluteFill, staticFile } from "remotion";
import { Video } from "@remotion/media";
import { Titan } from "./Titan";
import type { TikTokPage } from "../../types/captions";

const PAGES: TikTokPage[] = [
  {
    text: "you want to know how degenerate my work ethic is",
    startMs: 100,
    durationMs: 3200,
    tokens: [
      { text: "you", fromMs: 100, toMs: 300 },
      { text: "want", fromMs: 300, toMs: 550 },
      { text: "to", fromMs: 550, toMs: 700 },
      { text: "know", fromMs: 700, toMs: 1000 },
      { text: "how", fromMs: 1000, toMs: 1300 },
      { text: "degenerate", fromMs: 1300, toMs: 2000 },
      { text: "my", fromMs: 2000, toMs: 2200 },
      { text: "work", fromMs: 2200, toMs: 2600 },
      { text: "ethic", fromMs: 2600, toMs: 3000 },
      { text: "is", fromMs: 3000, toMs: 3300 },
    ],
  },
  {
    text: "i worked sixteen hours every single day",
    startMs: 3400,
    durationMs: 3000,
    tokens: [
      { text: "i", fromMs: 3400, toMs: 3550 },
      { text: "worked", fromMs: 3550, toMs: 3900 },
      { text: "sixteen", fromMs: 3900, toMs: 4400 },
      { text: "hours", fromMs: 4400, toMs: 4800 },
      { text: "every", fromMs: 4800, toMs: 5100 },
      { text: "single", fromMs: 5100, toMs: 5500 },
      { text: "day", fromMs: 5500, toMs: 6400 },
    ],
  },
  {
    text: "for three years straight no breaks",
    startMs: 6500,
    durationMs: 2800,
    tokens: [
      { text: "for", fromMs: 6500, toMs: 6700 },
      { text: "three", fromMs: 6700, toMs: 7000 },
      { text: "years", fromMs: 7000, toMs: 7400 },
      { text: "straight", fromMs: 7400, toMs: 7900 },
      { text: "no", fromMs: 7900, toMs: 8200 },
      { text: "breaks", fromMs: 8200, toMs: 9300 },
    ],
  },
];

const KEYWORDS = ["degenerate", "work", "ethic", "sixteen", "hours", "years", "breaks"];

export const TitanDemo: React.FC = () => (
  <AbsoluteFill>
    <Video
      src={staticFile("sample-video.mp4")}
      style={{ width: "100%", height: "100%", objectFit: "cover" }}
    />
    <Titan pages={PAGES} keywords={KEYWORDS} />
  </AbsoluteFill>
);
