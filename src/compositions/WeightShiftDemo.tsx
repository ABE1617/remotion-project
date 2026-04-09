import React from "react";
import { AbsoluteFill, staticFile } from "remotion";
import { Video } from "@remotion/media";
import { WeightShiftCaption } from "../components/captions/WeightShift";
import type { TikTokPage } from "../types/captions";

const BOTTOM_PAGES: TikTokPage[] = [
  {
    text: "the secret nobody tells you",
    startMs: 500,
    durationMs: 2200,
    tokens: [
      { text: "the", fromMs: 500, toMs: 700 },
      { text: "secret", fromMs: 700, toMs: 1100 },
      { text: "nobody", fromMs: 1100, toMs: 1550 },
      { text: "tells", fromMs: 1550, toMs: 1900 },
      { text: "you", fromMs: 1900, toMs: 2400 },
    ],
  },
  {
    text: "about building wealth",
    startMs: 2900,
    durationMs: 1800,
    tokens: [
      { text: "about", fromMs: 2900, toMs: 3200 },
      { text: "building", fromMs: 3200, toMs: 3700 },
      { text: "wealth", fromMs: 3700, toMs: 4400 },
    ],
  },
  {
    text: "is that it starts with your mind",
    startMs: 4700,
    durationMs: 2400,
    tokens: [
      { text: "is", fromMs: 4700, toMs: 4900 },
      { text: "that", fromMs: 4900, toMs: 5100 },
      { text: "it", fromMs: 5100, toMs: 5250 },
      { text: "starts", fromMs: 5250, toMs: 5600 },
      { text: "with", fromMs: 5600, toMs: 5800 },
      { text: "your", fromMs: 5800, toMs: 6100 },
      { text: "mind", fromMs: 6100, toMs: 6800 },
    ],
  },
  {
    text: "not with your bank account",
    startMs: 7100,
    durationMs: 2000,
    tokens: [
      { text: "not", fromMs: 7100, toMs: 7350 },
      { text: "with", fromMs: 7350, toMs: 7550 },
      { text: "your", fromMs: 7550, toMs: 7800 },
      { text: "bank", fromMs: 7800, toMs: 8150 },
      { text: "account", fromMs: 8150, toMs: 8800 },
    ],
  },
  {
    text: "every wealthy person i know",
    startMs: 9200,
    durationMs: 2000,
    tokens: [
      { text: "every", fromMs: 9200, toMs: 9550 },
      { text: "wealthy", fromMs: 9550, toMs: 10000 },
      { text: "person", fromMs: 10000, toMs: 10400 },
      { text: "i", fromMs: 10400, toMs: 10550 },
      { text: "know", fromMs: 10550, toMs: 10900 },
    ],
  },
];

const TOP_PAGES: TikTokPage[] = [
  {
    text: "made a decision first",
    startMs: 11200,
    durationMs: 1800,
    tokens: [
      { text: "made", fromMs: 11200, toMs: 11500 },
      { text: "a", fromMs: 11500, toMs: 11650 },
      { text: "decision", fromMs: 11650, toMs: 12200 },
      { text: "first", fromMs: 12200, toMs: 12700 },
    ],
  },
  {
    text: "then figured out the how",
    startMs: 13000,
    durationMs: 2000,
    tokens: [
      { text: "then", fromMs: 13000, toMs: 13250 },
      { text: "figured", fromMs: 13250, toMs: 13650 },
      { text: "out", fromMs: 13650, toMs: 13850 },
      { text: "the", fromMs: 13850, toMs: 14050 },
      { text: "how", fromMs: 14050, toMs: 14700 },
    ],
  },
  {
    text: "most people do it backwards",
    startMs: 15000,
    durationMs: 2000,
    tokens: [
      { text: "most", fromMs: 15000, toMs: 15300 },
      { text: "people", fromMs: 15300, toMs: 15700 },
      { text: "do", fromMs: 15700, toMs: 15900 },
      { text: "it", fromMs: 15900, toMs: 16050 },
      { text: "backwards", fromMs: 16050, toMs: 16700 },
    ],
  },
  {
    text: "they wait for the perfect moment",
    startMs: 17000,
    durationMs: 2200,
    tokens: [
      { text: "they", fromMs: 17000, toMs: 17250 },
      { text: "wait", fromMs: 17250, toMs: 17550 },
      { text: "for", fromMs: 17550, toMs: 17750 },
      { text: "the", fromMs: 17750, toMs: 17950 },
      { text: "perfect", fromMs: 17950, toMs: 18400 },
      { text: "moment", fromMs: 18400, toMs: 18900 },
    ],
  },
  {
    text: "but that moment never comes",
    startMs: 19200,
    durationMs: 2000,
    tokens: [
      { text: "but", fromMs: 19200, toMs: 19400 },
      { text: "that", fromMs: 19400, toMs: 19650 },
      { text: "moment", fromMs: 19650, toMs: 20050 },
      { text: "never", fromMs: 20050, toMs: 20450 },
      { text: "comes", fromMs: 20450, toMs: 20900 },
    ],
  },
];

export const WeightShiftDemo: React.FC = () => {
  return (
    <AbsoluteFill>
      <Video
        src={staticFile("sample-video.mp4")}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
      <WeightShiftCaption pages={BOTTOM_PAGES} position="bottom" />
      <WeightShiftCaption pages={TOP_PAGES} position="top" />
    </AbsoluteFill>
  );
};
