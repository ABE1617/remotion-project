import React from "react";
import { AbsoluteFill, staticFile } from "remotion";
import { Video } from "@remotion/media";
import { NeonPulse } from "./NeonPulse";
import type { TikTokPage } from "../../types/captions";

// ── Demo caption data ──────────────────────────────────────────────────────
// Cyberpunk-themed text, 4 pages, ~5.3 seconds total.

const PAGES: TikTokPage[] = [
  {
    text: "the future is electric",
    startMs: 200,
    durationMs: 1200,
    tokens: [
      { text: "the", fromMs: 200, toMs: 400 },
      { text: "future", fromMs: 400, toMs: 700 },
      { text: "is", fromMs: 700, toMs: 900 },
      { text: "electric", fromMs: 900, toMs: 1400 },
    ],
  },
  {
    text: "neon lights never fade",
    startMs: 1500,
    durationMs: 1300,
    tokens: [
      { text: "neon", fromMs: 1500, toMs: 1750 },
      { text: "lights", fromMs: 1750, toMs: 2050 },
      { text: "never", fromMs: 2050, toMs: 2350 },
      { text: "fade", fromMs: 2350, toMs: 2800 },
    ],
  },
  {
    text: "glow different",
    startMs: 2900,
    durationMs: 1000,
    tokens: [
      { text: "glow", fromMs: 2900, toMs: 3200 },
      { text: "different", fromMs: 3200, toMs: 3900 },
    ],
  },
  {
    text: "turn the signal on",
    startMs: 4000,
    durationMs: 1300,
    tokens: [
      { text: "turn", fromMs: 4000, toMs: 4250 },
      { text: "the", fromMs: 4250, toMs: 4450 },
      { text: "signal", fromMs: 4450, toMs: 4800 },
      { text: "on", fromMs: 4800, toMs: 5300 },
    ],
  },
];

// ── Demo component ─────────────────────────────────────────────────────────

export const NeonPulseDemo: React.FC = () => {
  return (
    <AbsoluteFill>
      <Video
        src={staticFile("sample-video.mp4")}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
      <NeonPulse
        pages={PAGES}
        position="bottom"
        colorScheme="electricBlue"
      />
    </AbsoluteFill>
  );
};
