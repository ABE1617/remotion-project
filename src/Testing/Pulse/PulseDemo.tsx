import React from "react";
import { AbsoluteFill, staticFile } from "remotion";
import { Video } from "@remotion/media";
import { Pulse } from "./Pulse";
import type { TikTokPage } from "../../types/captions";

const PAGES: TikTokPage[] = [
  {
    text: "I used the",
    startMs: 100,
    durationMs: 1800,
    tokens: [
      { text: "I", fromMs: 100, toMs: 400 },
      { text: "used", fromMs: 400, toMs: 900 },
      { text: "the", fromMs: 900, toMs: 1900 },
    ],
  },
  {
    text: "Captions App",
    startMs: 2000,
    durationMs: 1800,
    tokens: [
      { text: "Captions", fromMs: 2000, toMs: 2900 },
      { text: "App", fromMs: 2900, toMs: 3800 },
    ],
  },
  {
    text: "and it changed",
    startMs: 3900,
    durationMs: 1600,
    tokens: [
      { text: "and", fromMs: 3900, toMs: 4200 },
      { text: "it", fromMs: 4200, toMs: 4500 },
      { text: "changed", fromMs: 4500, toMs: 5500 },
    ],
  },
  {
    text: "everything",
    startMs: 5600,
    durationMs: 1400,
    tokens: [
      { text: "everything", fromMs: 5600, toMs: 7000 },
    ],
  },
  {
    text: "just add captions",
    startMs: 7100,
    durationMs: 1400,
    tokens: [
      { text: "just", fromMs: 7100, toMs: 7400 },
      { text: "add", fromMs: 7400, toMs: 7700 },
      { text: "captions", fromMs: 7700, toMs: 8500 },
    ],
  },
  {
    text: "and grow",
    startMs: 8600,
    durationMs: 900,
    tokens: [
      { text: "and", fromMs: 8600, toMs: 8900 },
      { text: "grow", fromMs: 8900, toMs: 9500 },
    ],
  },
];

const KEYWORDS = ["Captions", "App", "everything", "engagement", "percent", "grow"];

export const PulseDemo: React.FC = () => {
  return (
    <AbsoluteFill>
      <Video
        src={staticFile("sample-video.mp4")}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
      <Pulse pages={PAGES} keywords={KEYWORDS} position="bottom" />
    </AbsoluteFill>
  );
};
