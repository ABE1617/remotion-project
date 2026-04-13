import React from "react";
import { AbsoluteFill, staticFile } from "remotion";
import { Video } from "@remotion/media";
import { Telemetry } from "./Telemetry";
import type { TikTokPage } from "../../types/captions";

const PAGES: TikTokPage[] = [
  {
    text: "the signal is clear",
    startMs: 100,
    durationMs: 1800,
    tokens: [
      { text: "the", fromMs: 100, toMs: 400 },
      { text: "signal", fromMs: 400, toMs: 900 },
      { text: "is", fromMs: 900, toMs: 1150 },
      { text: "clear", fromMs: 1150, toMs: 1900 },
    ],
  },
  {
    text: "when you measure what",
    startMs: 2000,
    durationMs: 1800,
    tokens: [
      { text: "when", fromMs: 2000, toMs: 2350 },
      { text: "you", fromMs: 2350, toMs: 2600 },
      { text: "measure", fromMs: 2600, toMs: 3200 },
      { text: "what", fromMs: 3200, toMs: 3800 },
    ],
  },
  {
    text: "actually matters and cut",
    startMs: 3900,
    durationMs: 1800,
    tokens: [
      { text: "actually", fromMs: 3900, toMs: 4400 },
      { text: "matters", fromMs: 4400, toMs: 5000 },
      { text: "and", fromMs: 5000, toMs: 5250 },
      { text: "cut", fromMs: 5250, toMs: 5700 },
    ],
  },
  {
    text: "through the noise",
    startMs: 5800,
    durationMs: 1600,
    tokens: [
      { text: "through", fromMs: 5800, toMs: 6300 },
      { text: "the", fromMs: 6300, toMs: 6600 },
      { text: "noise", fromMs: 6600, toMs: 7400 },
    ],
  },
  {
    text: "precision wins",
    startMs: 7500,
    durationMs: 1500,
    tokens: [
      { text: "precision", fromMs: 7500, toMs: 8300 },
      { text: "wins", fromMs: 8300, toMs: 9000 },
    ],
  },
];

const KEYWORDS = ["signal", "measure", "matters", "noise", "precision"];

export const TelemetryDemo: React.FC = () => {
  return (
    <AbsoluteFill>
      <Video
        src={staticFile("sample-video.mp4")}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
      <Telemetry pages={PAGES} keywords={KEYWORDS} position="bottom" />
    </AbsoluteFill>
  );
};
