import React from "react";
import { AbsoluteFill } from "remotion";
import { WeightShiftCaption } from "../components/captions/WeightShift";
import type { CaptionPage } from "../types/captions";

// Long Iman Gadzhi-style premium monologue -- lowercase, intimate, luxury feel
// Each page is short (3-6 words), with natural pauses between
const SAMPLE_PAGES: CaptionPage[] = [
  {
    text: "the secret nobody tells you",
    startMs: 500,
    durationMs: 2200,
    tokens: [
      { text: "the", start: 500, end: 700 },
      { text: "secret", start: 700, end: 1100 },
      { text: "nobody", start: 1100, end: 1550 },
      { text: "tells", start: 1550, end: 1900 },
      { text: "you", start: 1900, end: 2400 },
    ],
  },
  {
    text: "about building wealth",
    startMs: 2900,
    durationMs: 1800,
    tokens: [
      { text: "about", start: 2900, end: 3200 },
      { text: "building", start: 3200, end: 3700 },
      { text: "wealth", start: 3700, end: 4400 },
    ],
  },
  {
    text: "is that it starts with your mind",
    startMs: 4700,
    durationMs: 2400,
    tokens: [
      { text: "is", start: 4700, end: 4900 },
      { text: "that", start: 4900, end: 5100 },
      { text: "it", start: 5100, end: 5250 },
      { text: "starts", start: 5250, end: 5600 },
      { text: "with", start: 5600, end: 5800 },
      { text: "your", start: 5800, end: 6100 },
      { text: "mind", start: 6100, end: 6800 },
    ],
  },
  {
    text: "not with your bank account",
    startMs: 7100,
    durationMs: 2000,
    tokens: [
      { text: "not", start: 7100, end: 7350 },
      { text: "with", start: 7350, end: 7550 },
      { text: "your", start: 7550, end: 7800 },
      { text: "bank", start: 7800, end: 8150 },
      { text: "account", start: 8150, end: 8800 },
    ],
  },
  {
    text: "every wealthy person i know",
    startMs: 9200,
    durationMs: 2000,
    tokens: [
      { text: "every", start: 9200, end: 9550 },
      { text: "wealthy", start: 9550, end: 10000 },
      { text: "person", start: 10000, end: 10400 },
      { text: "i", start: 10400, end: 10550 },
      { text: "know", start: 10550, end: 10900 },
    ],
  },
  {
    text: "made a decision first",
    startMs: 11200,
    durationMs: 1800,
    tokens: [
      { text: "made", start: 11200, end: 11500 },
      { text: "a", start: 11500, end: 11650 },
      { text: "decision", start: 11650, end: 12200 },
      { text: "first", start: 12200, end: 12700 },
    ],
  },
  {
    text: "then figured out the how",
    startMs: 13000,
    durationMs: 2000,
    tokens: [
      { text: "then", start: 13000, end: 13250 },
      { text: "figured", start: 13250, end: 13650 },
      { text: "out", start: 13650, end: 13850 },
      { text: "the", start: 13850, end: 14050 },
      { text: "how", start: 14050, end: 14700 },
    ],
  },
  {
    text: "most people do it backwards",
    startMs: 15000,
    durationMs: 2000,
    tokens: [
      { text: "most", start: 15000, end: 15300 },
      { text: "people", start: 15300, end: 15700 },
      { text: "do", start: 15700, end: 15900 },
      { text: "it", start: 15900, end: 16050 },
      { text: "backwards", start: 16050, end: 16700 },
    ],
  },
  {
    text: "they wait for the perfect moment",
    startMs: 17000,
    durationMs: 2200,
    tokens: [
      { text: "they", start: 17000, end: 17250 },
      { text: "wait", start: 17250, end: 17550 },
      { text: "for", start: 17550, end: 17750 },
      { text: "the", start: 17750, end: 17950 },
      { text: "perfect", start: 17950, end: 18400 },
      { text: "moment", start: 18400, end: 18900 },
    ],
  },
  {
    text: "but that moment never comes",
    startMs: 19200,
    durationMs: 2000,
    tokens: [
      { text: "but", start: 19200, end: 19400 },
      { text: "that", start: 19400, end: 19650 },
      { text: "moment", start: 19650, end: 20050 },
      { text: "never", start: 20050, end: 20450 },
      { text: "comes", start: 20450, end: 20900 },
    ],
  },
];

export const WeightShiftDemo: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0a0a" }}>
      <WeightShiftCaption pages={SAMPLE_PAGES} />
    </AbsoluteFill>
  );
};
