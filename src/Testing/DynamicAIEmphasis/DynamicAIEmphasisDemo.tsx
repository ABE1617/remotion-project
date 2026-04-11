import React from "react";
import { AbsoluteFill, staticFile } from "remotion";
import { Video } from "@remotion/media";
import { DynamicAIEmphasis } from "./DynamicAIEmphasis";
import type { EmphasisWord } from "./types";
import type { TikTokPage } from "../../types/captions";

const PAGES: TikTokPage[] = [
  {
    text: "you need to stop",
    startMs: 100,
    durationMs: 850,
    tokens: [
      { text: "you", fromMs: 100, toMs: 300 },
      { text: "need", fromMs: 300, toMs: 520 },
      { text: "to", fromMs: 520, toMs: 660 },
      { text: "stop", fromMs: 660, toMs: 950 },
    ],
  },
  {
    text: "making excuses",
    startMs: 1150,
    durationMs: 700,
    tokens: [
      { text: "making", fromMs: 1150, toMs: 1450 },
      { text: "excuses", fromMs: 1450, toMs: 1850 },
    ],
  },
  {
    text: "and start taking",
    startMs: 2000,
    durationMs: 750,
    tokens: [
      { text: "and", fromMs: 2000, toMs: 2180 },
      { text: "start", fromMs: 2180, toMs: 2420 },
      { text: "taking", fromMs: 2420, toMs: 2750 },
    ],
  },
  {
    text: "massive action",
    startMs: 2900,
    durationMs: 800,
    tokens: [
      { text: "massive", fromMs: 2900, toMs: 3250 },
      { text: "action", fromMs: 3250, toMs: 3700 },
    ],
  },
  {
    text: "every single day",
    startMs: 3850,
    durationMs: 800,
    tokens: [
      { text: "every", fromMs: 3850, toMs: 4080 },
      { text: "single", fromMs: 4080, toMs: 4320 },
      { text: "day", fromMs: 4320, toMs: 4650 },
    ],
  },
  {
    text: "the people who win",
    startMs: 4800,
    durationMs: 900,
    tokens: [
      { text: "the", fromMs: 4800, toMs: 4940 },
      { text: "people", fromMs: 4940, toMs: 5180 },
      { text: "who", fromMs: 5180, toMs: 5340 },
      { text: "win", fromMs: 5340, toMs: 5700 },
    ],
  },
  {
    text: "are not smarter",
    startMs: 5850,
    durationMs: 700,
    tokens: [
      { text: "are", fromMs: 5850, toMs: 5990 },
      { text: "not", fromMs: 5990, toMs: 6150 },
      { text: "smarter", fromMs: 6150, toMs: 6550 },
    ],
  },
  {
    text: "they just outwork",
    startMs: 6700,
    durationMs: 750,
    tokens: [
      { text: "they", fromMs: 6700, toMs: 6860 },
      { text: "just", fromMs: 6860, toMs: 7050 },
      { text: "outwork", fromMs: 7050, toMs: 7450 },
    ],
  },
  {
    text: "everyone else",
    startMs: 7600,
    durationMs: 600,
    tokens: [
      { text: "everyone", fromMs: 7600, toMs: 7950 },
      { text: "else", fromMs: 7950, toMs: 8200 },
    ],
  },
];

const EMPHASIS_WORDS: EmphasisWord[] = [
  { text: "stop", weight: 3 },
  { text: "excuses", weight: 3 },
  { text: "start", weight: 2 },
  { text: "massive", weight: 3 },
  { text: "action", weight: 3 },
  { text: "day", weight: 2 },
  { text: "win", weight: 3 },
  { text: "smarter", weight: 2 },
  { text: "outwork", weight: 3 },
];

export const DynamicAIEmphasisDemo: React.FC = () => {
  return (
    <AbsoluteFill>
      <Video
        src={staticFile("sample-video.mp4")}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
      <DynamicAIEmphasis
        pages={PAGES}
        emphasisWords={EMPHASIS_WORDS}
        position="center"
      />
    </AbsoluteFill>
  );
};
