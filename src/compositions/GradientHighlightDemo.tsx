import React from "react";
import { AbsoluteFill, staticFile } from "remotion";
import { Video } from "@remotion/media";
import { GradientHighlight } from "../components/captions/GradientHighlight";
import type { GradientHighlightWord } from "../components/captions/GradientHighlight";
import type { TikTokPage } from "../types/captions";

const BOTTOM_PAGES: TikTokPage[] = [
  {
    text: "your mind is",
    startMs: 100,
    durationMs: 600,
    tokens: [
      { text: "your", fromMs: 100, toMs: 300 },
      { text: "mind", fromMs: 300, toMs: 500 },
      { text: "is", fromMs: 500, toMs: 650 },
    ],
  },
  {
    text: "a weapon",
    startMs: 750,
    durationMs: 500,
    tokens: [
      { text: "a", fromMs: 750, toMs: 900 },
      { text: "weapon", fromMs: 900, toMs: 1200 },
    ],
  },
  {
    text: "sharpen it daily",
    startMs: 1350,
    durationMs: 700,
    tokens: [
      { text: "sharpen", fromMs: 1350, toMs: 1600 },
      { text: "it", fromMs: 1600, toMs: 1700 },
      { text: "daily", fromMs: 1700, toMs: 2000 },
    ],
  },
  {
    text: "the grind",
    startMs: 2150,
    durationMs: 500,
    tokens: [
      { text: "the", fromMs: 2150, toMs: 2350 },
      { text: "grind", fromMs: 2350, toMs: 2600 },
    ],
  },
  {
    text: "never stops",
    startMs: 2700,
    durationMs: 500,
    tokens: [
      { text: "never", fromMs: 2700, toMs: 2900 },
      { text: "stops", fromMs: 2900, toMs: 3150 },
    ],
  },
  {
    text: "build an empire",
    startMs: 3300,
    durationMs: 700,
    tokens: [
      { text: "build", fromMs: 3300, toMs: 3500 },
      { text: "an", fromMs: 3500, toMs: 3650 },
      { text: "empire", fromMs: 3650, toMs: 3950 },
    ],
  },
];

const TOP_PAGES: TikTokPage[] = [
  {
    text: "from the fire",
    startMs: 4100,
    durationMs: 600,
    tokens: [
      { text: "from", fromMs: 4100, toMs: 4250 },
      { text: "the", fromMs: 4250, toMs: 4400 },
      { text: "fire", fromMs: 4400, toMs: 4650 },
    ],
  },
  {
    text: "inside you",
    startMs: 4750,
    durationMs: 500,
    tokens: [
      { text: "inside", fromMs: 4750, toMs: 4950 },
      { text: "you", fromMs: 4950, toMs: 5200 },
    ],
  },
  {
    text: "pain is growth",
    startMs: 5350,
    durationMs: 600,
    tokens: [
      { text: "pain", fromMs: 5350, toMs: 5550 },
      { text: "is", fromMs: 5550, toMs: 5650 },
      { text: "growth", fromMs: 5650, toMs: 5900 },
    ],
  },
  {
    text: "stay hungry",
    startMs: 6050,
    durationMs: 500,
    tokens: [
      { text: "stay", fromMs: 6050, toMs: 6250 },
      { text: "hungry", fromMs: 6250, toMs: 6500 },
    ],
  },
  {
    text: "conquer yourself",
    startMs: 6650,
    durationMs: 600,
    tokens: [
      { text: "conquer", fromMs: 6650, toMs: 6900 },
      { text: "yourself", fromMs: 6900, toMs: 7200 },
    ],
  },
];

const HIGHLIGHT_WORDS: GradientHighlightWord[] = [
  { text: "weapon", texture: "ember" },
  { text: "sharpen", texture: "ember" },
  { text: "grind", texture: "ember" },
  { text: "empire", texture: "ember" },
  { text: "fire", texture: "ember" },
  { text: "growth", texture: "ember" },
  { text: "hungry", texture: "ember" },
  { text: "conquer", texture: "ember" },
];

export const GradientHighlightDemo: React.FC = () => {
  return (
    <AbsoluteFill>
      <Video
        src={staticFile("sample-video.mp4")}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
      <GradientHighlight
        pages={BOTTOM_PAGES}
        highlightWords={HIGHLIGHT_WORDS}
        texturePreset="ember"
        position="bottom"
      />
      <GradientHighlight
        pages={TOP_PAGES}
        highlightWords={HIGHLIGHT_WORDS}
        texturePreset="ember"
        position="top"
      />
    </AbsoluteFill>
  );
};
