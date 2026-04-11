import React from "react";
import { AbsoluteFill, staticFile } from "remotion";
import { Video } from "@remotion/media";
import { MagazineCutout } from "./MagazineCutout";
import type { TikTokPage } from "../../types/captions";

// ── Demo caption data ──────────────────────────────────────────────────────
// Dramatic, confrontational phrases — the ransom-note cutout aesthetic
// works best with charged, declarative statements.

const PAGES: TikTokPage[] = [
  {
    text: "they never told you",
    startMs: 100,
    durationMs: 1600,
    tokens: [
      { text: "they", fromMs: 100, toMs: 420 },
      { text: "never", fromMs: 470, toMs: 820 },
      { text: "told", fromMs: 870, toMs: 1180 },
      { text: "you", fromMs: 1230, toMs: 1650 },
    ],
  },
  {
    text: "the real truth",
    startMs: 1850,
    durationMs: 1300,
    tokens: [
      { text: "the", fromMs: 1850, toMs: 2100 },
      { text: "real", fromMs: 2150, toMs: 2520 },
      { text: "truth", fromMs: 2570, toMs: 3100 },
    ],
  },
  {
    text: "money loves speed",
    startMs: 3300,
    durationMs: 1500,
    tokens: [
      { text: "money", fromMs: 3300, toMs: 3720 },
      { text: "loves", fromMs: 3770, toMs: 4120 },
      { text: "speed", fromMs: 4170, toMs: 4750 },
    ],
  },
  {
    text: "slow is broke",
    startMs: 4950,
    durationMs: 1300,
    tokens: [
      { text: "slow", fromMs: 4950, toMs: 5260 },
      { text: "is", fromMs: 5310, toMs: 5520 },
      { text: "broke", fromMs: 5570, toMs: 6200 },
    ],
  },
  {
    text: "decide and move",
    startMs: 6400,
    durationMs: 1400,
    tokens: [
      { text: "decide", fromMs: 6400, toMs: 6870 },
      { text: "and", fromMs: 6920, toMs: 7150 },
      { text: "move", fromMs: 7200, toMs: 7750 },
    ],
  },
  {
    text: "right now",
    startMs: 7950,
    durationMs: 1000,
    tokens: [
      { text: "right", fromMs: 7950, toMs: 8320 },
      { text: "now", fromMs: 8370, toMs: 8900 },
    ],
  },
];

// ── Demo component ─────────────────────────────────────────────────────────

export const MagazineCutoutDemo: React.FC = () => {
  return (
    <AbsoluteFill>
      <Video
        src={staticFile("sample-video.mp4")}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
      <MagazineCutout pages={PAGES} position="center" />
    </AbsoluteFill>
  );
};
