import React from "react";
import { AbsoluteFill } from "remotion";
import { BounceKinetic } from "../components/captions/BounceKinetic";
import type { TikTokPage } from "../types/captions";

// Fast-paced one-word-at-a-time motivational text
// Each word fires rapidly -- ~300ms per word, punchy rhythm
const SAMPLE_PAGES: TikTokPage[] = [
  {
    text: "you are not stuck",
    startMs: 100,
    durationMs: 1100,
    tokens: [
      { text: "you", fromMs: 100, toMs: 370 },
      { text: "are", fromMs: 370, toMs: 620 },
      { text: "not", fromMs: 620, toMs: 880 },
      { text: "stuck", fromMs: 880, toMs: 1200 },
    ],
  },
  {
    text: "you are just getting started",
    startMs: 1350,
    durationMs: 1400,
    tokens: [
      { text: "you", fromMs: 1350, toMs: 1570 },
      { text: "are", fromMs: 1570, toMs: 1780 },
      { text: "just", fromMs: 1780, toMs: 2020 },
      { text: "getting", fromMs: 2020, toMs: 2350 },
      { text: "started", fromMs: 2350, toMs: 2750 },
    ],
  },
  {
    text: "every champion was once",
    startMs: 2900,
    durationMs: 1200,
    tokens: [
      { text: "every", fromMs: 2900, toMs: 3150 },
      { text: "champion", fromMs: 3150, toMs: 3500 },
      { text: "was", fromMs: 3500, toMs: 3700 },
      { text: "once", fromMs: 3700, toMs: 4000 },
    ],
  },
  {
    text: "a beginner who refused",
    startMs: 4100,
    durationMs: 1200,
    tokens: [
      { text: "a", fromMs: 4100, toMs: 4280 },
      { text: "beginner", fromMs: 4280, toMs: 4650 },
      { text: "who", fromMs: 4650, toMs: 4850 },
      { text: "refused", fromMs: 4850, toMs: 5200 },
    ],
  },
  {
    text: "to quit",
    startMs: 5300,
    durationMs: 700,
    tokens: [
      { text: "to", fromMs: 5300, toMs: 5520 },
      { text: "quit", fromMs: 5520, toMs: 5900 },
    ],
  },
  {
    text: "attack every day with fire",
    startMs: 6100,
    durationMs: 1500,
    tokens: [
      { text: "attack", fromMs: 6100, toMs: 6400 },
      { text: "every", fromMs: 6400, toMs: 6650 },
      { text: "day", fromMs: 6650, toMs: 6900 },
      { text: "with", fromMs: 6900, toMs: 7100 },
      { text: "fire", fromMs: 7100, toMs: 7500 },
    ],
  },
  {
    text: "no excuses no limits",
    startMs: 7650,
    durationMs: 1100,
    tokens: [
      { text: "no", fromMs: 7650, toMs: 7850 },
      { text: "excuses", fromMs: 7850, toMs: 8200 },
      { text: "no", fromMs: 8200, toMs: 8400 },
      { text: "limits", fromMs: 8400, toMs: 8750 },
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
