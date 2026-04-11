import React from "react";
import { AbsoluteFill, staticFile } from "remotion";
import { Video } from "@remotion/media";
import { KineticScatter } from "./KineticScatter";
import type { TikTokPage } from "../../types/captions";

// ── Demo caption data ──────────────────────────────────────────────────────
// Short punchy words (3-7 chars) work best for scatter — each letter needs
// room to scatter individually. ~8 seconds, one word at a time.

const PAGES: TikTokPage[] = [
  {
    text: "nothing",
    startMs: 200,
    durationMs: 600,
    tokens: [{ text: "nothing", fromMs: 200, toMs: 700 }],
  },
  {
    text: "stops",
    startMs: 1000,
    durationMs: 550,
    tokens: [{ text: "stops", fromMs: 1000, toMs: 1450 }],
  },
  {
    text: "a",
    startMs: 1700,
    durationMs: 350,
    tokens: [{ text: "a", fromMs: 1700, toMs: 1950 }],
  },
  {
    text: "mind",
    startMs: 2200,
    durationMs: 550,
    tokens: [{ text: "mind", fromMs: 2200, toMs: 2650 }],
  },
  {
    text: "on",
    startMs: 2900,
    durationMs: 400,
    tokens: [{ text: "on", fromMs: 2900, toMs: 3200 }],
  },
  {
    text: "fire",
    startMs: 3500,
    durationMs: 600,
    tokens: [{ text: "fire", fromMs: 3500, toMs: 4000 }],
  },
  {
    text: "burn",
    startMs: 4500,
    durationMs: 550,
    tokens: [{ text: "burn", fromMs: 4500, toMs: 4950 }],
  },
  {
    text: "bright",
    startMs: 5300,
    durationMs: 700,
    tokens: [{ text: "bright", fromMs: 5300, toMs: 5900 }],
  },
  {
    text: "never",
    startMs: 6200,
    durationMs: 550,
    tokens: [{ text: "never", fromMs: 6200, toMs: 6650 }],
  },
  {
    text: "quit",
    startMs: 6900,
    durationMs: 600,
    tokens: [{ text: "quit", fromMs: 6900, toMs: 7400 }],
  },
  {
    text: "now",
    startMs: 7700,
    durationMs: 600,
    tokens: [{ text: "now", fromMs: 7700, toMs: 8200 }],
  },
];

// ── Demo component ─────────────────────────────────────────────────────────

export const KineticScatterDemo: React.FC = () => {
  return (
    <AbsoluteFill>
      <Video
        src={staticFile("sample-video.mp4")}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
      <KineticScatter pages={PAGES} position="center" />
    </AbsoluteFill>
  );
};
