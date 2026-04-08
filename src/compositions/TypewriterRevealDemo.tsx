import React from "react";
import { AbsoluteFill } from "remotion";
import { TypewriterReveal } from "../components/captions/TypewriterReveal";
import type { TikTokPage } from "../types/captions";

// Suspenseful storytelling text -- slower pacing, narrative feel
const SAMPLE_PAGES: TikTokPage[] = [
  {
    text: "the last thing she said to me",
    startMs: 400,
    durationMs: 2200,
    tokens: [
      { text: "the", fromMs: 400, toMs: 650 },
      { text: "last", fromMs: 650, toMs: 950 },
      { text: "thing", fromMs: 950, toMs: 1250 },
      { text: "she", fromMs: 1250, toMs: 1500 },
      { text: "said", fromMs: 1500, toMs: 1800 },
      { text: "to", fromMs: 1800, toMs: 2000 },
      { text: "me", fromMs: 2000, toMs: 2300 },
    ],
  },
  {
    text: "before she disappeared",
    startMs: 2800,
    durationMs: 1800,
    tokens: [
      { text: "before", fromMs: 2800, toMs: 3200 },
      { text: "she", fromMs: 3200, toMs: 3550 },
      { text: "disappeared", fromMs: 3550, toMs: 4300 },
    ],
  },
  {
    text: "was a single word",
    startMs: 4800,
    durationMs: 1700,
    tokens: [
      { text: "was", fromMs: 4800, toMs: 5100 },
      { text: "a", fromMs: 5100, toMs: 5300 },
      { text: "single", fromMs: 5300, toMs: 5750 },
      { text: "word", fromMs: 5750, toMs: 6200 },
    ],
  },
  {
    text: "run",
    startMs: 6700,
    durationMs: 1200,
    tokens: [{ text: "run", fromMs: 6700, toMs: 7200 }],
  },
  {
    text: "and i never looked back",
    startMs: 8100,
    durationMs: 2000,
    tokens: [
      { text: "and", fromMs: 8100, toMs: 8350 },
      { text: "i", fromMs: 8350, toMs: 8500 },
      { text: "never", fromMs: 8500, toMs: 8850 },
      { text: "looked", fromMs: 8850, toMs: 9250 },
      { text: "back", fromMs: 9250, toMs: 9700 },
    ],
  },
  {
    text: "not even once",
    startMs: 10200,
    durationMs: 1500,
    tokens: [
      { text: "not", fromMs: 10200, toMs: 10500 },
      { text: "even", fromMs: 10500, toMs: 10850 },
      { text: "once", fromMs: 10850, toMs: 11300 },
    ],
  },
];

export const TypewriterRevealDemo: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0a0a" }}>
      <TypewriterReveal pages={SAMPLE_PAGES} scheme="classic" />
    </AbsoluteFill>
  );
};
