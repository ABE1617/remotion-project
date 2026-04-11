import React from "react";
import { AbsoluteFill, staticFile } from "remotion";
import { Video } from "@remotion/media";
import { BeatBounce } from "./BeatBounce";
import type { TikTokPage } from "../../types/captions";

// ── Demo caption data ──────────────────────────────────────────────────────
// Podcast/music themed text — short rhythmic phrases that work well with
// beat bounce and waveform visualization. ~8 seconds, 6 pages.

const PAGES: TikTokPage[] = [
  {
    text: "feel the rhythm",
    startMs: 200,
    durationMs: 1100,
    tokens: [
      { text: "feel", fromMs: 200, toMs: 500 },
      { text: "the", fromMs: 550, toMs: 750 },
      { text: "rhythm", fromMs: 800, toMs: 1200 },
    ],
  },
  {
    text: "let it move you",
    startMs: 1500,
    durationMs: 1100,
    tokens: [
      { text: "let", fromMs: 1500, toMs: 1700 },
      { text: "it", fromMs: 1750, toMs: 1900 },
      { text: "move", fromMs: 1950, toMs: 2150 },
      { text: "you", fromMs: 2200, toMs: 2500 },
    ],
  },
  {
    text: "the bass drops hard",
    startMs: 2800,
    durationMs: 1200,
    tokens: [
      { text: "the", fromMs: 2800, toMs: 2950 },
      { text: "bass", fromMs: 3000, toMs: 3250 },
      { text: "drops", fromMs: 3300, toMs: 3550 },
      { text: "hard", fromMs: 3600, toMs: 3900 },
    ],
  },
  {
    text: "and the crowd goes",
    startMs: 4200,
    durationMs: 1200,
    tokens: [
      { text: "and", fromMs: 4200, toMs: 4350 },
      { text: "the", fromMs: 4400, toMs: 4550 },
      { text: "crowd", fromMs: 4600, toMs: 4850 },
      { text: "goes", fromMs: 4900, toMs: 5300 },
    ],
  },
  {
    text: "absolutely wild",
    startMs: 5500,
    durationMs: 1200,
    tokens: [
      { text: "absolutely", fromMs: 5500, toMs: 5950 },
      { text: "wild", fromMs: 6000, toMs: 6600 },
    ],
  },
  {
    text: "music never lies",
    startMs: 6900,
    durationMs: 1300,
    tokens: [
      { text: "music", fromMs: 6900, toMs: 7200 },
      { text: "never", fromMs: 7250, toMs: 7500 },
      { text: "lies", fromMs: 7550, toMs: 8100 },
    ],
  },
];

// ── Demo component ─────────────────────────────────────────────────────────

export const BeatBounceDemo: React.FC = () => {
  return (
    <AbsoluteFill>
      <Video
        src={staticFile("sample-video.mp4")}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
      <BeatBounce pages={PAGES} position="center" />
    </AbsoluteFill>
  );
};
