import React from "react";
import { AbsoluteFill, staticFile } from "remotion";
import { Video } from "@remotion/media";
import { EditorialPop } from "./EditorialPop";
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
    text: "everything about",
    startMs: 5600,
    durationMs: 1400,
    tokens: [
      { text: "everything", fromMs: 5600, toMs: 6400 },
      { text: "about", fromMs: 6400, toMs: 7000 },
    ],
  },
  {
    text: "my content",
    startMs: 7100,
    durationMs: 1400,
    tokens: [
      { text: "my", fromMs: 7100, toMs: 7500 },
      { text: "content", fromMs: 7500, toMs: 8500 },
    ],
  },
  {
    text: "just add captions",
    startMs: 8600,
    durationMs: 1500,
    tokens: [
      { text: "just", fromMs: 8600, toMs: 8900 },
      { text: "add", fromMs: 8900, toMs: 9200 },
      { text: "captions", fromMs: 9200, toMs: 10100 },
    ],
  },
];

const KEYWORDS = ["Captions", "App", "changed", "everything", "content", "captions"];

export const EditorialPopDemo: React.FC = () => {
  return (
    <AbsoluteFill>
      <Video
        src={staticFile("sample-video.mp4")}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
      <EditorialPop pages={PAGES} keywords={KEYWORDS} maxWordsPerLine={2} position="bottom" />
    </AbsoluteFill>
  );
};
