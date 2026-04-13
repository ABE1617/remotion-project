import React from "react";
import { AbsoluteFill, staticFile } from "remotion";
import { Video } from "@remotion/media";
import { Dispatch } from "./Dispatch";
import type { TikTokPage } from "../../types/captions";
import type { DispatchContextLine } from "./types";

const PAGES: TikTokPage[] = [
  {
    text: "the algorithm decides",
    startMs: 100,
    durationMs: 1800,
    tokens: [
      { text: "the", fromMs: 100, toMs: 400 },
      { text: "algorithm", fromMs: 400, toMs: 1000 },
      { text: "decides", fromMs: 1000, toMs: 1900 },
    ],
  },
  {
    text: "what you see next",
    startMs: 2000,
    durationMs: 1800,
    tokens: [
      { text: "what", fromMs: 2000, toMs: 2400 },
      { text: "you", fromMs: 2400, toMs: 2700 },
      { text: "see", fromMs: 2700, toMs: 3100 },
      { text: "next", fromMs: 3100, toMs: 3800 },
    ],
  },
  {
    text: "attention is currency",
    startMs: 3900,
    durationMs: 1800,
    tokens: [
      { text: "attention", fromMs: 3900, toMs: 4500 },
      { text: "is", fromMs: 4500, toMs: 4800 },
      { text: "currency", fromMs: 4800, toMs: 5700 },
    ],
  },
  {
    text: "three seconds to capture",
    startMs: 5800,
    durationMs: 1600,
    tokens: [
      { text: "three", fromMs: 5800, toMs: 6200 },
      { text: "seconds", fromMs: 6200, toMs: 6700 },
      { text: "to", fromMs: 6700, toMs: 6900 },
      { text: "capture", fromMs: 6900, toMs: 7400 },
    ],
  },
  {
    text: "or you disappear",
    startMs: 7500,
    durationMs: 1500,
    tokens: [
      { text: "or", fromMs: 7500, toMs: 7800 },
      { text: "you", fromMs: 7800, toMs: 8100 },
      { text: "disappear", fromMs: 8100, toMs: 9000 },
    ],
  },
];

const KEYWORDS = ["algorithm", "attention", "currency", "seconds", "disappear"];

const CONTEXT_LINES: DispatchContextLine[] = [
  {
    text: "based on 2024 engagement data",
    appearAtMs: 3900,
    disappearAtMs: 5600,
  },
  {
    text: "average viewer attention span",
    appearAtMs: 5800,
    disappearAtMs: 7300,
  },
];

export const DispatchDemo: React.FC = () => {
  return (
    <AbsoluteFill>
      <Video
        src={staticFile("sample-video.mp4")}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
      <Dispatch
        pages={PAGES}
        keywords={KEYWORDS}
        contextLines={CONTEXT_LINES}
        position="bottom"
      />
    </AbsoluteFill>
  );
};
