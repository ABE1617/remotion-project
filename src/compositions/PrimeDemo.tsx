import React from "react";
import { AbsoluteFill, staticFile, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Video } from "@remotion/media";
import { Prime } from "../components/captions/Prime";
import type { TikTokPage } from "../types/captions";

const PAGES: TikTokPage[] = [
  {
    text: "being",
    startMs: 100,
    durationMs: 200,
    tokens: [
      { text: "being", fromMs: 100, toMs: 250 },
    ],
  },
  {
    text: "present",
    startMs: 250,
    durationMs: 300,
    tokens: [
      { text: "present", fromMs: 250, toMs: 500 },
    ],
  },
  {
    text: "without pressure",
    startMs: 550,
    durationMs: 450,
    tokens: [
      { text: "without", fromMs: 550, toMs: 750 },
      { text: "pressure", fromMs: 750, toMs: 950 },
    ],
  },
  {
    text: "isn't just for",
    startMs: 1000,
    durationMs: 400,
    tokens: [
      { text: "isn't", fromMs: 1000, toMs: 1100 },
      { text: "just", fromMs: 1100, toMs: 1200 },
      { text: "for", fromMs: 1200, toMs: 1350 },
    ],
  },
  {
    text: "kids",
    startMs: 1350,
    durationMs: 350,
    tokens: [
      { text: "kids", fromMs: 1350, toMs: 1650 },
    ],
  },
  {
    text: "it changes",
    startMs: 1700,
    durationMs: 400,
    tokens: [
      { text: "it", fromMs: 1700, toMs: 1800 },
      { text: "changes", fromMs: 1800, toMs: 2050 },
    ],
  },
  {
    text: "everything",
    startMs: 2050,
    durationMs: 400,
    tokens: [
      { text: "everything", fromMs: 2050, toMs: 2400 },
    ],
  },
  {
    text: "about how you",
    startMs: 2450,
    durationMs: 400,
    tokens: [
      { text: "about", fromMs: 2450, toMs: 2550 },
      { text: "how", fromMs: 2550, toMs: 2650 },
      { text: "you", fromMs: 2650, toMs: 2800 },
    ],
  },
  {
    text: "show up",
    startMs: 2800,
    durationMs: 350,
    tokens: [
      { text: "show", fromMs: 2800, toMs: 2950 },
      { text: "up", fromMs: 2950, toMs: 3100 },
    ],
  },
  {
    text: "the real work starts",
    startMs: 3150,
    durationMs: 500,
    tokens: [
      { text: "the", fromMs: 3150, toMs: 3250 },
      { text: "real", fromMs: 3250, toMs: 3400 },
      { text: "work", fromMs: 3400, toMs: 3500 },
      { text: "starts", fromMs: 3500, toMs: 3600 },
    ],
  },
  {
    text: "when you stop",
    startMs: 3650,
    durationMs: 400,
    tokens: [
      { text: "when", fromMs: 3650, toMs: 3750 },
      { text: "you", fromMs: 3750, toMs: 3850 },
      { text: "stop", fromMs: 3850, toMs: 4000 },
    ],
  },
  {
    text: "performing",
    startMs: 4000,
    durationMs: 500,
    tokens: [
      { text: "performing", fromMs: 4000, toMs: 4450 },
    ],
  },
];

interface ZoomEvent {
  startMs: number;
  holdMs: number;
  scale: number;
}

const ZOOM_EVENTS: ZoomEvent[] = [
  { startMs: 1350, holdMs: 1200, scale: 1.2 },   // "kids" — hold through emphasis
  { startMs: 4000, holdMs: 1000, scale: 1.25 },   // "performing" — final hit
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
      durationInFrames: Math.round(fps * 0.5),
    });

    const zoomOut = spring({
      frame: frame - startFrame - holdFrames,
      fps,
      config: { damping: 200 },
      durationInFrames: Math.round(fps * 0.6),
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

export const PrimeDemo: React.FC = () => {
  return (
    <AbsoluteFill>
      <ZoomWrapper>
        <Video
          src={staticFile("sample-video.mp4")}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </ZoomWrapper>
      <Prime
        pages={PAGES}
        specialWords={["present", "kids", "everything", "performing"]}
        titleText="progress"
        titleAppearAtMs={100}
        titleDisappearAtMs={1800}
        echoOverlays={[
          { text: "GROWTH", appearAtMs: 3500, disappearAtMs: 4600, fontSize: 300, verticalOffset: 250 },
        ]}
      />
    </AbsoluteFill>
  );
};
