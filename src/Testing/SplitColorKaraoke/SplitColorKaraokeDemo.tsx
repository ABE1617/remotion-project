import React from "react";
import { AbsoluteFill, staticFile } from "remotion";
import { Video } from "@remotion/media";
import { SplitColorKaraoke } from "./SplitColorKaraoke";
import type { TikTokPage } from "../../types/captions";

// ── Demo caption data ──────────────────────────────────────────────────────
// Punchy motivational phrases — words spaced 350-600 ms so the fill
// animation has room to visibly progress on each syllable.

const PAGES: TikTokPage[] = [
  {
    text: "level up your life",
    startMs: 100,
    durationMs: 1500,
    tokens: [
      { text: "level", fromMs: 100, toMs: 480 },
      { text: "up", fromMs: 530, toMs: 730 },
      { text: "your", fromMs: 780, toMs: 1050 },
      { text: "life", fromMs: 1100, toMs: 1550 },
    ],
  },
  {
    text: "success takes grind",
    startMs: 1750,
    durationMs: 1500,
    tokens: [
      { text: "success", fromMs: 1750, toMs: 2180 },
      { text: "takes", fromMs: 2230, toMs: 2550 },
      { text: "grind", fromMs: 2600, toMs: 3200 },
    ],
  },
  {
    text: "most people quit",
    startMs: 3400,
    durationMs: 1400,
    tokens: [
      { text: "most", fromMs: 3400, toMs: 3720 },
      { text: "people", fromMs: 3770, toMs: 4150 },
      { text: "quit", fromMs: 4200, toMs: 4750 },
    ],
  },
  {
    text: "winners push harder",
    startMs: 4950,
    durationMs: 1500,
    tokens: [
      { text: "winners", fromMs: 4950, toMs: 5380 },
      { text: "push", fromMs: 5430, toMs: 5750 },
      { text: "harder", fromMs: 5800, toMs: 6400 },
    ],
  },
  {
    text: "invest in yourself",
    startMs: 6600,
    durationMs: 1500,
    tokens: [
      { text: "invest", fromMs: 6600, toMs: 7000 },
      { text: "in", fromMs: 7050, toMs: 7250 },
      { text: "yourself", fromMs: 7300, toMs: 8050 },
    ],
  },
  {
    text: "start right now",
    startMs: 8250,
    durationMs: 1200,
    tokens: [
      { text: "start", fromMs: 8250, toMs: 8580 },
      { text: "right", fromMs: 8630, toMs: 8950 },
      { text: "now", fromMs: 9000, toMs: 9400 },
    ],
  },
];

// ── Demo component ─────────────────────────────────────────────────────────

export const SplitColorKaraokeDemo: React.FC = () => {
  return (
    <AbsoluteFill>
      <Video
        src={staticFile("sample-video.mp4")}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
      <SplitColorKaraoke pages={PAGES} position="center" />
    </AbsoluteFill>
  );
};
