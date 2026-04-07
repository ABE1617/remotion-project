import React from "react";
import { AbsoluteFill } from "remotion";
import { BlockFlip } from "../components/captions/BlockFlip";
import type { CaptionPage } from "../types/captions";

const SAMPLE_PAGES: CaptionPage[] = [
  {
    text: "stop waiting for permission",
    startMs: 200,
    durationMs: 1600,
    tokens: [
      { text: "stop", start: 200, end: 550 },
      { text: "waiting", start: 550, end: 950 },
      { text: "for", start: 950, end: 1200 },
      { text: "permission", start: 1200, end: 1800 },
    ],
  },
  {
    text: "nobody is coming to save you",
    startMs: 2000,
    durationMs: 2000,
    tokens: [
      { text: "nobody", start: 2000, end: 2350 },
      { text: "is", start: 2350, end: 2550 },
      { text: "coming", start: 2550, end: 2900 },
      { text: "to", start: 2900, end: 3100 },
      { text: "save", start: 3100, end: 3450 },
      { text: "you", start: 3450, end: 3800 },
    ],
  },
  {
    text: "build it now",
    startMs: 4100,
    durationMs: 1200,
    tokens: [
      { text: "build", start: 4100, end: 4500 },
      { text: "it", start: 4500, end: 4750 },
      { text: "now", start: 4750, end: 5200 },
    ],
  },
  {
    text: "your future self will thank you",
    startMs: 5500,
    durationMs: 2200,
    tokens: [
      { text: "your", start: 5500, end: 5800 },
      { text: "future", start: 5800, end: 6150 },
      { text: "self", start: 6150, end: 6450 },
      { text: "will", start: 6450, end: 6700 },
      { text: "thank", start: 6700, end: 7050 },
      { text: "you", start: 7050, end: 7500 },
    ],
  },
  {
    text: "go all in",
    startMs: 7700,
    durationMs: 1200,
    tokens: [
      { text: "go", start: 7700, end: 8000 },
      { text: "all", start: 8000, end: 8350 },
      { text: "in", start: 8350, end: 8700 },
    ],
  },
];

export const BlockFlipDemo: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#0F0F0F" }}>
      <BlockFlip pages={SAMPLE_PAGES} />
    </AbsoluteFill>
  );
};
