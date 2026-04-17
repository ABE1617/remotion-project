import React from "react";
import {
  AbsoluteFill,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { Video } from "@remotion/media";
import { FONT_FAMILIES } from "../utils/fonts";
import {
  LowerThird,
  BRollFrame,
  QuoteCard,
  StatCard,
  Notification,
  ChartReveal,
  SpeechBubble,
  ProgressBar,
  ChatThread,
  TornPaper,
  StickyNotes,
  RecordingFrame,
} from "../components/motion-graphics";

// ---------------------------------------------------------------------------
// MGShowcaseDemo — plays all 12 delivered motion graphics sequentially over
// the same sample footage. Each segment shows a small centered title card
// at the top of the frame so the viewer knows which component is running.
// ---------------------------------------------------------------------------

const FPS = 30;

// Small fading title shown at the top of each segment.
const SegmentTitle: React.FC<{
  text: string;
  segmentFrames: number;
}> = ({ text, segmentFrames }) => {
  const frame = useCurrentFrame();
  const fadeIn = interpolate(frame, [0, 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fadeOut = interpolate(
    frame,
    [segmentFrames - 10, segmentFrames - 2],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const opacity = Math.min(fadeIn, fadeOut);
  const driftY = interpolate(frame, [0, 8], [-8, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        top: 64,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        pointerEvents: "none",
        opacity,
        transform: `translateY(${driftY}px)`,
      }}
    >
      <div
        style={{
          fontFamily: FONT_FAMILIES.inter,
          fontSize: 26,
          fontWeight: 600,
          color: "#F2E9D6",
          letterSpacing: "0.32em",
          textTransform: "uppercase",
          textShadow:
            "0 2px 10px rgba(0,0,0,0.9), 0 1px 3px rgba(0,0,0,0.7)",
          backgroundColor: "rgba(10,10,10,0.72)",
          padding: "12px 22px",
          borderRadius: 2,
          border: "1px solid rgba(200,85,31,0.5)",
        }}
      >
        {text}
      </div>
    </div>
  );
};

const RUN: {
  label: string;
  displayName: string;
  frames: number;
  render: (segmentMs: number) => React.ReactNode;
}[] = [
  {
    label: "LowerThird",
    displayName: "Lower Third",
    frames: 150,
    render: (ms) => (
      <LowerThird
        name="Zac Alexander"
        title="Founder · Alexander Media"
        startMs={200}
        durationMs={ms - 400}
      />
    ),
  },
  {
    label: "BRollFrame",
    displayName: "B-Roll Frame",
    frames: 210,
    render: (ms) => (
      <BRollFrame
        src={[
          staticFile("stage.jpg"),
          staticFile("stage.jpg"),
          staticFile("stage.jpg"),
        ]}
        mediaType="image"
        aspectRatio="4:5"
        width={620}
        variant="polaroid"
        caption={["Stage I, 2023", "Stage II, 2024", "Stage III, 2025"]}
        startMs={200}
        durationMs={ms - 400}
      />
    ),
  },
  {
    label: "QuoteCard",
    displayName: "Quote Card",
    frames: 180,
    render: (ms) => (
      <QuoteCard
        quote="The people who are crazy enough to think they can change the world are the ones who do."
        attribution="Steve Jobs, 2005"
        theme="dark"
        startMs={200}
        durationMs={ms - 400}
      />
    ),
  },
  {
    label: "StatCard",
    displayName: "Stat Card",
    frames: 150,
    render: (ms) => (
      <StatCard
        value={500000}
        prefix="$"
        label="In 90 days"
        startMs={200}
        durationMs={ms - 400}
      />
    ),
  },
  {
    label: "Notification",
    displayName: "Notification",
    frames: 240,
    render: (ms) => (
      <Notification
        platform="ios"
        notifications={[
          {
            app: "stripe",
            appName: "Stripe",
            timestamp: "now",
            title: "Payment Received",
            body: "$5,000.00 — Customer: Acme Media",
          },
          {
            app: "apple-pay",
            appName: "Apple Pay",
            timestamp: "1m ago",
            title: "Payment Sent",
            body: "$42.80 to Blue Bottle Coffee",
          },
          {
            app: "imessage",
            appName: "Messages",
            timestamp: "2m ago",
            title: "Sarah",
            body: "Great work on the launch today — congrats!",
          },
        ]}
        startMs={200}
        durationMs={ms - 400}
      />
    ),
  },
  {
    label: "ChartReveal",
    displayName: "Chart Reveal",
    frames: 180,
    render: (ms) => (
      <ChartReveal
        chartType="bar"
        title="Monthly Revenue"
        prefix="$"
        suffix="K"
        data={[
          { label: "Jan", value: 12 },
          { label: "Feb", value: 18 },
          { label: "Mar", value: 25 },
          { label: "Apr", value: 31 },
          { label: "May", value: 48 },
          { label: "Jun", value: 72 },
        ]}
        accentColor="#C8551F"
        highlight={{ index: 5 }}
        startMs={200}
        durationMs={ms - 400}
      />
    ),
  },
  {
    label: "SpeechBubble",
    displayName: "Speech Bubble",
    frames: 150,
    render: (ms) => (
      <SpeechBubble
        platform="tweet"
        name="Zac Alexander"
        handle="@zacalex"
        timestamp="2h"
        verified
        text="This is the single best creative kit I've seen this year."
        stats={{
          replies: 240,
          reposts: 1200,
          likes: 18400,
          views: 420000,
        }}
        startMs={200}
        durationMs={ms - 400}
      />
    ),
  },
  {
    label: "ProgressBar",
    displayName: "Progress Bar",
    frames: 150,
    render: (ms) => (
      <ProgressBar
        label="Road to the goal"
        value={72000}
        total={100000}
        formatValue={(v) => `$${(v / 1000).toFixed(0)}K`}
        fillColor="#D4A12A"
        accentColor="#D4A12A"
        milestones={[
          { at: 0.25, label: "$25K" },
          { at: 0.5, label: "$50K" },
          { at: 0.75, label: "$75K" },
        ]}
        startMs={200}
        durationMs={ms - 400}
      />
    ),
  },
  {
    label: "ChatThread",
    displayName: "Chat Thread",
    frames: 300,
    render: (ms) => (
      <ChatThread
        header={{
          name: "Alex",
          subtitle: "iMessage",
          initials: "A",
          avatarColor: "#C8551F",
        }}
        messages={[
          { sender: "them", text: "Hey — saw your last launch.", typingMs: 800 },
          { sender: "me", text: "Oh yeah? What did you think?" },
          {
            sender: "them",
            text: "Honestly? Best work I've seen from you.",
            typingMs: 1100,
          },
          { sender: "me", text: "Means a lot 🙏" },
          {
            sender: "them",
            text: "Want to run something similar for us next quarter.",
            typingMs: 1300,
          },
        ]}
        startMs={200}
        durationMs={ms - 400}
      />
    ),
  },
  {
    label: "TornPaper",
    displayName: "Torn Paper",
    frames: 150,
    render: (ms) => (
      <TornPaper
        topText="BREAKING"
        bottomText="NEWS"
        startMs={200}
        durationMs={ms - 400}
      />
    ),
  },
  {
    label: "StickyNotes",
    displayName: "Sticky Notes",
    frames: 180,
    render: (ms) => (
      <StickyNotes
        notes={[
          { text: "Focus", color: "#FFEF8C", rotation: -6 },
          { text: "Ship it", color: "#A8D7FF", rotation: 3 },
          { text: "Celebrate", color: "#FFB8D1", rotation: -2 },
        ]}
        startMs={300}
        durationMs={ms - 600}
      />
    ),
  },
  {
    label: "RecordingFrame",
    displayName: "Recording Frame",
    frames: 150,
    render: (ms) => (
      <RecordingFrame startMs={0} durationMs={ms - 200} />
    ),
  },
];

export const MGShowcaseDemo: React.FC = () => {
  let cursor = 0;
  const segments = RUN.map((seg) => {
    const start = cursor;
    cursor += seg.frames;
    return { ...seg, start };
  });

  return (
    <AbsoluteFill>
      <Video
        src={staticFile("sample-video.mp4")}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
        loop
      />

      {segments.map((seg) => {
        const segmentMs = (seg.frames / FPS) * 1000;
        return (
          <Sequence
            key={seg.label}
            from={seg.start}
            durationInFrames={seg.frames}
          >
            {seg.render(segmentMs)}
            <SegmentTitle
              text={seg.displayName}
              segmentFrames={seg.frames}
            />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

export const MG_SHOWCASE_TOTAL_FRAMES = RUN.reduce(
  (sum, seg) => sum + seg.frames,
  0,
);
