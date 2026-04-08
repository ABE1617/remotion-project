import React from "react";
import { AbsoluteFill } from "remotion";
import { KaraokeHighlight } from "../components/captions/KaraokeHighlight";
import type { TikTokPage } from "../types/captions";

// Long motivational speech with natural phrasing -- karaoke style
// Pages show full phrases, highlight moves word by word
const SAMPLE_PAGES: TikTokPage[] = [
  {
    text: "success is not about talent",
    startMs: 200,
    durationMs: 2200,
    tokens: [
      { text: "success", fromMs: 200, toMs: 700 },
      { text: "is", fromMs: 700, toMs: 900 },
      { text: "not", fromMs: 900, toMs: 1150 },
      { text: "about", fromMs: 1150, toMs: 1500 },
      { text: "talent", fromMs: 1500, toMs: 2100 },
    ],
  },
  {
    text: "it is about consistency",
    startMs: 2400,
    durationMs: 2000,
    tokens: [
      { text: "it", fromMs: 2400, toMs: 2600 },
      { text: "is", fromMs: 2600, toMs: 2800 },
      { text: "about", fromMs: 2800, toMs: 3100 },
      { text: "consistency", fromMs: 3100, toMs: 4100 },
    ],
  },
  {
    text: "showing up every single day",
    startMs: 4400,
    durationMs: 2200,
    tokens: [
      { text: "showing", fromMs: 4400, toMs: 4800 },
      { text: "up", fromMs: 4800, toMs: 5000 },
      { text: "every", fromMs: 5000, toMs: 5350 },
      { text: "single", fromMs: 5350, toMs: 5700 },
      { text: "day", fromMs: 5700, toMs: 6300 },
    ],
  },
  {
    text: "even when you don't feel like it",
    startMs: 6500,
    durationMs: 2400,
    tokens: [
      { text: "even", fromMs: 6500, toMs: 6800 },
      { text: "when", fromMs: 6800, toMs: 7050 },
      { text: "you", fromMs: 7050, toMs: 7250 },
      { text: "don't", fromMs: 7250, toMs: 7550 },
      { text: "feel", fromMs: 7550, toMs: 7850 },
      { text: "like", fromMs: 7850, toMs: 8100 },
      { text: "it", fromMs: 8100, toMs: 8600 },
    ],
  },
  {
    text: "that is what separates",
    startMs: 8800,
    durationMs: 1800,
    tokens: [
      { text: "that", fromMs: 8800, toMs: 9050 },
      { text: "is", fromMs: 9050, toMs: 9200 },
      { text: "what", fromMs: 9200, toMs: 9450 },
      { text: "separates", fromMs: 9450, toMs: 10300 },
    ],
  },
  {
    text: "the good from the great",
    startMs: 10500,
    durationMs: 1800,
    tokens: [
      { text: "the", fromMs: 10500, toMs: 10700 },
      { text: "good", fromMs: 10700, toMs: 11050 },
      { text: "from", fromMs: 11050, toMs: 11300 },
      { text: "the", fromMs: 11300, toMs: 11500 },
      { text: "great", fromMs: 11500, toMs: 12100 },
    ],
  },
  {
    text: "discipline beats motivation",
    startMs: 12300,
    durationMs: 2200,
    tokens: [
      { text: "discipline", fromMs: 12300, toMs: 13000 },
      { text: "beats", fromMs: 13000, toMs: 13400 },
      { text: "motivation", fromMs: 13400, toMs: 14200 },
    ],
  },
  {
    text: "because motivation fades",
    startMs: 14400,
    durationMs: 1800,
    tokens: [
      { text: "because", fromMs: 14400, toMs: 14800 },
      { text: "motivation", fromMs: 14800, toMs: 15500 },
      { text: "fades", fromMs: 15500, toMs: 15900 },
    ],
  },
  {
    text: "but discipline is a choice",
    startMs: 16100,
    durationMs: 2000,
    tokens: [
      { text: "but", fromMs: 16100, toMs: 16300 },
      { text: "discipline", fromMs: 16300, toMs: 16900 },
      { text: "is", fromMs: 16900, toMs: 17100 },
      { text: "a", fromMs: 17100, toMs: 17250 },
      { text: "choice", fromMs: 17250, toMs: 17800 },
    ],
  },
  {
    text: "you make it every morning",
    startMs: 18000,
    durationMs: 1800,
    tokens: [
      { text: "you", fromMs: 18000, toMs: 18200 },
      { text: "make", fromMs: 18200, toMs: 18500 },
      { text: "it", fromMs: 18500, toMs: 18650 },
      { text: "every", fromMs: 18650, toMs: 19000 },
      { text: "morning", fromMs: 19000, toMs: 19600 },
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
