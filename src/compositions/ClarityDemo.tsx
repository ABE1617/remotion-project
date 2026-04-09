import React from "react";
import { AbsoluteFill, staticFile, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Video } from "@remotion/media";
import { Clarity } from "../components/captions/Clarity";
import type { TikTokPage } from "../types/captions";
import type { StickyNotesGroup, ToggleEntry } from "../components/captions/Clarity";

// Zoom events: spring-driven zoom in then out
interface ZoomEvent {
  startMs: number;
  holdMs: number;
  scale: number;
}

const ZOOM_EVENTS: ZoomEvent[] = [
  { startMs: 2800, holdMs: 2500, scale: 1.2 },    // "kids" — hold through "it changes"
  { startMs: 9500, holdMs: 1500, scale: 1.25 },   // "performing" — hold to end
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

const BOTTOM_PAGES: TikTokPage[] = [
  {
    text: "Being present,",
    startMs: 100,
    durationMs: 1000,
    tokens: [
      { text: "being", fromMs: 100, toMs: 350 },
      { text: "present", fromMs: 350, toMs: 1000 },
    ],
  },
  {
    text: "without pressure,",
    startMs: 1200,
    durationMs: 1000,
    tokens: [
      { text: "without", fromMs: 1200, toMs: 1500 },
      { text: "pressure", fromMs: 1500, toMs: 2100 },
    ],
  },
  {
    text: "isn't just for kids.",
    startMs: 2300,
    durationMs: 1200,
    tokens: [
      { text: "isn't", fromMs: 2300, toMs: 2500 },
      { text: "just", fromMs: 2500, toMs: 2700 },
      { text: "for", fromMs: 2700, toMs: 2850 },
      { text: "kids", fromMs: 2850, toMs: 3400 },
    ],
  },
  {
    text: "It changes",
    startMs: 3600,
    durationMs: 900,
    tokens: [
      { text: "it", fromMs: 3600, toMs: 3800 },
      { text: "changes", fromMs: 3800, toMs: 4400 },
    ],
  },
  {
    text: "everything about,",
    startMs: 4600,
    durationMs: 1000,
    tokens: [
      { text: "everything", fromMs: 4600, toMs: 5000 },
      { text: "about", fromMs: 5000, toMs: 5500 },
    ],
  },
  {
    text: "how you show up.",
    startMs: 5700,
    durationMs: 1200,
    tokens: [
      { text: "how", fromMs: 5700, toMs: 5900 },
      { text: "you", fromMs: 5900, toMs: 6100 },
      { text: "show", fromMs: 6100, toMs: 6350 },
      { text: "up", fromMs: 6350, toMs: 6800 },
    ],
  },
  {
    text: "The real work starts,",
    startMs: 7100,
    durationMs: 1200,
    tokens: [
      { text: "the", fromMs: 7100, toMs: 7300 },
      { text: "real", fromMs: 7300, toMs: 7500 },
      { text: "work", fromMs: 7500, toMs: 7750 },
      { text: "starts", fromMs: 7750, toMs: 8200 },
    ],
  },
  {
    text: "when you stop",
    startMs: 8400,
    durationMs: 1000,
    tokens: [
      { text: "when", fromMs: 8400, toMs: 8600 },
      { text: "you", fromMs: 8600, toMs: 8800 },
      { text: "stop", fromMs: 8800, toMs: 9300 },
    ],
  },
  {
    text: "performing.",
    startMs: 9500,
    durationMs: 1000,
    tokens: [
      { text: "performing", fromMs: 9500, toMs: 10400 },
    ],
  },
];

const STICKY_NOTES: StickyNotesGroup[] = [
  {
    appearAtMs: 1500,
    disappearAtMs: 6500,
    notes: [
      { text: "Focus", color: "#FDE68A", rotation: -11 },
      { text: "Calm", color: "#7DD3FC", rotation: 2 },
      { text: "Growth", color: "#FDA4AF", rotation: 9 },
    ],
  },
];

const TOGGLES: ToggleEntry[] = [
  { text: "Deep Focus", appearAtMs: 7200, activateAtMs: 7800, disappearAtMs: 9400 },
];

export const ClarityDemo: React.FC = () => {
  return (
    <AbsoluteFill>
      <ZoomWrapper>
        <Video
          src={staticFile("sample-video.mp4")}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </ZoomWrapper>
      <Clarity
        pages={BOTTOM_PAGES}
        position="bottom"
        stickyNotes={STICKY_NOTES}
        toggles={TOGGLES}
      />
    </AbsoluteFill>
  );
};
