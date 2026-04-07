import React from "react";
import { AbsoluteFill } from "remotion";
import { GlitchHighlight } from "../components/captions/GlitchHighlight";
import type { GlitchHighlightWord } from "../components/captions/GlitchHighlight";
import type { CaptionPage } from "../types/captions";

const SAMPLE_PAGES: CaptionPage[] = [
  {
    text: "break the system",
    startMs: 100,
    durationMs: 1200,
    tokens: [
      { text: "break", start: 100, end: 350 },
      { text: "the", start: 350, end: 520 },
      { text: "system", start: 520, end: 1100 },
    ],
  },
  {
    text: "before it breaks you",
    startMs: 1400,
    durationMs: 1200,
    tokens: [
      { text: "before", start: 1400, end: 1600 },
      { text: "it", start: 1600, end: 1720 },
      { text: "breaks", start: 1720, end: 2200 },
      { text: "you", start: 2200, end: 2450 },
    ],
  },
  {
    text: "your potential is unlimited",
    startMs: 2700,
    durationMs: 1400,
    tokens: [
      { text: "your", start: 2700, end: 2900 },
      { text: "potential", start: 2900, end: 3200 },
      { text: "is", start: 3200, end: 3320 },
      { text: "unlimited", start: 3320, end: 3900 },
    ],
  },
  {
    text: "stop waiting for permission",
    startMs: 4200,
    durationMs: 1200,
    tokens: [
      { text: "stop", start: 4200, end: 4400 },
      { text: "waiting", start: 4400, end: 4700 },
      { text: "for", start: 4700, end: 4850 },
      { text: "permission", start: 4850, end: 5300 },
    ],
  },
  {
    text: "execute now",
    startMs: 5500,
    durationMs: 1100,
    tokens: [
      { text: "execute", start: 5500, end: 6100 },
      { text: "now", start: 6100, end: 6500 },
    ],
  },
  {
    text: "fear is a liar",
    startMs: 6700,
    durationMs: 1200,
    tokens: [
      { text: "fear", start: 6700, end: 6950 },
      { text: "is", start: 6950, end: 7080 },
      { text: "a", start: 7080, end: 7180 },
      { text: "liar", start: 7180, end: 7700 },
    ],
  },
  {
    text: "destroy your comfort zone",
    startMs: 7900,
    durationMs: 1300,
    tokens: [
      { text: "destroy", start: 7900, end: 8450 },
      { text: "your", start: 8450, end: 8620 },
      { text: "comfort", start: 8620, end: 8900 },
      { text: "zone", start: 8900, end: 9100 },
    ],
  },
  {
    text: "levels to this game",
    startMs: 9300,
    durationMs: 1200,
    tokens: [
      { text: "levels", start: 9300, end: 9550 },
      { text: "to", start: 9550, end: 9680 },
      { text: "this", start: 9680, end: 9850 },
      { text: "game", start: 9850, end: 10300 },
    ],
  },
];

const HIGHLIGHT_WORDS: GlitchHighlightWord[] = [
  { text: "system", preset: "cyan" },
  { text: "breaks", preset: "red" },
  { text: "unlimited", preset: "green" },
  { text: "execute", preset: "cyan" },
  { text: "liar", preset: "red" },
  { text: "destroy", preset: "red" },
  { text: "game", preset: "yellow" },
];

export const GlitchHighlightDemo: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0a0a" }}>
      <GlitchHighlight
        pages={SAMPLE_PAGES}
        highlightWords={HIGHLIGHT_WORDS}
        glitchDurationFrames={14}
      />
    </AbsoluteFill>
  );
};
