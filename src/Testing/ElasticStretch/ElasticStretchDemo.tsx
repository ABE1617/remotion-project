import React from "react";
import { AbsoluteFill, staticFile } from "remotion";
import { Video } from "@remotion/media";
import { ElasticStretch } from "./ElasticStretch";
import type { TikTokPage } from "../../types/captions";

// ── Demo caption data ──────────────────────────────────────────────────────
// Motivational content, ~9 seconds / 270 frames.
// Words are spaced ~350–450 ms apart so the elastic entry has room to settle
// before the next word lands.

const PAGES: TikTokPage[] = [
  {
    text: "your mindset",
    startMs: 100,
    durationMs: 1100,
    tokens: [
      { text: "your", fromMs: 100, toMs: 450 },
      { text: "mindset", fromMs: 500, toMs: 1100 },
    ],
  },
  {
    text: "shapes your world",
    startMs: 1300,
    durationMs: 1300,
    tokens: [
      { text: "shapes", fromMs: 1300, toMs: 1620 },
      { text: "your", fromMs: 1670, toMs: 1950 },
      { text: "world", fromMs: 2000, toMs: 2500 },
    ],
  },
  {
    text: "think bigger",
    startMs: 2700,
    durationMs: 1100,
    tokens: [
      { text: "think", fromMs: 2700, toMs: 3050 },
      { text: "bigger", fromMs: 3100, toMs: 3700 },
    ],
  },
  {
    text: "act every day",
    startMs: 3900,
    durationMs: 1400,
    tokens: [
      { text: "act", fromMs: 3900, toMs: 4150 },
      { text: "every", fromMs: 4200, toMs: 4600 },
      { text: "day", fromMs: 4650, toMs: 5200 },
    ],
  },
  {
    text: "nothing comes easy",
    startMs: 5400,
    durationMs: 1600,
    tokens: [
      { text: "nothing", fromMs: 5400, toMs: 5800 },
      { text: "comes", fromMs: 5850, toMs: 6200 },
      { text: "easy", fromMs: 6250, toMs: 6900 },
    ],
  },
  {
    text: "but winners",
    startMs: 7100,
    durationMs: 900,
    tokens: [
      { text: "but", fromMs: 7100, toMs: 7350 },
      { text: "winners", fromMs: 7400, toMs: 7900 },
    ],
  },
  {
    text: "never quit",
    startMs: 8100,
    durationMs: 1100,
    tokens: [
      { text: "never", fromMs: 8100, toMs: 8500 },
      { text: "quit", fromMs: 8550, toMs: 9100 },
    ],
  },
];

// ── Demo component ─────────────────────────────────────────────────────────

export const ElasticStretchDemo: React.FC = () => {
  return (
    <AbsoluteFill>
      <Video
        src={staticFile("sample-video.mp4")}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
      <ElasticStretch pages={PAGES} position="center" />
    </AbsoluteFill>
  );
};
