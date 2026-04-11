import React from "react";
import { AbsoluteFill, staticFile } from "remotion";
import { Video } from "@remotion/media";
import { HormoziEvolved } from "./HormoziEvolved";
import type { EvolvedHighlightWord } from "./types";
import type { TikTokPage } from "../../types/captions";

// ── Demo caption data ──────────────────────────────────────────────────────

const PAGES: TikTokPage[] = [
  {
    text: "the only thing",
    startMs: 100,
    durationMs: 850,
    tokens: [
      { text: "the", fromMs: 100, toMs: 300 },
      { text: "only", fromMs: 300, toMs: 550 },
      { text: "thing", fromMs: 550, toMs: 950 },
    ],
  },
  {
    text: "stopping you",
    startMs: 1050,
    durationMs: 700,
    tokens: [
      { text: "stopping", fromMs: 1050, toMs: 1400 },
      { text: "you", fromMs: 1400, toMs: 1750 },
    ],
  },
  {
    text: "is the story",
    startMs: 1850,
    durationMs: 800,
    tokens: [
      { text: "is", fromMs: 1850, toMs: 2050 },
      { text: "the", fromMs: 2050, toMs: 2250 },
      { text: "story", fromMs: 2250, toMs: 2650 },
    ],
  },
  {
    text: "you keep telling",
    startMs: 2750,
    durationMs: 850,
    tokens: [
      { text: "you", fromMs: 2750, toMs: 2950 },
      { text: "keep", fromMs: 2950, toMs: 3200 },
      { text: "telling", fromMs: 3200, toMs: 3600 },
    ],
  },
  {
    text: "yourself",
    startMs: 3700,
    durationMs: 700,
    tokens: [
      { text: "yourself", fromMs: 3700, toMs: 4400 },
    ],
  },
  {
    text: "winners do not wait",
    startMs: 4500,
    durationMs: 1000,
    tokens: [
      { text: "winners", fromMs: 4500, toMs: 4750 },
      { text: "do", fromMs: 4750, toMs: 4900 },
      { text: "not", fromMs: 4900, toMs: 5100 },
      { text: "wait", fromMs: 5100, toMs: 5500 },
    ],
  },
  {
    text: "for the perfect moment",
    startMs: 5600,
    durationMs: 1000,
    tokens: [
      { text: "for", fromMs: 5600, toMs: 5780 },
      { text: "the", fromMs: 5780, toMs: 5950 },
      { text: "perfect", fromMs: 5950, toMs: 6250 },
      { text: "moment", fromMs: 6250, toMs: 6600 },
    ],
  },
  {
    text: "they create it",
    startMs: 6700,
    durationMs: 900,
    tokens: [
      { text: "they", fromMs: 6700, toMs: 6900 },
      { text: "create", fromMs: 6900, toMs: 7200 },
      { text: "it", fromMs: 7200, toMs: 7600 },
    ],
  },
];

const HIGHLIGHT_WORDS: EvolvedHighlightWord[] = [
  { text: "stopping", color: "#F7C204" },
  { text: "story", color: "#F7C204" },
  { text: "yourself", color: "#02FB23" },
  { text: "winners", color: "#02FB23" },
  { text: "perfect", color: "#F7C204" },
  { text: "create", color: "#02FB23" },
];

// ── Demo component ─────────────────────────────────────────────────────────

export const HormoziEvolvedDemo: React.FC = () => {
  return (
    <AbsoluteFill>
      <Video
        src={staticFile("sample-video.mp4")}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
      <HormoziEvolved
        pages={PAGES}
        highlightWords={HIGHLIGHT_WORDS}
        position="center"
      />
    </AbsoluteFill>
  );
};
