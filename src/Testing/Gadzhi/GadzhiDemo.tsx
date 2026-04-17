import React from "react";
import { AbsoluteFill, staticFile } from "remotion";
import { Video } from "@remotion/media";
import { Gadzhi } from "./Gadzhi";
import type { TikTokPage } from "../../types/captions";

const PAGES: TikTokPage[] = [
  {
    text: "the problem is not",
    startMs: 100,
    durationMs: 1600,
    tokens: [
      { text: "the", fromMs: 100, toMs: 350 },
      { text: "problem", fromMs: 350, toMs: 700 },
      { text: "is", fromMs: 700, toMs: 900 },
      { text: "not", fromMs: 900, toMs: 1700 },
    ],
  },
  {
    text: "that you lack talent",
    startMs: 1800,
    durationMs: 1600,
    tokens: [
      { text: "that", fromMs: 1800, toMs: 2050 },
      { text: "you", fromMs: 2050, toMs: 2250 },
      { text: "lack", fromMs: 2250, toMs: 2600 },
      { text: "talent", fromMs: 2600, toMs: 3400 },
    ],
  },
  {
    text: "the problem is you",
    startMs: 3500,
    durationMs: 1500,
    tokens: [
      { text: "the", fromMs: 3500, toMs: 3700 },
      { text: "problem", fromMs: 3700, toMs: 4050 },
      { text: "is", fromMs: 4050, toMs: 4250 },
      { text: "you", fromMs: 4250, toMs: 5000 },
    ],
  },
  {
    text: "quit too early",
    startMs: 5100,
    durationMs: 1400,
    tokens: [
      { text: "quit", fromMs: 5100, toMs: 5400 },
      { text: "too", fromMs: 5400, toMs: 5700 },
      { text: "early", fromMs: 5700, toMs: 6500 },
    ],
  },
  {
    text: "before it gets good",
    startMs: 6600,
    durationMs: 1500,
    tokens: [
      { text: "before", fromMs: 6600, toMs: 6900 },
      { text: "it", fromMs: 6900, toMs: 7100 },
      { text: "gets", fromMs: 7100, toMs: 7400 },
      { text: "good", fromMs: 7400, toMs: 8100 },
    ],
  },
  {
    text: "stay consistent",
    startMs: 8200,
    durationMs: 1400,
    tokens: [
      { text: "stay", fromMs: 8200, toMs: 8600 },
      { text: "consistent", fromMs: 8600, toMs: 9600 },
    ],
  },
];

export const GadzhiDemo: React.FC = () => (
  <AbsoluteFill>
    <Video
      src={staticFile("sample-video.mp4")}
      style={{ width: "100%", height: "100%", objectFit: "cover" }}
    />
    <Gadzhi pages={PAGES} position="bottom" />
  </AbsoluteFill>
);
