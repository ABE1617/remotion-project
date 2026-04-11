import React from "react";
import { AbsoluteFill, staticFile } from "remotion";
import { Video } from "@remotion/media";
import { SurveillanceHUD } from "./SurveillanceHUD";
import type { TikTokPage } from "../../types/captions";

// ── Demo caption data ──────────────────────────────────────────────────────
// Tactical/intel-style content — works with the surveillance aesthetic.

const PAGES: TikTokPage[] = [
  {
    text: "most people never",
    startMs: 100,
    durationMs: 1400,
    tokens: [
      { text: "most", fromMs: 100, toMs: 440 },
      { text: "people", fromMs: 490, toMs: 880 },
      { text: "never", fromMs: 930, toMs: 1450 },
    ],
  },
  {
    text: "see the pattern",
    startMs: 1650,
    durationMs: 1350,
    tokens: [
      { text: "see", fromMs: 1650, toMs: 1920 },
      { text: "the", fromMs: 1970, toMs: 2170 },
      { text: "pattern", fromMs: 2220, toMs: 2950 },
    ],
  },
  {
    text: "data reveals all",
    startMs: 3150,
    durationMs: 1500,
    tokens: [
      { text: "data", fromMs: 3150, toMs: 3520 },
      { text: "reveals", fromMs: 3570, toMs: 4020 },
      { text: "all", fromMs: 4070, toMs: 4600 },
    ],
  },
  {
    text: "watch and learn",
    startMs: 4800,
    durationMs: 1400,
    tokens: [
      { text: "watch", fromMs: 4800, toMs: 5150 },
      { text: "and", fromMs: 5200, toMs: 5420 },
      { text: "learn", fromMs: 5470, toMs: 6150 },
    ],
  },
  {
    text: "adapt or fail",
    startMs: 6350,
    durationMs: 1350,
    tokens: [
      { text: "adapt", fromMs: 6350, toMs: 6750 },
      { text: "or", fromMs: 6800, toMs: 6980 },
      { text: "fail", fromMs: 7030, toMs: 7650 },
    ],
  },
  {
    text: "signal acquired",
    startMs: 7850,
    durationMs: 1200,
    tokens: [
      { text: "signal", fromMs: 7850, toMs: 8330 },
      { text: "acquired", fromMs: 8380, toMs: 9000 },
    ],
  },
];

// ── Demo component ─────────────────────────────────────────────────────────

export const SurveillanceHUDDemo: React.FC = () => {
  return (
    <AbsoluteFill>
      <Video
        src={staticFile("sample-video.mp4")}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
      {/* Subtle dark overlay to make the green text legible over any video */}
      <AbsoluteFill style={{ background: "rgba(0,10,2,0.25)" }} />
      <SurveillanceHUD pages={PAGES} position="center" />
    </AbsoluteFill>
  );
};
