import React from "react";
import { AbsoluteFill } from "remotion";
import { KaraokeHighlight } from "../components/captions/KaraokeHighlight";
import type { CaptionPage } from "../types/captions";

// Long motivational speech with natural phrasing -- karaoke style
// Pages show full phrases, highlight moves word by word
const SAMPLE_PAGES: CaptionPage[] = [
  {
    text: "success is not about talent",
    startMs: 200,
    durationMs: 2200,
    tokens: [
      { text: "success", start: 200, end: 700 },
      { text: "is", start: 700, end: 900 },
      { text: "not", start: 900, end: 1150 },
      { text: "about", start: 1150, end: 1500 },
      { text: "talent", start: 1500, end: 2100 },
    ],
  },
  {
    text: "it is about consistency",
    startMs: 2400,
    durationMs: 2000,
    tokens: [
      { text: "it", start: 2400, end: 2600 },
      { text: "is", start: 2600, end: 2800 },
      { text: "about", start: 2800, end: 3100 },
      { text: "consistency", start: 3100, end: 4100 },
    ],
  },
  {
    text: "showing up every single day",
    startMs: 4400,
    durationMs: 2200,
    tokens: [
      { text: "showing", start: 4400, end: 4800 },
      { text: "up", start: 4800, end: 5000 },
      { text: "every", start: 5000, end: 5350 },
      { text: "single", start: 5350, end: 5700 },
      { text: "day", start: 5700, end: 6300 },
    ],
  },
  {
    text: "even when you don't feel like it",
    startMs: 6500,
    durationMs: 2400,
    tokens: [
      { text: "even", start: 6500, end: 6800 },
      { text: "when", start: 6800, end: 7050 },
      { text: "you", start: 7050, end: 7250 },
      { text: "don't", start: 7250, end: 7550 },
      { text: "feel", start: 7550, end: 7850 },
      { text: "like", start: 7850, end: 8100 },
      { text: "it", start: 8100, end: 8600 },
    ],
  },
  {
    text: "that is what separates",
    startMs: 8800,
    durationMs: 1800,
    tokens: [
      { text: "that", start: 8800, end: 9050 },
      { text: "is", start: 9050, end: 9200 },
      { text: "what", start: 9200, end: 9450 },
      { text: "separates", start: 9450, end: 10300 },
    ],
  },
  {
    text: "the good from the great",
    startMs: 10500,
    durationMs: 1800,
    tokens: [
      { text: "the", start: 10500, end: 10700 },
      { text: "good", start: 10700, end: 11050 },
      { text: "from", start: 11050, end: 11300 },
      { text: "the", start: 11300, end: 11500 },
      { text: "great", start: 11500, end: 12100 },
    ],
  },
  {
    text: "discipline beats motivation",
    startMs: 12300,
    durationMs: 2200,
    tokens: [
      { text: "discipline", start: 12300, end: 13000 },
      { text: "beats", start: 13000, end: 13400 },
      { text: "motivation", start: 13400, end: 14200 },
    ],
  },
  {
    text: "because motivation fades",
    startMs: 14400,
    durationMs: 1800,
    tokens: [
      { text: "because", start: 14400, end: 14800 },
      { text: "motivation", start: 14800, end: 15500 },
      { text: "fades", start: 15500, end: 15900 },
    ],
  },
  {
    text: "but discipline is a choice",
    startMs: 16100,
    durationMs: 2000,
    tokens: [
      { text: "but", start: 16100, end: 16300 },
      { text: "discipline", start: 16300, end: 16900 },
      { text: "is", start: 16900, end: 17100 },
      { text: "a", start: 17100, end: 17250 },
      { text: "choice", start: 17250, end: 17800 },
    ],
  },
  {
    text: "you make it every morning",
    startMs: 18000,
    durationMs: 1800,
    tokens: [
      { text: "you", start: 18000, end: 18200 },
      { text: "make", start: 18200, end: 18500 },
      { text: "it", start: 18500, end: 18650 },
      { text: "every", start: 18650, end: 19000 },
      { text: "morning", start: 19000, end: 19600 },
    ],
  },
];

export const KaraokeHighlightDemo: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#1a1a1a" }}>
      <KaraokeHighlight
        pages={SAMPLE_PAGES}
        scheme="gold"
        showPill={true}
        frostedGlass={true}
        staggeredEntrance={true}
        position="bottom"
      />
    </AbsoluteFill>
  );
};
