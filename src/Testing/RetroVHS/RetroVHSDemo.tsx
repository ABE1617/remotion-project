import React from "react";
import { AbsoluteFill, staticFile } from "remotion";
import { Video } from "@remotion/media";
import { RetroVHS } from "./RetroVHS";
import type { TikTokPage } from "../../types/captions";

// ── Demo caption data ──────────────────────────────────────────────────────
// Nostalgic, throwback content — matches the retro VHS aesthetic.

const PAGES: TikTokPage[] = [
  {
    text: "back in the day",
    startMs: 100,
    durationMs: 1500,
    tokens: [
      { text: "back", fromMs: 100, toMs: 440 },
      { text: "in", fromMs: 490, toMs: 680 },
      { text: "the", fromMs: 730, toMs: 940 },
      { text: "day", fromMs: 990, toMs: 1550 },
    ],
  },
  {
    text: "we had no fear",
    startMs: 1750,
    durationMs: 1400,
    tokens: [
      { text: "we", fromMs: 1750, toMs: 1980 },
      { text: "had", fromMs: 2030, toMs: 2290 },
      { text: "no", fromMs: 2340, toMs: 2560 },
      { text: "fear", fromMs: 2610, toMs: 3100 },
    ],
  },
  {
    text: "rewind the tape",
    startMs: 3300,
    durationMs: 1350,
    tokens: [
      { text: "rewind", fromMs: 3300, toMs: 3760 },
      { text: "the", fromMs: 3810, toMs: 4010 },
      { text: "tape", fromMs: 4060, toMs: 4600 },
    ],
  },
  {
    text: "signal lost found",
    startMs: 4800,
    durationMs: 1500,
    tokens: [
      { text: "signal", fromMs: 4800, toMs: 5220 },
      { text: "lost", fromMs: 5270, toMs: 5580 },
      { text: "found", fromMs: 5630, toMs: 6250 },
    ],
  },
  {
    text: "static never dies",
    startMs: 6450,
    durationMs: 1450,
    tokens: [
      { text: "static", fromMs: 6450, toMs: 6880 },
      { text: "never", fromMs: 6930, toMs: 7310 },
      { text: "dies", fromMs: 7360, toMs: 7850 },
    ],
  },
  {
    text: "play it again",
    startMs: 8050,
    durationMs: 1250,
    tokens: [
      { text: "play", fromMs: 8050, toMs: 8370 },
      { text: "it", fromMs: 8420, toMs: 8620 },
      { text: "again", fromMs: 8670, toMs: 9250 },
    ],
  },
];

// ── Demo component ─────────────────────────────────────────────────────────

export const RetroVHSDemo: React.FC = () => {
  return (
    <AbsoluteFill>
      <Video
        src={staticFile("sample-video.mp4")}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
      {/* Warm slight sepia overlay — enhances VHS feel over any video */}
      <AbsoluteFill style={{ background: "rgba(40,25,10,0.18)" }} />
      <RetroVHS pages={PAGES} position="center" />
    </AbsoluteFill>
  );
};
