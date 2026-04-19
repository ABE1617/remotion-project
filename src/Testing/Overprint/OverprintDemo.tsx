import React from "react";
import { AbsoluteFill, staticFile } from "remotion";
import { Video } from "@remotion/media";
import { Overprint } from "./Overprint";
import type { TikTokPage } from "../../types/captions";

const PAGES: TikTokPage[] = [
  {
    text: "the work speaks",
    startMs: 100,
    durationMs: 1600,
    tokens: [
      { text: "the", fromMs: 100, toMs: 400 },
      { text: "work", fromMs: 400, toMs: 900 },
      { text: "speaks", fromMs: 900, toMs: 1700 },
    ],
  },
  {
    text: "louder than words",
    startMs: 1800,
    durationMs: 1700,
    tokens: [
      { text: "louder", fromMs: 1800, toMs: 2250 },
      { text: "than", fromMs: 2250, toMs: 2600 },
      { text: "words", fromMs: 2600, toMs: 3500 },
    ],
  },
  {
    text: "craft over noise",
    startMs: 3600,
    durationMs: 1700,
    tokens: [
      { text: "craft", fromMs: 3600, toMs: 4100 },
      { text: "over", fromMs: 4100, toMs: 4450 },
      { text: "noise", fromMs: 4450, toMs: 5300 },
    ],
  },
  {
    text: "restraint is the signature",
    startMs: 5400,
    durationMs: 2100,
    tokens: [
      { text: "restraint", fromMs: 5400, toMs: 5950 },
      { text: "is", fromMs: 5950, toMs: 6150 },
      { text: "the", fromMs: 6150, toMs: 6400 },
      { text: "signature", fromMs: 6400, toMs: 7500 },
    ],
  },
];

const KEYWORDS = ["speaks", "words", "craft", "signature"];

export const OverprintDemo: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#0b0b0c" }}>
      <Video
        src={staticFile("sample-video.mp4")}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
      <Overprint pages={PAGES} keywords={KEYWORDS} position="bottom" />
    </AbsoluteFill>
  );
};
