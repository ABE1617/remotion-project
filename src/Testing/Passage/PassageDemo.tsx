import React from "react";
import { AbsoluteFill, staticFile } from "remotion";
import { Video } from "@remotion/media";
import { Passage } from "./Passage";
import type { TikTokPage } from "../../types/captions";

const PAGES: TikTokPage[] = [
  {
    text: "everything you are",
    startMs: 100,
    durationMs: 1800,
    tokens: [
      { text: "everything", fromMs: 100, toMs: 650 },
      { text: "you", fromMs: 650, toMs: 1000 },
      { text: "are", fromMs: 1000, toMs: 1800 },
    ],
  },
  {
    text: "is already enough",
    startMs: 1900,
    durationMs: 2000,
    tokens: [
      { text: "is", fromMs: 1900, toMs: 2150 },
      { text: "already", fromMs: 2150, toMs: 2700 },
      { text: "enough", fromMs: 2700, toMs: 3800 },
    ],
  },
  {
    text: "for the life you want",
    startMs: 3900,
    durationMs: 2100,
    tokens: [
      { text: "for", fromMs: 3900, toMs: 4150 },
      { text: "the", fromMs: 4150, toMs: 4400 },
      { text: "life", fromMs: 4400, toMs: 4900 },
      { text: "you", fromMs: 4900, toMs: 5200 },
      { text: "want", fromMs: 5200, toMs: 6000 },
    ],
  },
  {
    text: "stop waiting to become",
    startMs: 6100,
    durationMs: 2000,
    tokens: [
      { text: "stop", fromMs: 6100, toMs: 6500 },
      { text: "waiting", fromMs: 6500, toMs: 7000 },
      { text: "to", fromMs: 7000, toMs: 7250 },
      { text: "become", fromMs: 7250, toMs: 8100 },
    ],
  },
];

const KEYWORDS = ["enough", "life", "waiting", "become"];

export const PassageDemo: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#0b0b0c" }}>
      <Video
        src={staticFile("sample-video.mp4")}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
      <Passage pages={PAGES} keywords={KEYWORDS} position="bottom" />
    </AbsoluteFill>
  );
};
