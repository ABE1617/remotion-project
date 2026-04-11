import React from "react";
import { AbsoluteFill, staticFile } from "remotion";
import { Video } from "@remotion/media";
import { CinematicLetterpress } from "./CinematicLetterpress";
import type { TikTokPage } from "../../types/captions";

// ── Demo caption data ──────────────────────────────────────────────────────
// Luxury/editorial phrasing, deliberately paced. ~9 seconds total.

const PAGES: TikTokPage[] = [
  {
    text: "elegance is not",
    startMs: 300,
    durationMs: 1300,
    tokens: [
      { text: "elegance", fromMs: 300, toMs: 700 },
      { text: "is", fromMs: 700, toMs: 900 },
      { text: "not", fromMs: 900, toMs: 1600 },
    ],
  },
  {
    text: "about being noticed",
    startMs: 1700,
    durationMs: 1400,
    tokens: [
      { text: "about", fromMs: 1700, toMs: 2000 },
      { text: "being", fromMs: 2000, toMs: 2350 },
      { text: "noticed", fromMs: 2350, toMs: 3100 },
    ],
  },
  {
    text: "it's about",
    startMs: 3200,
    durationMs: 1100,
    tokens: [
      { text: "it's", fromMs: 3200, toMs: 3550 },
      { text: "about", fromMs: 3550, toMs: 4300 },
    ],
  },
  {
    text: "being remembered",
    startMs: 4400,
    durationMs: 1300,
    tokens: [
      { text: "being", fromMs: 4400, toMs: 4800 },
      { text: "remembered", fromMs: 4800, toMs: 5700 },
    ],
  },
  {
    text: "in the quiet details",
    startMs: 5800,
    durationMs: 1400,
    tokens: [
      { text: "in", fromMs: 5800, toMs: 5950 },
      { text: "the", fromMs: 5950, toMs: 6100 },
      { text: "quiet", fromMs: 6100, toMs: 6500 },
      { text: "details", fromMs: 6500, toMs: 7200 },
    ],
  },
  {
    text: "the soft light",
    startMs: 7300,
    durationMs: 1200,
    tokens: [
      { text: "the", fromMs: 7300, toMs: 7500 },
      { text: "soft", fromMs: 7500, toMs: 7850 },
      { text: "light", fromMs: 7850, toMs: 8500 },
    ],
  },
  {
    text: "the perfect silence",
    startMs: 8600,
    durationMs: 1400,
    tokens: [
      { text: "the", fromMs: 8600, toMs: 8800 },
      { text: "perfect", fromMs: 8800, toMs: 9200 },
      { text: "silence", fromMs: 9200, toMs: 10000 },
    ],
  },
];

// ── Demo component ─────────────────────────────────────────────────────────

export const CinematicLetterpressDemo: React.FC = () => {
  return (
    <AbsoluteFill>
      <Video
        src={staticFile("sample-video.mp4")}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
      <CinematicLetterpress pages={PAGES} position="bottom" />
    </AbsoluteFill>
  );
};
