import React from "react";
import { AbsoluteFill } from "remotion";
import { TypewriterReveal } from "../components/captions/TypewriterReveal";
import type { CaptionPage } from "../types/captions";

// Suspenseful storytelling text -- slower pacing, narrative feel
const SAMPLE_PAGES: CaptionPage[] = [
  {
    text: "the last thing she said to me",
    startMs: 400,
    durationMs: 2200,
    tokens: [
      { text: "the", start: 400, end: 650 },
      { text: "last", start: 650, end: 950 },
      { text: "thing", start: 950, end: 1250 },
      { text: "she", start: 1250, end: 1500 },
      { text: "said", start: 1500, end: 1800 },
      { text: "to", start: 1800, end: 2000 },
      { text: "me", start: 2000, end: 2300 },
    ],
  },
  {
    text: "before she disappeared",
    startMs: 2800,
    durationMs: 1800,
    tokens: [
      { text: "before", start: 2800, end: 3200 },
      { text: "she", start: 3200, end: 3550 },
      { text: "disappeared", start: 3550, end: 4300 },
    ],
  },
  {
    text: "was a single word",
    startMs: 4800,
    durationMs: 1700,
    tokens: [
      { text: "was", start: 4800, end: 5100 },
      { text: "a", start: 5100, end: 5300 },
      { text: "single", start: 5300, end: 5750 },
      { text: "word", start: 5750, end: 6200 },
    ],
  },
  {
    text: "run",
    startMs: 6700,
    durationMs: 1200,
    tokens: [{ text: "run", start: 6700, end: 7200 }],
  },
  {
    text: "and i never looked back",
    startMs: 8100,
    durationMs: 2000,
    tokens: [
      { text: "and", start: 8100, end: 8350 },
      { text: "i", start: 8350, end: 8500 },
      { text: "never", start: 8500, end: 8850 },
      { text: "looked", start: 8850, end: 9250 },
      { text: "back", start: 9250, end: 9700 },
    ],
  },
  {
    text: "not even once",
    startMs: 10200,
    durationMs: 1500,
    tokens: [
      { text: "not", start: 10200, end: 10500 },
      { text: "even", start: 10500, end: 10850 },
      { text: "once", start: 10850, end: 11300 },
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
