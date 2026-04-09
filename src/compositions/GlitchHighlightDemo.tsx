import React from "react";
import { AbsoluteFill, staticFile } from "remotion";
import { Video } from "@remotion/media";
import { GlitchHighlight } from "../components/captions/GlitchHighlight";
import type { GlitchHighlightWord } from "../components/captions/GlitchHighlight";
import type { TikTokPage } from "../types/captions";

const BOTTOM_PAGES: TikTokPage[] = [
  {
    text: "break the system",
    startMs: 100,
    durationMs: 1200,
    tokens: [
      { text: "break", fromMs: 100, toMs: 350 },
      { text: "the", fromMs: 350, toMs: 520 },
      { text: "system", fromMs: 520, toMs: 1100 },
    ],
  },
  {
    text: "before it breaks you",
    startMs: 1400,
    durationMs: 1200,
    tokens: [
      { text: "before", fromMs: 1400, toMs: 1600 },
      { text: "it", fromMs: 1600, toMs: 1720 },
      { text: "breaks", fromMs: 1720, toMs: 2200 },
      { text: "you", fromMs: 2200, toMs: 2450 },
    ],
  },
  {
    text: "your potential is unlimited",
    startMs: 2700,
    durationMs: 1400,
    tokens: [
      { text: "your", fromMs: 2700, toMs: 2900 },
      { text: "potential", fromMs: 2900, toMs: 3200 },
      { text: "is", fromMs: 3200, toMs: 3320 },
      { text: "unlimited", fromMs: 3320, toMs: 3900 },
    ],
  },
  {
    text: "stop waiting for permission",
    startMs: 4200,
    durationMs: 1200,
    tokens: [
      { text: "stop", fromMs: 4200, toMs: 4400 },
      { text: "waiting", fromMs: 4400, toMs: 4700 },
      { text: "for", fromMs: 4700, toMs: 4850 },
      { text: "permission", fromMs: 4850, toMs: 5300 },
    ],
  },
];

const TOP_PAGES: TikTokPage[] = [
  {
    text: "execute now",
    startMs: 5500,
    durationMs: 1100,
    tokens: [
      { text: "execute", fromMs: 5500, toMs: 6100 },
      { text: "now", fromMs: 6100, toMs: 6500 },
    ],
  },
  {
    text: "fear is a liar",
    startMs: 6700,
    durationMs: 1200,
    tokens: [
      { text: "fear", fromMs: 6700, toMs: 6950 },
      { text: "is", fromMs: 6950, toMs: 7080 },
      { text: "a", fromMs: 7080, toMs: 7180 },
      { text: "liar", fromMs: 7180, toMs: 7700 },
    ],
  },
  {
    text: "destroy your comfort zone",
    startMs: 7900,
    durationMs: 1300,
    tokens: [
      { text: "destroy", fromMs: 7900, toMs: 8450 },
      { text: "your", fromMs: 8450, toMs: 8620 },
      { text: "comfort", fromMs: 8620, toMs: 8900 },
      { text: "zone", fromMs: 8900, toMs: 9100 },
    ],
  },
  {
    text: "levels to this game",
    startMs: 9300,
    durationMs: 1200,
    tokens: [
      { text: "levels", fromMs: 9300, toMs: 9550 },
      { text: "to", fromMs: 9550, toMs: 9680 },
      { text: "this", fromMs: 9680, toMs: 9850 },
      { text: "game", fromMs: 9850, toMs: 10300 },
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
    <AbsoluteFill>
      <Video
        src={staticFile("sample-video.mp4")}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
      <GlitchHighlight
        pages={BOTTOM_PAGES}
        highlightWords={HIGHLIGHT_WORDS}
        glitchDurationFrames={14}
        position="bottom"
      />
      <GlitchHighlight
        pages={TOP_PAGES}
        highlightWords={HIGHLIGHT_WORDS}
        glitchDurationFrames={14}
        position="top"
      />
    </AbsoluteFill>
  );
};
