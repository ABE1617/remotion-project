import React from "react";
import { AbsoluteFill } from "remotion";
import { CRTHighlight } from "../components/captions/CRTHighlight";
import type { TikTokPage } from "../types/captions";

const SAMPLE_PAGES: TikTokPage[] = [
  {
    text: "attention this is important",
    startMs: 100,
    durationMs: 1500,
    tokens: [
      { text: "attention", fromMs: 100, toMs: 500 },
      { text: "this", fromMs: 500, toMs: 700 },
      { text: "is", fromMs: 700, toMs: 850 },
      { text: "important", fromMs: 850, toMs: 1500 },
    ],
  },
  {
    text: "the world doesn't owe you",
    startMs: 1700,
    durationMs: 1500,
    tokens: [
      { text: "the", fromMs: 1700, toMs: 1900 },
      { text: "world", fromMs: 1900, toMs: 2200 },
      { text: "doesn't", fromMs: 2200, toMs: 2500 },
      { text: "owe", fromMs: 2500, toMs: 2700 },
      { text: "you", fromMs: 2700, toMs: 3100 },
    ],
  },
  {
    text: "stop making excuses",
    startMs: 3300,
    durationMs: 1300,
    tokens: [
      { text: "stop", fromMs: 3300, toMs: 3600 },
      { text: "making", fromMs: 3600, toMs: 3900 },
      { text: "excuses", fromMs: 3900, toMs: 4500 },
    ],
  },
  {
    text: "build something real",
    startMs: 4700,
    durationMs: 1300,
    tokens: [
      { text: "build", fromMs: 4700, toMs: 5000 },
      { text: "something", fromMs: 5000, toMs: 5350 },
      { text: "real", fromMs: 5350, toMs: 5900 },
    ],
  },
  {
    text: "your mind is the weapon",
    startMs: 6100,
    durationMs: 1500,
    tokens: [
      { text: "your", fromMs: 6100, toMs: 6300 },
      { text: "mind", fromMs: 6300, toMs: 6600 },
      { text: "is", fromMs: 6600, toMs: 6750 },
      { text: "the", fromMs: 6750, toMs: 6900 },
      { text: "weapon", fromMs: 6900, toMs: 7500 },
    ],
  },
  {
    text: "execute with power",
    startMs: 7700,
    durationMs: 1300,
    tokens: [
      { text: "execute", fromMs: 7700, toMs: 8100 },
      { text: "with", fromMs: 8100, toMs: 8350 },
      { text: "power", fromMs: 8350, toMs: 8900 },
    ],
  },
  {
    text: "they said it was impossible",
    startMs: 9100,
    durationMs: 1600,
    tokens: [
      { text: "they", fromMs: 9100, toMs: 9300 },
      { text: "said", fromMs: 9300, toMs: 9500 },
      { text: "it", fromMs: 9500, toMs: 9650 },
      { text: "was", fromMs: 9650, toMs: 9850 },
      { text: "impossible", fromMs: 9850, toMs: 10600 },
    ],
  },
  {
    text: "watch me prove them wrong",
    startMs: 10800,
    durationMs: 1500,
    tokens: [
      { text: "watch", fromMs: 10800, toMs: 11100 },
      { text: "me", fromMs: 11100, toMs: 11300 },
      { text: "prove", fromMs: 11300, toMs: 11600 },
      { text: "them", fromMs: 11600, toMs: 11800 },
      { text: "wrong", fromMs: 11800, toMs: 12200 },
    ],
  },
  {
    text: "the grind never stops",
    startMs: 12400,
    durationMs: 1400,
    tokens: [
      { text: "the", fromMs: 12400, toMs: 12550 },
      { text: "grind", fromMs: 12550, toMs: 12900 },
      { text: "never", fromMs: 12900, toMs: 13200 },
      { text: "stops", fromMs: 13200, toMs: 13700 },
    ],
  },
  {
    text: "this is your life",
    startMs: 13900,
    durationMs: 1300,
    tokens: [
      { text: "this", fromMs: 13900, toMs: 14100 },
      { text: "is", fromMs: 14100, toMs: 14250 },
      { text: "your", fromMs: 14250, toMs: 14500 },
      { text: "life", fromMs: 14500, toMs: 15100 },
    ],
  },
  {
    text: "go win it all king",
    startMs: 15300,
    durationMs: 1500,
    tokens: [
      { text: "go", fromMs: 15300, toMs: 15500 },
      { text: "win", fromMs: 15500, toMs: 15800 },
      { text: "it", fromMs: 15800, toMs: 15950 },
      { text: "all", fromMs: 15950, toMs: 16200 },
      { text: "king", fromMs: 16200, toMs: 16700 },
    ],
  },
];

export const CRTHighlightDemo: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#0A0A0A" }}>
      <CRTHighlight pages={SAMPLE_PAGES} />
    </AbsoluteFill>
  );
};
