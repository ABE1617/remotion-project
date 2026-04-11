import React from "react";
import { AbsoluteFill, staticFile } from "remotion";
import { Video } from "@remotion/media";
import { BoxedWordStack } from "./BoxedWordStack";
import type { TikTokPage } from "../../types/captions";

// ── Demo caption data ──────────────────────────────────────────────────────
// Bold, short bursts — the box pop works best with punchy words that have
// distinct onset times so each stamp lands visually.

const PAGES: TikTokPage[] = [
  {
    text: "stop playing small",
    startMs: 100,
    durationMs: 1500,
    tokens: [
      { text: "stop", fromMs: 100, toMs: 460 },
      { text: "playing", fromMs: 510, toMs: 950 },
      { text: "small", fromMs: 1000, toMs: 1550 },
    ],
  },
  {
    text: "own your future",
    startMs: 1750,
    durationMs: 1400,
    tokens: [
      { text: "own", fromMs: 1750, toMs: 2050 },
      { text: "your", fromMs: 2100, toMs: 2400 },
      { text: "future", fromMs: 2450, toMs: 3100 },
    ],
  },
  {
    text: "fear kills dreams",
    startMs: 3300,
    durationMs: 1400,
    tokens: [
      { text: "fear", fromMs: 3300, toMs: 3620 },
      { text: "kills", fromMs: 3670, toMs: 4000 },
      { text: "dreams", fromMs: 4050, toMs: 4650 },
    ],
  },
  {
    text: "take the shot",
    startMs: 4850,
    durationMs: 1300,
    tokens: [
      { text: "take", fromMs: 4850, toMs: 5150 },
      { text: "the", fromMs: 5200, toMs: 5400 },
      { text: "shot", fromMs: 5450, toMs: 6100 },
    ],
  },
  {
    text: "no excuses",
    startMs: 6300,
    durationMs: 1100,
    tokens: [
      { text: "no", fromMs: 6300, toMs: 6550 },
      { text: "excuses", fromMs: 6600, toMs: 7350 },
    ],
  },
  {
    text: "build your legacy",
    startMs: 7550,
    durationMs: 1500,
    tokens: [
      { text: "build", fromMs: 7550, toMs: 7900 },
      { text: "your", fromMs: 7950, toMs: 8250 },
      { text: "legacy", fromMs: 8300, toMs: 9000 },
    ],
  },
];

// ── Demo component ─────────────────────────────────────────────────────────

export const BoxedWordStackDemo: React.FC = () => {
  return (
    <AbsoluteFill>
      <Video
        src={staticFile("sample-video.mp4")}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
      <BoxedWordStack pages={PAGES} position="center" />
    </AbsoluteFill>
  );
};
