import React from "react";
import { AbsoluteFill, staticFile } from "remotion";
import { Video } from "@remotion/media";
import { ParticleDissolve } from "./ParticleDissolve";
import type { TikTokPage } from "../../types/captions";

// ── Demo caption data ──────────────────────────────────────────────────────
// Words that evoke formation / emergence — complements the particle aesthetic.
// Words are spaced with enough duration (400-600ms) to fully resolve before
// the next appears, so you see each particle convergence.

const PAGES: TikTokPage[] = [
  {
    text: "from nothing comes",
    startMs: 100,
    durationMs: 1600,
    tokens: [
      { text: "from", fromMs: 100, toMs: 500 },
      { text: "nothing", fromMs: 550, toMs: 1050 },
      { text: "comes", fromMs: 1100, toMs: 1650 },
    ],
  },
  {
    text: "everything great",
    startMs: 1850,
    durationMs: 1400,
    tokens: [
      { text: "everything", fromMs: 1850, toMs: 2480 },
      { text: "great", fromMs: 2530, toMs: 3200 },
    ],
  },
  {
    text: "ideas emerge slow",
    startMs: 3400,
    durationMs: 1600,
    tokens: [
      { text: "ideas", fromMs: 3400, toMs: 3870 },
      { text: "emerge", fromMs: 3920, toMs: 4420 },
      { text: "slow", fromMs: 4470, toMs: 4950 },
    ],
  },
  {
    text: "then they ignite",
    startMs: 5150,
    durationMs: 1500,
    tokens: [
      { text: "then", fromMs: 5150, toMs: 5480 },
      { text: "they", fromMs: 5530, toMs: 5850 },
      { text: "ignite", fromMs: 5900, toMs: 6600 },
    ],
  },
  {
    text: "matter into mind",
    startMs: 6800,
    durationMs: 1500,
    tokens: [
      { text: "matter", fromMs: 6800, toMs: 7280 },
      { text: "into", fromMs: 7330, toMs: 7680 },
      { text: "mind", fromMs: 7730, toMs: 8250 },
    ],
  },
  {
    text: "you are energy",
    startMs: 8450,
    durationMs: 1300,
    tokens: [
      { text: "you", fromMs: 8450, toMs: 8730 },
      { text: "are", fromMs: 8780, toMs: 9020 },
      { text: "energy", fromMs: 9070, toMs: 9700 },
    ],
  },
];

// ── Demo component ─────────────────────────────────────────────────────────

export const ParticleDissolveDemo: React.FC = () => {
  return (
    <AbsoluteFill>
      <Video
        src={staticFile("sample-video.mp4")}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
      <ParticleDissolve pages={PAGES} position="center" />
    </AbsoluteFill>
  );
};
