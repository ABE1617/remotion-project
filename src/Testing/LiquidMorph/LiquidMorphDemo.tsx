import React from "react";
import { AbsoluteFill, staticFile } from "remotion";
import { Video } from "@remotion/media";
import { LiquidMorph } from "./LiquidMorph";
import type { TikTokPage } from "../../types/captions";

// ── Demo caption data ──────────────────────────────────────────────────────
// Motivational text with clear page breaks. 6 pages, ~8 seconds.
// Gaps of ~200ms between pages allow liquid morph transitions to breathe.

const PAGES: TikTokPage[] = [
  {
    text: "success isn't given",
    startMs: 200,
    durationMs: 1200,
    tokens: [
      { text: "success", fromMs: 200, toMs: 550 },
      { text: "isn't", fromMs: 600, toMs: 900 },
      { text: "given", fromMs: 950, toMs: 1300 },
    ],
  },
  {
    text: "it's earned daily",
    startMs: 1600,
    durationMs: 1200,
    tokens: [
      { text: "it's", fromMs: 1600, toMs: 1850 },
      { text: "earned", fromMs: 1900, toMs: 2200 },
      { text: "daily", fromMs: 2250, toMs: 2700 },
    ],
  },
  {
    text: "through the grind",
    startMs: 3000,
    durationMs: 1200,
    tokens: [
      { text: "through", fromMs: 3000, toMs: 3300 },
      { text: "the", fromMs: 3350, toMs: 3550 },
      { text: "grind", fromMs: 3600, toMs: 4100 },
    ],
  },
  {
    text: "and the discipline",
    startMs: 4400,
    durationMs: 1200,
    tokens: [
      { text: "and", fromMs: 4400, toMs: 4600 },
      { text: "the", fromMs: 4650, toMs: 4800 },
      { text: "discipline", fromMs: 4850, toMs: 5500 },
    ],
  },
  {
    text: "to never quit",
    startMs: 5800,
    durationMs: 1200,
    tokens: [
      { text: "to", fromMs: 5800, toMs: 5950 },
      { text: "never", fromMs: 6000, toMs: 6350 },
      { text: "quit", fromMs: 6400, toMs: 6900 },
    ],
  },
  {
    text: "no matter what",
    startMs: 7200,
    durationMs: 1400,
    tokens: [
      { text: "no", fromMs: 7200, toMs: 7400 },
      { text: "matter", fromMs: 7450, toMs: 7750 },
      { text: "what", fromMs: 7800, toMs: 8500 },
    ],
  },
];

// ── Demo component ─────────────────────────────────────────────────────────

export const LiquidMorphDemo: React.FC = () => {
  return (
    <AbsoluteFill>
      <Video
        src={staticFile("sample-video.mp4")}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
      <LiquidMorph pages={PAGES} position="center" />
    </AbsoluteFill>
  );
};
