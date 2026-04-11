import React from "react";
import { AbsoluteFill, staticFile } from "remotion";
import { Video } from "@remotion/media";
import { GradientGlassMorph } from "./GradientGlassMorph";
import type { TikTokPage } from "../../types/captions";

const PAGES: TikTokPage[] = [
  {
    text: "being present",
    startMs: 200,
    durationMs: 900,
    tokens: [
      { text: "being", fromMs: 200, toMs: 600 },
      { text: "present", fromMs: 600, toMs: 1100 },
    ],
  },
  {
    text: "without pressure",
    startMs: 1300,
    durationMs: 900,
    tokens: [
      { text: "without", fromMs: 1300, toMs: 1700 },
      { text: "pressure", fromMs: 1700, toMs: 2200 },
    ],
  },
  {
    text: "is the greatest gift",
    startMs: 2400,
    durationMs: 1100,
    tokens: [
      { text: "is", fromMs: 2400, toMs: 2600 },
      { text: "the", fromMs: 2600, toMs: 2800 },
      { text: "greatest", fromMs: 2800, toMs: 3150 },
      { text: "gift", fromMs: 3150, toMs: 3500 },
    ],
  },
  {
    text: "you can give",
    startMs: 3700,
    durationMs: 900,
    tokens: [
      { text: "you", fromMs: 3700, toMs: 3900 },
      { text: "can", fromMs: 3900, toMs: 4100 },
      { text: "give", fromMs: 4100, toMs: 4600 },
    ],
  },
  {
    text: "to yourself",
    startMs: 4800,
    durationMs: 900,
    tokens: [
      { text: "to", fromMs: 4800, toMs: 5000 },
      { text: "yourself", fromMs: 5000, toMs: 5700 },
    ],
  },
  {
    text: "and the people",
    startMs: 5900,
    durationMs: 900,
    tokens: [
      { text: "and", fromMs: 5900, toMs: 6100 },
      { text: "the", fromMs: 6100, toMs: 6300 },
      { text: "people", fromMs: 6300, toMs: 6800 },
    ],
  },
  {
    text: "around you",
    startMs: 7000,
    durationMs: 900,
    tokens: [
      { text: "around", fromMs: 7000, toMs: 7400 },
      { text: "you", fromMs: 7400, toMs: 7900 },
    ],
  },
];

export const GradientGlassMorphDemo: React.FC = () => {
  return (
    <AbsoluteFill>
      <Video
        src={staticFile("sample-video.mp4")}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
      <GradientGlassMorph pages={PAGES} position="bottom" />
    </AbsoluteFill>
  );
};
