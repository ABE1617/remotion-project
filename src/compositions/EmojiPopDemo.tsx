import React from "react";
import { AbsoluteFill, Video, staticFile } from "remotion";
import { EmojiPop } from "../components/captions/EmojiPop";
import type { TikTokPage } from "../types/captions";

const BOTTOM_PAGES: TikTokPage[] = [
  {
    text: "listen to me right now",
    startMs: 100,
    durationMs: 1300,
    tokens: [
      { text: "listen", fromMs: 100, toMs: 400 },
      { text: "to", fromMs: 400, toMs: 530 },
      { text: "me", fromMs: 530, toMs: 700 },
      { text: "right", fromMs: 700, toMs: 950 },
      { text: "now", fromMs: 950, toMs: 1300 },
    ],
  },
  {
    text: "your brain is your weapon",
    startMs: 1500,
    durationMs: 1500,
    tokens: [
      { text: "your", fromMs: 1500, toMs: 1700 },
      { text: "brain", fromMs: 1700, toMs: 2050 },
      { text: "is", fromMs: 2050, toMs: 2200 },
      { text: "your", fromMs: 2200, toMs: 2400 },
      { text: "weapon", fromMs: 2400, toMs: 2900 },
    ],
  },
  {
    text: "stop crying about it",
    startMs: 3100,
    durationMs: 1300,
    tokens: [
      { text: "stop", fromMs: 3100, toMs: 3350 },
      { text: "crying", fromMs: 3350, toMs: 3700 },
      { text: "about", fromMs: 3700, toMs: 3950 },
      { text: "it", fromMs: 3950, toMs: 4300 },
    ],
  },
  {
    text: "get up and grind harder",
    startMs: 4500,
    durationMs: 1500,
    tokens: [
      { text: "get", fromMs: 4500, toMs: 4700 },
      { text: "up", fromMs: 4700, toMs: 4850 },
      { text: "and", fromMs: 4850, toMs: 5000 },
      { text: "grind", fromMs: 5000, toMs: 5350 },
      { text: "harder", fromMs: 5350, toMs: 5900 },
    ],
  },
  {
    text: "the money won't wait",
    startMs: 6100,
    durationMs: 1300,
    tokens: [
      { text: "the", fromMs: 6100, toMs: 6250 },
      { text: "money", fromMs: 6250, toMs: 6550 },
      { text: "won't", fromMs: 6550, toMs: 6800 },
      { text: "wait", fromMs: 6800, toMs: 7300 },
    ],
  },
  {
    text: "while you party they build",
    startMs: 7500,
    durationMs: 1500,
    tokens: [
      { text: "while", fromMs: 7500, toMs: 7700 },
      { text: "you", fromMs: 7700, toMs: 7850 },
      { text: "party", fromMs: 7850, toMs: 8200 },
      { text: "they", fromMs: 8200, toMs: 8400 },
      { text: "build", fromMs: 8400, toMs: 8900 },
    ],
  },
  {
    text: "that idea in your mind",
    startMs: 9100,
    durationMs: 1400,
    tokens: [
      { text: "that", fromMs: 9100, toMs: 9300 },
      { text: "idea", fromMs: 9300, toMs: 9600 },
      { text: "in", fromMs: 9600, toMs: 9750 },
      { text: "your", fromMs: 9750, toMs: 9950 },
      { text: "mind", fromMs: 9950, toMs: 10400 },
    ],
  },
];

const TOP_PAGES: TikTokPage[] = [
  {
    text: "execute it now",
    startMs: 10600,
    durationMs: 1100,
    tokens: [
      { text: "execute", fromMs: 10600, toMs: 10950 },
      { text: "it", fromMs: 10950, toMs: 11100 },
      { text: "now", fromMs: 11100, toMs: 11600 },
    ],
  },
  {
    text: "the world doesn't care",
    startMs: 11800,
    durationMs: 1300,
    tokens: [
      { text: "the", fromMs: 11800, toMs: 11950 },
      { text: "world", fromMs: 11950, toMs: 12250 },
      { text: "doesn't", fromMs: 12250, toMs: 12550 },
      { text: "care", fromMs: 12550, toMs: 13000 },
    ],
  },
  {
    text: "nobody is coming to save you",
    startMs: 13200,
    durationMs: 1600,
    tokens: [
      { text: "nobody", fromMs: 13200, toMs: 13500 },
      { text: "is", fromMs: 13500, toMs: 13650 },
      { text: "coming", fromMs: 13650, toMs: 13950 },
      { text: "to", fromMs: 13950, toMs: 14100 },
      { text: "save", fromMs: 14100, toMs: 14400 },
      { text: "you", fromMs: 14400, toMs: 14700 },
    ],
  },
  {
    text: "be your own king",
    startMs: 14900,
    durationMs: 1200,
    tokens: [
      { text: "be", fromMs: 14900, toMs: 15100 },
      { text: "your", fromMs: 15100, toMs: 15300 },
      { text: "own", fromMs: 15300, toMs: 15500 },
      { text: "king", fromMs: 15500, toMs: 16000 },
    ],
  },
  {
    text: "destroy every excuse",
    startMs: 16200,
    durationMs: 1300,
    tokens: [
      { text: "destroy", fromMs: 16200, toMs: 16550 },
      { text: "every", fromMs: 16550, toMs: 16850 },
      { text: "excuse", fromMs: 16850, toMs: 17400 },
    ],
  },
  {
    text: "focus like a laser",
    startMs: 17600,
    durationMs: 1300,
    tokens: [
      { text: "focus", fromMs: 17600, toMs: 17900 },
      { text: "like", fromMs: 17900, toMs: 18100 },
      { text: "a", fromMs: 18100, toMs: 18200 },
      { text: "laser", fromMs: 18200, toMs: 18800 },
    ],
  },
  {
    text: "this is your dream",
    startMs: 19000,
    durationMs: 1200,
    tokens: [
      { text: "this", fromMs: 19000, toMs: 19200 },
      { text: "is", fromMs: 19200, toMs: 19350 },
      { text: "your", fromMs: 19350, toMs: 19550 },
      { text: "dream", fromMs: 19550, toMs: 20100 },
    ],
  },
  {
    text: "go win it all",
    startMs: 20300,
    durationMs: 1200,
    tokens: [
      { text: "go", fromMs: 20300, toMs: 20500 },
      { text: "win", fromMs: 20500, toMs: 20800 },
      { text: "it", fromMs: 20800, toMs: 20950 },
      { text: "all", fromMs: 20950, toMs: 21400 },
    ],
  },
];

export const EmojiPopDemo: React.FC = () => {
  return (
    <AbsoluteFill>
      <Video
        src={staticFile("sample-video.mp4")}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
      <EmojiPop pages={[...BOTTOM_PAGES, ...TOP_PAGES]} position="bottom" />
    </AbsoluteFill>
  );
};
