import React from "react";
import { AbsoluteFill, staticFile } from "remotion";
import { Video } from "@remotion/media";
import { ParallaxPop3D } from "./ParallaxPop3D";
import type { TikTokPage } from "../../types/captions";

// ── Demo caption data ──────────────────────────────────────────────────────
// Punchy motivational text, 6 pages, ~6 seconds total.

const PAGES: TikTokPage[] = [
  {
    text: "nothing",
    startMs: 300,
    durationMs: 300,
    tokens: [{ text: "nothing", fromMs: 300, toMs: 600 }],
  },
  {
    text: "great",
    startMs: 600,
    durationMs: 300,
    tokens: [{ text: "great", fromMs: 600, toMs: 900 }],
  },
  {
    text: "comes",
    startMs: 900,
    durationMs: 500,
    tokens: [{ text: "comes", fromMs: 900, toMs: 1400 }],
  },
  {
    text: "from",
    startMs: 1500,
    durationMs: 250,
    tokens: [{ text: "from", fromMs: 1500, toMs: 1750 }],
  },
  {
    text: "comfort",
    startMs: 1750,
    durationMs: 350,
    tokens: [{ text: "comfort", fromMs: 1750, toMs: 2100 }],
  },
  {
    text: "zones",
    startMs: 2100,
    durationMs: 500,
    tokens: [{ text: "zones", fromMs: 2100, toMs: 2600 }],
  },
  {
    text: "push",
    startMs: 2700,
    durationMs: 300,
    tokens: [{ text: "push", fromMs: 2700, toMs: 3000 }],
  },
  {
    text: "yourself",
    startMs: 3000,
    durationMs: 600,
    tokens: [{ text: "yourself", fromMs: 3000, toMs: 3600 }],
  },
  {
    text: "beyond",
    startMs: 3700,
    durationMs: 300,
    tokens: [{ text: "beyond", fromMs: 3700, toMs: 4000 }],
  },
  {
    text: "the",
    startMs: 4000,
    durationMs: 150,
    tokens: [{ text: "the", fromMs: 4000, toMs: 4150 }],
  },
  {
    text: "limits",
    startMs: 4150,
    durationMs: 650,
    tokens: [{ text: "limits", fromMs: 4150, toMs: 4800 }],
  },
  {
    text: "you",
    startMs: 4900,
    durationMs: 200,
    tokens: [{ text: "you", fromMs: 4900, toMs: 5100 }],
  },
  {
    text: "thought",
    startMs: 5100,
    durationMs: 300,
    tokens: [{ text: "thought", fromMs: 5100, toMs: 5400 }],
  },
  {
    text: "existed",
    startMs: 5400,
    durationMs: 600,
    tokens: [{ text: "existed", fromMs: 5400, toMs: 6000 }],
  },
  {
    text: "rise",
    startMs: 6100,
    durationMs: 250,
    tokens: [{ text: "rise", fromMs: 6100, toMs: 6350 }],
  },
  {
    text: "and",
    startMs: 6350,
    durationMs: 150,
    tokens: [{ text: "and", fromMs: 6350, toMs: 6500 }],
  },
  {
    text: "grind",
    startMs: 6500,
    durationMs: 500,
    tokens: [{ text: "grind", fromMs: 6500, toMs: 7000 }],
  },
];

// ── Demo component ─────────────────────────────────────────────────────────

export const ParallaxPop3DDemo: React.FC = () => {
  return (
    <AbsoluteFill>
      <Video
        src={staticFile("sample-video.mp4")}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
      <ParallaxPop3D pages={PAGES} position="bottom" />
    </AbsoluteFill>
  );
};
