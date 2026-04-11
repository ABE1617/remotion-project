import React from "react";
import { AbsoluteFill, staticFile } from "remotion";
import { Video } from "@remotion/media";
import { GlitchDecode } from "./GlitchDecode";
import type { TikTokPage } from "../../types/captions";

// ── Demo caption data ──────────────────────────────────────────────────────
// Tech/hacking themed text, 6 pages, ~7.9 seconds total.

const PAGES: TikTokPage[] = [
  {
    text: "the system is",
    startMs: 200,
    durationMs: 1200,
    tokens: [
      { text: "the", fromMs: 200, toMs: 450 },
      { text: "system", fromMs: 450, toMs: 850 },
      { text: "is", fromMs: 850, toMs: 1100 },
    ],
  },
  {
    text: "not what you think",
    startMs: 1500,
    durationMs: 1400,
    tokens: [
      { text: "not", fromMs: 1500, toMs: 1750 },
      { text: "what", fromMs: 1750, toMs: 2000 },
      { text: "you", fromMs: 2000, toMs: 2250 },
      { text: "think", fromMs: 2250, toMs: 2600 },
    ],
  },
  {
    text: "every pixel hides",
    startMs: 3000,
    durationMs: 1300,
    tokens: [
      { text: "every", fromMs: 3000, toMs: 3300 },
      { text: "pixel", fromMs: 3300, toMs: 3650 },
      { text: "hides", fromMs: 3650, toMs: 4000 },
    ],
  },
  {
    text: "a secret",
    startMs: 4400,
    durationMs: 1000,
    tokens: [
      { text: "a", fromMs: 4400, toMs: 4600 },
      { text: "secret", fromMs: 4600, toMs: 5100 },
    ],
  },
  {
    text: "decode the signal",
    startMs: 5500,
    durationMs: 1300,
    tokens: [
      { text: "decode", fromMs: 5500, toMs: 5850 },
      { text: "the", fromMs: 5850, toMs: 6050 },
      { text: "signal", fromMs: 6050, toMs: 6500 },
    ],
  },
  {
    text: "before time runs out",
    startMs: 6900,
    durationMs: 1400,
    tokens: [
      { text: "before", fromMs: 6900, toMs: 7150 },
      { text: "time", fromMs: 7150, toMs: 7400 },
      { text: "runs", fromMs: 7400, toMs: 7650 },
      { text: "out", fromMs: 7650, toMs: 7900 },
    ],
  },
];

// ── Demo component ─────────────────────────────────────────────────────────

export const GlitchDecodeDemo: React.FC = () => {
  return (
    <AbsoluteFill>
      <Video
        src={staticFile("sample-video.mp4")}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
      <GlitchDecode
        pages={PAGES}
        position="center"
        scheme="terminal"
      />
    </AbsoluteFill>
  );
};
