import React from "react";
import { AbsoluteFill, staticFile } from "remotion";
import { Video } from "@remotion/media";
import { WarmGlow } from "./WarmGlow";
import type { TikTokPage } from "../../types/captions";

const PAGES: TikTokPage[] = [
  {
    text: "some of you",
    startMs: 100,
    durationMs: 1200,
    tokens: [
      { text: "some", fromMs: 100, toMs: 450 },
      { text: "of", fromMs: 450, toMs: 700 },
      { text: "you", fromMs: 700, toMs: 1300 },
    ],
  },
  {
    text: "are thinking",
    startMs: 1400,
    durationMs: 1200,
    tokens: [
      { text: "are", fromMs: 1400, toMs: 1800 },
      { text: "thinking", fromMs: 1800, toMs: 2600 },
    ],
  },
  {
    text: "this does not",
    startMs: 2700,
    durationMs: 1100,
    tokens: [
      { text: "this", fromMs: 2700, toMs: 3000 },
      { text: "does", fromMs: 3000, toMs: 3300 },
      { text: "not", fromMs: 3300, toMs: 3800 },
    ],
  },
  {
    text: "apply to me",
    startMs: 3900,
    durationMs: 1100,
    tokens: [
      { text: "apply", fromMs: 3900, toMs: 4300 },
      { text: "to", fromMs: 4300, toMs: 4500 },
      { text: "me", fromMs: 4500, toMs: 5000 },
    ],
  },
  {
    text: "but trust me",
    startMs: 5100,
    durationMs: 1100,
    tokens: [
      { text: "but", fromMs: 5100, toMs: 5350 },
      { text: "trust", fromMs: 5350, toMs: 5700 },
      { text: "me", fromMs: 5700, toMs: 6200 },
    ],
  },
  {
    text: "it really does",
    startMs: 6300,
    durationMs: 1200,
    tokens: [
      { text: "it", fromMs: 6300, toMs: 6550 },
      { text: "really", fromMs: 6550, toMs: 6950 },
      { text: "does", fromMs: 6950, toMs: 7500 },
    ],
  },
  {
    text: "every single one",
    startMs: 7600,
    durationMs: 1200,
    tokens: [
      { text: "every", fromMs: 7600, toMs: 7950 },
      { text: "single", fromMs: 7950, toMs: 8300 },
      { text: "one", fromMs: 8300, toMs: 8800 },
    ],
  },
  {
    text: "needs this now",
    startMs: 8900,
    durationMs: 1100,
    tokens: [
      { text: "needs", fromMs: 8900, toMs: 9200 },
      { text: "this", fromMs: 9200, toMs: 9500 },
      { text: "now", fromMs: 9500, toMs: 10000 },
    ],
  },
];

export const WarmGlowDemo: React.FC = () => {
  return (
    <AbsoluteFill>
      <Video
        src={staticFile("sample-video.mp4")}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
      <WarmGlow
        pages={PAGES}
        position="bottom"
        keywords={["thinking", "not", "trust", "really", "every", "now"]}
      />
    </AbsoluteFill>
  );
};
