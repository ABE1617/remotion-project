import React from "react";
import { AbsoluteFill } from "remotion";
import { HormoziPopIn } from "../components/captions/HormoziPopIn";
import type { HormoziHighlightWord } from "../components/captions/HormoziPopIn";
import type { CaptionPage } from "../types/captions";

// Long realistic Hormozi-style monologue with precise word-level timing
// Each page is a natural phrase break -- no overlaps, no gaps in speech feel
const SAMPLE_PAGES: CaptionPage[] = [
  {
    text: "you need to stop",
    startMs: 100,
    durationMs: 900,
    tokens: [
      { text: "you", start: 100, end: 280 },
      { text: "need", start: 280, end: 460 },
      { text: "to", start: 460, end: 580 },
      { text: "stop", start: 580, end: 850 },
    ],
  },
  {
    text: "making excuses",
    startMs: 1050,
    durationMs: 800,
    tokens: [
      { text: "making", start: 1050, end: 1350 },
      { text: "excuses", start: 1350, end: 1750 },
    ],
  },
  {
    text: "and start taking",
    startMs: 1900,
    durationMs: 850,
    tokens: [
      { text: "and", start: 1900, end: 2050 },
      { text: "start", start: 2050, end: 2280 },
      { text: "taking", start: 2280, end: 2600 },
    ],
  },
  {
    text: "massive action",
    startMs: 2750,
    durationMs: 800,
    tokens: [
      { text: "massive", start: 2750, end: 3100 },
      { text: "action", start: 3100, end: 3450 },
    ],
  },
  {
    text: "every single day",
    startMs: 3600,
    durationMs: 850,
    tokens: [
      { text: "every", start: 3600, end: 3820 },
      { text: "single", start: 3820, end: 4050 },
      { text: "day", start: 4050, end: 4350 },
    ],
  },
  {
    text: "the people who win",
    startMs: 4500,
    durationMs: 900,
    tokens: [
      { text: "the", start: 4500, end: 4620 },
      { text: "people", start: 4620, end: 4850 },
      { text: "who", start: 4850, end: 5000 },
      { text: "win", start: 5000, end: 5300 },
    ],
  },
  {
    text: "are not smarter",
    startMs: 5450,
    durationMs: 800,
    tokens: [
      { text: "are", start: 5450, end: 5580 },
      { text: "not", start: 5580, end: 5730 },
      { text: "smarter", start: 5730, end: 6100 },
    ],
  },
  {
    text: "than you",
    startMs: 6250,
    durationMs: 600,
    tokens: [
      { text: "than", start: 6250, end: 6450 },
      { text: "you", start: 6450, end: 6750 },
    ],
  },
  {
    text: "they just outwork",
    startMs: 6900,
    durationMs: 850,
    tokens: [
      { text: "they", start: 6900, end: 7050 },
      { text: "just", start: 7050, end: 7230 },
      { text: "outwork", start: 7230, end: 7600 },
    ],
  },
  {
    text: "everyone else",
    startMs: 7750,
    durationMs: 700,
    tokens: [
      { text: "everyone", start: 7750, end: 8100 },
      { text: "else", start: 8100, end: 8350 },
    ],
  },
  {
    text: "that is the secret",
    startMs: 8500,
    durationMs: 900,
    tokens: [
      { text: "that", start: 8500, end: 8650 },
      { text: "is", start: 8650, end: 8780 },
      { text: "the", start: 8780, end: 8900 },
      { text: "secret", start: 8900, end: 9250 },
    ],
  },
  {
    text: "nobody wants to hear",
    startMs: 9400,
    durationMs: 900,
    tokens: [
      { text: "nobody", start: 9400, end: 9620 },
      { text: "wants", start: 9620, end: 9830 },
      { text: "to", start: 9830, end: 9950 },
      { text: "hear", start: 9950, end: 10200 },
    ],
  },
];

const HIGHLIGHT_WORDS: HormoziHighlightWord[] = [
  { text: "stop", color: "#F7C204" },
  { text: "excuses", color: "#F7C204" },
  { text: "massive", color: "#02FB23" },
  { text: "action", color: "#02FB23" },
  { text: "win", color: "#F7C204" },
  { text: "outwork", color: "#02FB23" },
  { text: "secret", color: "#F7C204" },
];

export const HormoziPopInDemo: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#111111" }}>
      <HormoziPopIn
        pages={SAMPLE_PAGES}
        highlightWords={HIGHLIGHT_WORDS}
      />
    </AbsoluteFill>
  );
};
