import React from "react";
import { AbsoluteFill, staticFile } from "remotion";
import { Video } from "@remotion/media";
import { ScanlineImpact } from "./ScanlineImpact";
import type { TikTokPage } from "../../types/captions";

const PAGES: TikTokPage[] = [
  {
    text: "easy editing",
    startMs: 100,
    durationMs: 2200,
    tokens: [
      { text: "easy", fromMs: 100, toMs: 800 },
      { text: "editing", fromMs: 800, toMs: 2300 },
    ],
  },
  {
    text: "this changes everything",
    startMs: 2500,
    durationMs: 2200,
    tokens: [
      { text: "this", fromMs: 2500, toMs: 3000 },
      { text: "changes", fromMs: 3000, toMs: 3600 },
      { text: "everything", fromMs: 3600, toMs: 4700 },
    ],
  },
  {
    text: "watch till the end",
    startMs: 4900,
    durationMs: 2000,
    tokens: [
      { text: "watch", fromMs: 4900, toMs: 5400 },
      { text: "till", fromMs: 5400, toMs: 5800 },
      { text: "the", fromMs: 5800, toMs: 6100 },
      { text: "end", fromMs: 6100, toMs: 6900 },
    ],
  },
  {
    text: "you wont regret it",
    startMs: 7100,
    durationMs: 2000,
    tokens: [
      { text: "you", fromMs: 7100, toMs: 7400 },
      { text: "wont", fromMs: 7400, toMs: 7800 },
      { text: "regret", fromMs: 7800, toMs: 8300 },
      { text: "it", fromMs: 8300, toMs: 9100 },
    ],
  },
];

export const ScanlineImpactDemo: React.FC = () => {
  return (
    <AbsoluteFill>
      <Video
        src={staticFile("sample-video.mp4")}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
      <ScanlineImpact pages={PAGES} />
    </AbsoluteFill>
  );
};
