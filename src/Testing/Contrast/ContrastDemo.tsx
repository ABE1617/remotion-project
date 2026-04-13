import React from "react";
import { AbsoluteFill, staticFile } from "remotion";
import { Video } from "@remotion/media";
import { Contrast } from "./Contrast";
import type { TikTokPage } from "../../types/captions";

const PAGES: TikTokPage[] = [
  {
    text: "some stories are told",
    startMs: 100,
    durationMs: 1800,
    tokens: [
      { text: "some", fromMs: 100, toMs: 450 },
      { text: "stories", fromMs: 450, toMs: 950 },
      { text: "are", fromMs: 950, toMs: 1250 },
      { text: "told", fromMs: 1250, toMs: 1900 },
    ],
  },
  {
    text: "in whispers not shouts",
    startMs: 2000,
    durationMs: 1800,
    tokens: [
      { text: "in", fromMs: 2000, toMs: 2300 },
      { text: "whispers", fromMs: 2300, toMs: 2900 },
      { text: "not", fromMs: 2900, toMs: 3200 },
      { text: "shouts", fromMs: 3200, toMs: 3800 },
    ],
  },
  {
    text: "the weight of a word",
    startMs: 3900,
    durationMs: 1800,
    tokens: [
      { text: "the", fromMs: 3900, toMs: 4200 },
      { text: "weight", fromMs: 4200, toMs: 4700 },
      { text: "of", fromMs: 4700, toMs: 4950 },
      { text: "a", fromMs: 4950, toMs: 5100 },
      { text: "word", fromMs: 5100, toMs: 5700 },
    ],
  },
  {
    text: "changes everything",
    startMs: 5800,
    durationMs: 1600,
    tokens: [
      { text: "changes", fromMs: 5800, toMs: 6500 },
      { text: "everything", fromMs: 6500, toMs: 7400 },
    ],
  },
  {
    text: "if you let it",
    startMs: 7500,
    durationMs: 1500,
    tokens: [
      { text: "if", fromMs: 7500, toMs: 7800 },
      { text: "you", fromMs: 7800, toMs: 8200 },
      { text: "let", fromMs: 8200, toMs: 8500 },
      { text: "it", fromMs: 8500, toMs: 9000 },
    ],
  },
];

const KEYWORDS = ["stories", "whispers", "weight", "everything"];

export const ContrastDemo: React.FC = () => {
  return (
    <AbsoluteFill>
      <Video
        src={staticFile("sample-video.mp4")}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
      <Contrast pages={PAGES} keywords={KEYWORDS} position="bottom" />
    </AbsoluteFill>
  );
};
