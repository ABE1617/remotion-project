import React from "react";
import { AbsoluteFill, staticFile } from "remotion";
import { Video } from "@remotion/media";
import { StaggerWave } from "./StaggerWave";
import type { TikTokPage } from "../../types/captions";

// ── Demo caption data ──────────────────────────────────────────────────────
// Rhythmic, energetic phrases — the stagger wave entry feels best with
// content that has a natural cadence.

const PAGES: TikTokPage[] = [
  {
    text: "rise above the noise",
    startMs: 100,
    durationMs: 1600,
    tokens: [
      { text: "rise", fromMs: 100, toMs: 420 },
      { text: "above", fromMs: 470, toMs: 820 },
      { text: "the", fromMs: 870, toMs: 1060 },
      { text: "noise", fromMs: 1110, toMs: 1650 },
    ],
  },
  {
    text: "stay in motion",
    startMs: 1850,
    durationMs: 1350,
    tokens: [
      { text: "stay", fromMs: 1850, toMs: 2170 },
      { text: "in", fromMs: 2220, toMs: 2420 },
      { text: "motion", fromMs: 2470, toMs: 3150 },
    ],
  },
  {
    text: "build something real",
    startMs: 3350,
    durationMs: 1500,
    tokens: [
      { text: "build", fromMs: 3350, toMs: 3720 },
      { text: "something", fromMs: 3770, toMs: 4250 },
      { text: "real", fromMs: 4300, toMs: 4800 },
    ],
  },
  {
    text: "every rep counts",
    startMs: 5000,
    durationMs: 1400,
    tokens: [
      { text: "every", fromMs: 5000, toMs: 5350 },
      { text: "rep", fromMs: 5400, toMs: 5680 },
      { text: "counts", fromMs: 5730, toMs: 6350 },
    ],
  },
  {
    text: "no days off",
    startMs: 6550,
    durationMs: 1200,
    tokens: [
      { text: "no", fromMs: 6550, toMs: 6800 },
      { text: "days", fromMs: 6850, toMs: 7180 },
      { text: "off", fromMs: 7230, toMs: 7700 },
    ],
  },
  {
    text: "push the limit",
    startMs: 7900,
    durationMs: 1350,
    tokens: [
      { text: "push", fromMs: 7900, toMs: 8220 },
      { text: "the", fromMs: 8270, toMs: 8480 },
      { text: "limit", fromMs: 8530, toMs: 9200 },
    ],
  },
];

// ── Demo component ─────────────────────────────────────────────────────────

export const StaggerWaveDemo: React.FC = () => {
  return (
    <AbsoluteFill>
      <Video
        src={staticFile("sample-video.mp4")}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
      <StaggerWave pages={PAGES} position="center" />
    </AbsoluteFill>
  );
};
