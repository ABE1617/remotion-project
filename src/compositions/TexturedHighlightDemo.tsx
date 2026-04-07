import React from "react";
import { AbsoluteFill } from "remotion";
import { TexturedHighlight } from "../components/captions/TexturedHighlight";
import type { TexturedHighlightWord } from "../components/captions/TexturedHighlight";
import type { CaptionPage } from "../types/captions";

// Motivational speech -- textured keywords pop with organic fills
const SAMPLE_PAGES: CaptionPage[] = [
  {
    text: "your mind is a weapon",
    startMs: 100,
    durationMs: 900,
    tokens: [
      { text: "your", start: 100, end: 300 },
      { text: "mind", start: 300, end: 520 },
      { text: "is", start: 520, end: 640 },
      { text: "a", start: 640, end: 730 },
      { text: "weapon", start: 730, end: 950 },
    ],
  },
  {
    text: "sharpen it daily",
    startMs: 1100,
    durationMs: 800,
    tokens: [
      { text: "sharpen", start: 1100, end: 1450 },
      { text: "it", start: 1450, end: 1580 },
      { text: "daily", start: 1580, end: 1850 },
    ],
  },
  {
    text: "the grind never stops",
    startMs: 2000,
    durationMs: 900,
    tokens: [
      { text: "the", start: 2000, end: 2150 },
      { text: "grind", start: 2150, end: 2450 },
      { text: "never", start: 2450, end: 2650 },
      { text: "stops", start: 2650, end: 2850 },
    ],
  },
  {
    text: "build an empire",
    startMs: 3000,
    durationMs: 850,
    tokens: [
      { text: "build", start: 3000, end: 3250 },
      { text: "an", start: 3250, end: 3400 },
      { text: "empire", start: 3400, end: 3750 },
    ],
  },
  {
    text: "from the fire inside you",
    startMs: 3950,
    durationMs: 1000,
    tokens: [
      { text: "from", start: 3950, end: 4100 },
      { text: "the", start: 4100, end: 4230 },
      { text: "fire", start: 4230, end: 4500 },
      { text: "inside", start: 4500, end: 4700 },
      { text: "you", start: 4700, end: 4850 },
    ],
  },
  {
    text: "pain is just growth",
    startMs: 5050,
    durationMs: 900,
    tokens: [
      { text: "pain", start: 5050, end: 5300 },
      { text: "is", start: 5300, end: 5420 },
      { text: "just", start: 5420, end: 5600 },
      { text: "growth", start: 5600, end: 5900 },
    ],
  },
  {
    text: "in disguise",
    startMs: 6050,
    durationMs: 700,
    tokens: [
      { text: "in", start: 6050, end: 6200 },
      { text: "disguise", start: 6200, end: 6650 },
    ],
  },
  {
    text: "stay hungry stay humble",
    startMs: 6900,
    durationMs: 1000,
    tokens: [
      { text: "stay", start: 6900, end: 7100 },
      { text: "hungry", start: 7100, end: 7400 },
      { text: "stay", start: 7400, end: 7600 },
      { text: "humble", start: 7600, end: 7850 },
    ],
  },
  {
    text: "conquer yourself first",
    startMs: 8000,
    durationMs: 900,
    tokens: [
      { text: "conquer", start: 8000, end: 8350 },
      { text: "yourself", start: 8350, end: 8600 },
      { text: "first", start: 8600, end: 8850 },
    ],
  },
];

// Keywords with different texture presets
const HIGHLIGHT_WORDS: TexturedHighlightWord[] = [
  { text: "weapon", texture: "forest" },
  { text: "sharpen", texture: "forest" },
  { text: "grind", texture: "ocean" },
  { text: "empire", texture: "royal" },
  { text: "fire", texture: "ember" },
  { text: "growth", texture: "forest" },
  { text: "hungry", texture: "ember" },
  { text: "conquer", texture: "royal" },
];

export const TexturedHighlightDemo: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#0e0e0e" }}>
      <TexturedHighlight
        pages={SAMPLE_PAGES}
        highlightWords={HIGHLIGHT_WORDS}
        texturePreset="forest"
        enableGlow={true}
      />
    </AbsoluteFill>
  );
};
