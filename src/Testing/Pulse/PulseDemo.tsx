import React from "react";
import { AbsoluteFill, staticFile } from "remotion";
import { Video } from "@remotion/media";
import { Pulse } from "./Pulse";
import type { TikTokPage } from "../../types/captions";

const PAGES: TikTokPage[] = [
  {
    text: "nobody talks",
    startMs: 100,
    durationMs: 1000,
    tokens: [
      { text: "nobody", fromMs: 100, toMs: 500 },
      { text: "talks", fromMs: 500, toMs: 1100 },
    ],
  },
  {
    text: "about this",
    startMs: 1200,
    durationMs: 1000,
    tokens: [
      { text: "about", fromMs: 1200, toMs: 1600 },
      { text: "this", fromMs: 1600, toMs: 2200 },
    ],
  },
  {
    text: "but captions",
    startMs: 2300,
    durationMs: 1000,
    tokens: [
      { text: "but", fromMs: 2300, toMs: 2500 },
      { text: "captions", fromMs: 2500, toMs: 3300 },
    ],
  },
  {
    text: "change everything",
    startMs: 3400,
    durationMs: 1000,
    tokens: [
      { text: "change", fromMs: 3400, toMs: 3800 },
      { text: "everything", fromMs: 3800, toMs: 4400 },
    ],
  },
  {
    text: "more views",
    startMs: 4500,
    durationMs: 1000,
    tokens: [
      { text: "more", fromMs: 4500, toMs: 4900 },
      { text: "views", fromMs: 4900, toMs: 5500 },
    ],
  },
  {
    text: "real growth",
    startMs: 5600,
    durationMs: 1000,
    tokens: [
      { text: "real", fromMs: 5600, toMs: 6000 },
      { text: "growth", fromMs: 6000, toMs: 6600 },
    ],
  },
];

const KEYWORDS = ["captions", "everything", "views", "growth"];

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
