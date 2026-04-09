import React from "react";
import { AbsoluteFill, staticFile } from "remotion";
import { Video } from "@remotion/media";
import { HormoziPopIn } from "../components/captions/HormoziPopIn";
import type { HormoziHighlightWord } from "../components/captions/HormoziPopIn";
import type { TikTokPage } from "../types/captions";

const BOTTOM_PAGES: TikTokPage[] = [
  {
    text: "you need to stop",
    startMs: 100,
    durationMs: 900,
    tokens: [
      { text: "you", fromMs: 100, toMs: 280 },
      { text: "need", fromMs: 280, toMs: 460 },
      { text: "to", fromMs: 460, toMs: 580 },
      { text: "stop", fromMs: 580, toMs: 850 },
    ],
  },
  {
    text: "making excuses",
    startMs: 1050,
    durationMs: 800,
    tokens: [
      { text: "making", fromMs: 1050, toMs: 1350 },
      { text: "excuses", fromMs: 1350, toMs: 1750 },
    ],
  },
  {
    text: "and start taking",
    startMs: 1900,
    durationMs: 850,
    tokens: [
      { text: "and", fromMs: 1900, toMs: 2050 },
      { text: "start", fromMs: 2050, toMs: 2280 },
      { text: "taking", fromMs: 2280, toMs: 2600 },
    ],
  },
  {
    text: "massive action",
    startMs: 2750,
    durationMs: 800,
    tokens: [
      { text: "massive", fromMs: 2750, toMs: 3100 },
      { text: "action", fromMs: 3100, toMs: 3450 },
    ],
  },
  {
    text: "every single day",
    startMs: 3600,
    durationMs: 850,
    tokens: [
      { text: "every", fromMs: 3600, toMs: 3820 },
      { text: "single", fromMs: 3820, toMs: 4050 },
      { text: "day", fromMs: 4050, toMs: 4350 },
    ],
  },
  {
    text: "the people who win",
    startMs: 4500,
    durationMs: 900,
    tokens: [
      { text: "the", fromMs: 4500, toMs: 4620 },
      { text: "people", fromMs: 4620, toMs: 4850 },
      { text: "who", fromMs: 4850, toMs: 5000 },
      { text: "win", fromMs: 5000, toMs: 5300 },
    ],
  },
];

const TOP_PAGES: TikTokPage[] = [
  {
    text: "are not smarter",
    startMs: 5450,
    durationMs: 800,
    tokens: [
      { text: "are", fromMs: 5450, toMs: 5580 },
      { text: "not", fromMs: 5580, toMs: 5730 },
      { text: "smarter", fromMs: 5730, toMs: 6100 },
    ],
  },
  {
    text: "than you",
    startMs: 6250,
    durationMs: 600,
    tokens: [
      { text: "than", fromMs: 6250, toMs: 6450 },
      { text: "you", fromMs: 6450, toMs: 6750 },
    ],
  },
  {
    text: "they just outwork",
    startMs: 6900,
    durationMs: 850,
    tokens: [
      { text: "they", fromMs: 6900, toMs: 7050 },
      { text: "just", fromMs: 7050, toMs: 7230 },
      { text: "outwork", fromMs: 7230, toMs: 7600 },
    ],
  },
  {
    text: "everyone else",
    startMs: 7750,
    durationMs: 700,
    tokens: [
      { text: "everyone", fromMs: 7750, toMs: 8100 },
      { text: "else", fromMs: 8100, toMs: 8350 },
    ],
  },
  {
    text: "that is the secret",
    startMs: 8500,
    durationMs: 900,
    tokens: [
      { text: "that", fromMs: 8500, toMs: 8650 },
      { text: "is", fromMs: 8650, toMs: 8780 },
      { text: "the", fromMs: 8780, toMs: 8900 },
      { text: "secret", fromMs: 8900, toMs: 9250 },
    ],
  },
  {
    text: "nobody wants to hear",
    startMs: 9400,
    durationMs: 900,
    tokens: [
      { text: "nobody", fromMs: 9400, toMs: 9620 },
      { text: "wants", fromMs: 9620, toMs: 9830 },
      { text: "to", fromMs: 9830, toMs: 9950 },
      { text: "hear", fromMs: 9950, toMs: 10200 },
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
    <AbsoluteFill>
      <Video
        src={staticFile("sample-video.mp4")}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
      <HormoziPopIn
        pages={BOTTOM_PAGES}
        highlightWords={HIGHLIGHT_WORDS}
        position="bottom"
      />
      <HormoziPopIn
        pages={TOP_PAGES}
        highlightWords={HIGHLIGHT_WORDS}
        position="top"
      />
    </AbsoluteFill>
  );
};
