import React from "react";
import { AbsoluteFill, Sequence, staticFile } from "remotion";
import { Video } from "@remotion/media";
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
// the same sample footage. Each MG gets its own segment; most at 5s, a few
// that need longer to play out (Notification stack, ChatThread, BRollFrame
// stack) get 6-9s so everything lands cleanly before the next starts.
// ---------------------------------------------------------------------------

// Segment durations in frames (@ 30fps). Keep in sync with RUN[] below.
const FPS = 30;

const RUN: {
  label: string;
  frames: number;
  render: (segmentMs: number) => React.ReactNode;
}[] = [
  {
    label: "LowerThird",
    frames: 150, // 5s
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
    frames: 210, // 7s — lets all 3 polaroids land + hold + exit
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
    frames: 180, // 6s
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
    frames: 150, // 5s
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
    frames: 240, // 8s — 3 notifications with 1s stagger + hold + exit
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
    frames: 180, // 6s
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
    frames: 150, // 5s
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
    frames: 150, // 5s
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
    frames: 300, // 10s — 5 messages with typing indicators
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
    frames: 150, // 5s
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
    frames: 180, // 6s
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
    frames: 150, // 5s
    render: (ms) => (
      <RecordingFrame startMs={0} durationMs={ms - 200} />
    ),
  },
];

export const MGShowcaseDemo: React.FC = () => {
  // Compute cumulative start frames.
  let cursor = 0;
  const segments = RUN.map((seg) => {
    const start = cursor;
    cursor += seg.frames;
    return { ...seg, start };
  });

  return (
    <AbsoluteFill>
      {/* Background video — loops across the whole showcase */}
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
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

// Total duration for the composition (exported for Root.tsx).
export const MG_SHOWCASE_TOTAL_FRAMES = RUN.reduce(
  (sum, seg) => sum + seg.frames,
  0,
);
