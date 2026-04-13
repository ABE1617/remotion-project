import React from "react";
import { AbsoluteFill, staticFile } from "remotion";
import { Video } from "@remotion/media";
import { Signal } from "./Signal";
import type { TikTokPage } from "../../types/captions";

const PAGES: TikTokPage[] = [
  {
    text: "less noise more signal",
    startMs: 100,
    durationMs: 1800,
    tokens: [
      { text: "less", fromMs: 100, toMs: 450 },
      { text: "noise", fromMs: 450, toMs: 850 },
      { text: "more", fromMs: 850, toMs: 1250 },
      { text: "signal", fromMs: 1250, toMs: 1900 },
    ],
  },
  {
    text: "every pixel has purpose",
    startMs: 2000,
    durationMs: 1800,
    tokens: [
      { text: "every", fromMs: 2000, toMs: 2400 },
      { text: "pixel", fromMs: 2400, toMs: 2800 },
      { text: "has", fromMs: 2800, toMs: 3100 },
      { text: "purpose", fromMs: 3100, toMs: 3800 },
    ],
  },
  {
    text: "designed for the way",
    startMs: 3900,
    durationMs: 1800,
    tokens: [
      { text: "designed", fromMs: 3900, toMs: 4400 },
      { text: "for", fromMs: 4400, toMs: 4700 },
      { text: "the", fromMs: 4700, toMs: 5000 },
      { text: "way", fromMs: 5000, toMs: 5700 },
    ],
  },
  {
    text: "you actually think",
    startMs: 5800,
    durationMs: 1600,
    tokens: [
      { text: "you", fromMs: 5800, toMs: 6200 },
      { text: "actually", fromMs: 6200, toMs: 6800 },
      { text: "think", fromMs: 6800, toMs: 7400 },
    ],
  },
  {
    text: "simple scales",
    startMs: 7500,
    durationMs: 1500,
    tokens: [
      { text: "simple", fromMs: 7500, toMs: 8200 },
      { text: "scales", fromMs: 8200, toMs: 9000 },
    ],
  },
];

const KEYWORDS = ["signal", "purpose", "think", "scales"];

export const SignalDemo: React.FC = () => {
  return (
    <AbsoluteFill>
      <Video
        src={staticFile("sample-video.mp4")}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
      <Signal pages={PAGES} keywords={KEYWORDS} position="bottom" />
    </AbsoluteFill>
  );
};
