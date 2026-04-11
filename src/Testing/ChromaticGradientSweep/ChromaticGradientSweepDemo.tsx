import React from "react";
import { AbsoluteFill, staticFile } from "remotion";
import { Video } from "@remotion/media";
import { ChromaticGradientSweep } from "./ChromaticGradientSweep";
import type { TikTokPage } from "../../types/captions";

// ── Demo caption data ──────────────────────────────────────────────────────
// Energetic, vibrant content to match the chromatic palette.

const PAGES: TikTokPage[] = [
  {
    text: "color your world",
    startMs: 100,
    durationMs: 1500,
    tokens: [
      { text: "color", fromMs: 100, toMs: 500 },
      { text: "your", fromMs: 550, toMs: 820 },
      { text: "world", fromMs: 870, toMs: 1550 },
    ],
  },
  {
    text: "live in bold",
    startMs: 1750,
    durationMs: 1300,
    tokens: [
      { text: "live", fromMs: 1750, toMs: 2060 },
      { text: "in", fromMs: 2110, toMs: 2310 },
      { text: "bold", fromMs: 2360, toMs: 3000 },
    ],
  },
  {
    text: "chase every dream",
    startMs: 3200,
    durationMs: 1500,
    tokens: [
      { text: "chase", fromMs: 3200, toMs: 3600 },
      { text: "every", fromMs: 3650, toMs: 4050 },
      { text: "dream", fromMs: 4100, toMs: 4650 },
    ],
  },
  {
    text: "make it happen",
    startMs: 4850,
    durationMs: 1400,
    tokens: [
      { text: "make", fromMs: 4850, toMs: 5180 },
      { text: "it", fromMs: 5230, toMs: 5450 },
      { text: "happen", fromMs: 5500, toMs: 6200 },
    ],
  },
  {
    text: "shine every day",
    startMs: 6400,
    durationMs: 1450,
    tokens: [
      { text: "shine", fromMs: 6400, toMs: 6800 },
      { text: "every", fromMs: 6850, toMs: 7230 },
      { text: "day", fromMs: 7280, toMs: 7800 },
    ],
  },
  {
    text: "you are it",
    startMs: 8000,
    durationMs: 1200,
    tokens: [
      { text: "you", fromMs: 8000, toMs: 8280 },
      { text: "are", fromMs: 8330, toMs: 8580 },
      { text: "it", fromMs: 8630, toMs: 9150 },
    ],
  },
];

// ── Demo component ─────────────────────────────────────────────────────────

export const ChromaticGradientSweepDemo: React.FC = () => {
  return (
    <AbsoluteFill>
      <Video
        src={staticFile("sample-video.mp4")}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
      <ChromaticGradientSweep pages={PAGES} position="center" />
    </AbsoluteFill>
  );
};
