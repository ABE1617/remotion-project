import React from "react";
import { AbsoluteFill, staticFile } from "remotion";
import { Video } from "@remotion/media";
import { Hush } from "./Hush";
import type { TikTokPage } from "../../types/captions";

const PAGES: TikTokPage[] = [
  {
    text: "you never have to announce",
    startMs: 100,
    durationMs: 1800,
    tokens: [
      { text: "you", fromMs: 100, toMs: 400 },
      { text: "never", fromMs: 400, toMs: 750 },
      { text: "have", fromMs: 750, toMs: 1050 },
      { text: "to", fromMs: 1050, toMs: 1300 },
      { text: "announce", fromMs: 1300, toMs: 1900 },
    ],
  },
  {
    text: "what speaks for itself",
    startMs: 2000,
    durationMs: 1800,
    tokens: [
      { text: "what", fromMs: 2000, toMs: 2400 },
      { text: "speaks", fromMs: 2400, toMs: 2900 },
      { text: "for", fromMs: 2900, toMs: 3200 },
      { text: "itself", fromMs: 3200, toMs: 3800 },
    ],
  },
  {
    text: "quality needs no explanation",
    startMs: 3900,
    durationMs: 1800,
    tokens: [
      { text: "quality", fromMs: 3900, toMs: 4400 },
      { text: "needs", fromMs: 4400, toMs: 4800 },
      { text: "no", fromMs: 4800, toMs: 5100 },
      { text: "explanation", fromMs: 5100, toMs: 5700 },
    ],
  },
  {
    text: "the ones who know",
    startMs: 5800,
    durationMs: 1600,
    tokens: [
      { text: "the", fromMs: 5800, toMs: 6100 },
      { text: "ones", fromMs: 6100, toMs: 6500 },
      { text: "who", fromMs: 6500, toMs: 6800 },
      { text: "know", fromMs: 6800, toMs: 7400 },
    ],
  },
  {
    text: "already understand",
    startMs: 7500,
    durationMs: 1500,
    tokens: [
      { text: "already", fromMs: 7500, toMs: 8100 },
      { text: "understand", fromMs: 8100, toMs: 9000 },
    ],
  },
];

const KEYWORDS = ["speaks", "quality", "know", "understand"];

export const HushDemo: React.FC = () => {
  return (
    <AbsoluteFill>
      <Video
        src={staticFile("sample-video.mp4")}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
      <Hush pages={PAGES} keywords={KEYWORDS} position="bottom" />
    </AbsoluteFill>
  );
};
