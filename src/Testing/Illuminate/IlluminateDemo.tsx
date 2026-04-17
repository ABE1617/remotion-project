import React from "react";
import { AbsoluteFill, staticFile } from "remotion";
import { Video } from "@remotion/media";
import { Illuminate } from "./Illuminate";
import type { TikTokPage } from "../../types/captions";

const PAGES: TikTokPage[] = [
  { text: "Being present", startMs: 100, durationMs: 1800, tokens: [{ text: "Being", fromMs: 100, toMs: 500 }, { text: "present", fromMs: 500, toMs: 1900 }] },
  { text: "without pressure", startMs: 2000, durationMs: 1800, tokens: [{ text: "without", fromMs: 2000, toMs: 2500 }, { text: "pressure", fromMs: 2500, toMs: 3800 }] },
  { text: "changes everything", startMs: 3900, durationMs: 1600, tokens: [{ text: "changes", fromMs: 3900, toMs: 4500 }, { text: "everything", fromMs: 4500, toMs: 5500 }] },
  { text: "about how you", startMs: 5600, durationMs: 1400, tokens: [{ text: "about", fromMs: 5600, toMs: 5900 }, { text: "how", fromMs: 5900, toMs: 6300 }, { text: "you", fromMs: 6300, toMs: 7000 }] },
  { text: "show up", startMs: 7100, durationMs: 1400, tokens: [{ text: "show", fromMs: 7100, toMs: 7700 }, { text: "up", fromMs: 7700, toMs: 8500 }] },
];

const KEYWORDS = ["present", "pressure", "changes", "everything", "show"];

export const IlluminateDemo: React.FC = () => (
  <AbsoluteFill>
    <Video src={staticFile("sample-video.mp4")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    <Illuminate pages={PAGES} keywords={KEYWORDS} position="bottom" />
  </AbsoluteFill>
);
