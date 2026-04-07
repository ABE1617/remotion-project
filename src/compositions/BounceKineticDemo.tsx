import React from "react";
import { AbsoluteFill } from "remotion";
import { BounceKinetic } from "../components/captions/BounceKinetic";
import type { CaptionPage } from "../types/captions";

// Fast-paced one-word-at-a-time motivational text
// Each word fires rapidly -- ~300ms per word, punchy rhythm
const SAMPLE_PAGES: CaptionPage[] = [
  {
    text: "you are not stuck",
    startMs: 100,
    durationMs: 1100,
    tokens: [
      { text: "you", start: 100, end: 370 },
      { text: "are", start: 370, end: 620 },
      { text: "not", start: 620, end: 880 },
      { text: "stuck", start: 880, end: 1200 },
    ],
  },
  {
    text: "you are just getting started",
    startMs: 1350,
    durationMs: 1400,
    tokens: [
      { text: "you", start: 1350, end: 1570 },
      { text: "are", start: 1570, end: 1780 },
      { text: "just", start: 1780, end: 2020 },
      { text: "getting", start: 2020, end: 2350 },
      { text: "started", start: 2350, end: 2750 },
    ],
  },
  {
    text: "every champion was once",
    startMs: 2900,
    durationMs: 1200,
    tokens: [
      { text: "every", start: 2900, end: 3150 },
      { text: "champion", start: 3150, end: 3500 },
      { text: "was", start: 3500, end: 3700 },
      { text: "once", start: 3700, end: 4000 },
    ],
  },
  {
    text: "a beginner who refused",
    startMs: 4100,
    durationMs: 1200,
    tokens: [
      { text: "a", start: 4100, end: 4280 },
      { text: "beginner", start: 4280, end: 4650 },
      { text: "who", start: 4650, end: 4850 },
      { text: "refused", start: 4850, end: 5200 },
    ],
  },
  {
    text: "to quit",
    startMs: 5300,
    durationMs: 700,
    tokens: [
      { text: "to", start: 5300, end: 5520 },
      { text: "quit", start: 5520, end: 5900 },
    ],
  },
  {
    text: "attack every day with fire",
    startMs: 6100,
    durationMs: 1500,
    tokens: [
      { text: "attack", start: 6100, end: 6400 },
      { text: "every", start: 6400, end: 6650 },
      { text: "day", start: 6650, end: 6900 },
      { text: "with", start: 6900, end: 7100 },
      { text: "fire", start: 7100, end: 7500 },
    ],
  },
  {
    text: "no excuses no limits",
    startMs: 7650,
    durationMs: 1100,
    tokens: [
      { text: "no", start: 7650, end: 7850 },
      { text: "excuses", start: 7850, end: 8200 },
      { text: "no", start: 8200, end: 8400 },
      { text: "limits", start: 8400, end: 8750 },
    ],
  },
];

export const BounceKineticDemo: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#111111" }}>
      <BounceKinetic pages={SAMPLE_PAGES} />
    </AbsoluteFill>
  );
};
