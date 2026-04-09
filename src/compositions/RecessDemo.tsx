import React from "react";
import { AbsoluteFill, staticFile, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Video } from "@remotion/media";
import { Recess } from "../components/captions/Recess";
import type { TikTokPage } from "../types/captions";

const PAGES: TikTokPage[] = [
  {
    text: "being present",
    startMs: 100,
    durationMs: 500,
    tokens: [
      { text: "being", fromMs: 100, toMs: 250 },
      { text: "present", fromMs: 250, toMs: 550 },
    ],
  },
  {
    text: "without pressure",
    startMs: 600,
    durationMs: 500,
    tokens: [
      { text: "without", fromMs: 600, toMs: 800 },
      { text: "pressure", fromMs: 800, toMs: 1050 },
    ],
  },
  {
    text: "isn't just for",
    startMs: 1100,
    durationMs: 400,
    tokens: [
      { text: "isn't", fromMs: 1100, toMs: 1200 },
      { text: "just", fromMs: 1200, toMs: 1300 },
      { text: "for", fromMs: 1300, toMs: 1400 },
    ],
  },
  {
    text: "kids",
    startMs: 1400,
    durationMs: 400,
    tokens: [
      { text: "kids", fromMs: 1400, toMs: 1750 },
    ],
  },
  {
    text: "it changes",
    startMs: 1850,
    durationMs: 400,
    tokens: [
      { text: "it", fromMs: 1850, toMs: 1950 },
      { text: "changes", fromMs: 1950, toMs: 2200 },
    ],
  },
  {
    text: "everything",
    startMs: 2200,
    durationMs: 450,
    tokens: [
      { text: "everything", fromMs: 2200, toMs: 2600 },
    ],
  },
  {
    text: "about how you",
    startMs: 2700,
    durationMs: 400,
    tokens: [
      { text: "about", fromMs: 2700, toMs: 2800 },
      { text: "how", fromMs: 2800, toMs: 2900 },
      { text: "you", fromMs: 2900, toMs: 3000 },
    ],
  },
  {
    text: "show up",
    startMs: 3000,
    durationMs: 450,
    tokens: [
      { text: "show", fromMs: 3000, toMs: 3150 },
      { text: "up", fromMs: 3150, toMs: 3400 },
    ],
  },
  {
    text: "the real work",
    startMs: 3500,
    durationMs: 400,
    tokens: [
      { text: "the", fromMs: 3500, toMs: 3600 },
      { text: "real", fromMs: 3600, toMs: 3700 },
      { text: "work", fromMs: 3700, toMs: 3850 },
    ],
  },
  {
    text: "starts when",
    startMs: 3850,
    durationMs: 400,
    tokens: [
      { text: "starts", fromMs: 3850, toMs: 4000 },
      { text: "when", fromMs: 4000, toMs: 4150 },
    ],
  },
  {
    text: "you stop",
    startMs: 4150,
    durationMs: 400,
    tokens: [
      { text: "you", fromMs: 4150, toMs: 4250 },
      { text: "stop", fromMs: 4250, toMs: 4500 },
    ],
  },
  {
    text: "performing",
    startMs: 4550,
    durationMs: 500,
    tokens: [
      { text: "performing", fromMs: 4550, toMs: 5000 },
    ],
  },
];

interface ZoomEvent {
  startMs: number;
  holdMs: number;
  scale: number;
}

const ZOOM_EVENTS: ZoomEvent[] = [
  { startMs: 1400, holdMs: 1500, scale: 1.2 },    // "kids" — stay zoomed through next pages
  { startMs: 4550, holdMs: 2000, scale: 1.25 },   // "performing" — stay zoomed to the end
];

const ZoomWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  let scale = 1;

  for (const event of ZOOM_EVENTS) {
    const startFrame = Math.round((event.startMs / 1000) * fps);
    const holdFrames = Math.round((event.holdMs / 1000) * fps);
    const zoomAmount = event.scale - 1;

    const zoomIn = spring({
      frame: frame - startFrame,
      fps,
      config: { damping: 200 },
      durationInFrames: Math.round(fps * 0.4),
    });

    const zoomOut = spring({
      frame: frame - startFrame - holdFrames,
      fps,
      config: { damping: 200 },
      durationInFrames: Math.round(fps * 0.5),
    });

    scale += zoomAmount * (zoomIn - zoomOut);
  }

  return (
    <AbsoluteFill
      style={{
        transform: `scale(${scale})`,
        transformOrigin: "center center",
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

export const RecessDemo: React.FC = () => {
  return (
    <AbsoluteFill>
      <ZoomWrapper>
        <Video
          src={staticFile("sample-video.mp4")}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </ZoomWrapper>
      <Recess
        pages={PAGES}
        emphasisWords={["kids", "everything", "performing"]}
        imageOverlays={[
          { src: staticFile("stage.jpg"), appearAtMs: 3500, disappearAtMs: 5500 },
        ]}
      />
    </AbsoluteFill>
  );
};
