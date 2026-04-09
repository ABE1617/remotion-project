import React from "react";
import {
  AbsoluteFill,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import { Video } from "@remotion/media";
import { HormoziPopIn } from "../components/captions/HormoziPopIn";
import type { HormoziHighlightWord } from "../components/captions/HormoziPopIn";
import { GlitchHighlight } from "../components/captions/GlitchHighlight";
import type { GlitchHighlightWord } from "../components/captions/GlitchHighlight";
import { EmojiPop } from "../components/captions/EmojiPop";
import { NegativeFlash } from "../components/captions/NegativeFlash";
import type { TikTokPage } from "../types/captions";
import { FONT_FAMILIES } from "../utils/fonts";

/* ─── Title Card ─── */

const TitleCard: React.FC<{
  title: string;
  subtitle: string;
}> = ({ title, subtitle }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleIn = spring({ fps, frame, config: { mass: 0.5, damping: 12, stiffness: 100 } });
  const subtitleIn = spring({
    fps,
    frame: frame - 8,
    config: { mass: 0.5, damping: 12, stiffness: 100 },
  });

  const titleOpacity = interpolate(titleIn, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  const titleY = interpolate(titleIn, [0, 1], [40, 0], { extrapolateRight: "clamp" });
  const subtitleOpacity = interpolate(subtitleIn, [0, 1], [0, 0.6], { extrapolateRight: "clamp" });
  const subtitleY = interpolate(subtitleIn, [0, 1], [20, 0], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#000000",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 20,
      }}
    >
      <div
        style={{
          fontFamily: FONT_FAMILIES.montserrat,
          fontWeight: 900,
          fontSize: 72,
          color: "#FFFFFF",
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
          textAlign: "center",
          padding: "0 60px",
        }}
      >
        {title}
      </div>
      <div
        style={{
          fontFamily: FONT_FAMILIES.montserrat,
          fontWeight: 400,
          fontSize: 28,
          color: "#FFFFFF",
          opacity: subtitleOpacity,
          transform: `translateY(${subtitleY}px)`,
          letterSpacing: "0.15em",
          textTransform: "uppercase",
        }}
      >
        {subtitle}
      </div>
    </AbsoluteFill>
  );
};

/* ─── Section timings (in frames at 30fps) ─── */

const TITLE_DURATION = 75; // 2.5s
const SECTION_DURATION = 270; // 9s per demo section
const SECTION_WITH_TITLE = TITLE_DURATION + SECTION_DURATION;

/* ─── Hormozi Data ─── */

const HORMOZI_PAGES: TikTokPage[] = [
  {
    text: "you need to stop",
    startMs: 0,
    durationMs: 900,
    tokens: [
      { text: "you", fromMs: 0, toMs: 180 },
      { text: "need", fromMs: 180, toMs: 360 },
      { text: "to", fromMs: 360, toMs: 480 },
      { text: "stop", fromMs: 480, toMs: 850 },
    ],
  },
  {
    text: "making excuses",
    startMs: 1000,
    durationMs: 800,
    tokens: [
      { text: "making", fromMs: 1000, toMs: 1300 },
      { text: "excuses", fromMs: 1300, toMs: 1700 },
    ],
  },
  {
    text: "and start taking",
    startMs: 1850,
    durationMs: 850,
    tokens: [
      { text: "and", fromMs: 1850, toMs: 2000 },
      { text: "start", fromMs: 2000, toMs: 2230 },
      { text: "taking", fromMs: 2230, toMs: 2550 },
    ],
  },
  {
    text: "massive action",
    startMs: 2700,
    durationMs: 800,
    tokens: [
      { text: "massive", fromMs: 2700, toMs: 3050 },
      { text: "action", fromMs: 3050, toMs: 3400 },
    ],
  },
  {
    text: "every single day",
    startMs: 3550,
    durationMs: 850,
    tokens: [
      { text: "every", fromMs: 3550, toMs: 3770 },
      { text: "single", fromMs: 3770, toMs: 4000 },
      { text: "day", fromMs: 4000, toMs: 4300 },
    ],
  },
  {
    text: "the people who win",
    startMs: 4450,
    durationMs: 900,
    tokens: [
      { text: "the", fromMs: 4450, toMs: 4570 },
      { text: "people", fromMs: 4570, toMs: 4800 },
      { text: "who", fromMs: 4800, toMs: 4950 },
      { text: "win", fromMs: 4950, toMs: 5250 },
    ],
  },
  {
    text: "are not smarter",
    startMs: 5400,
    durationMs: 800,
    tokens: [
      { text: "are", fromMs: 5400, toMs: 5530 },
      { text: "not", fromMs: 5530, toMs: 5680 },
      { text: "smarter", fromMs: 5680, toMs: 6050 },
    ],
  },
  {
    text: "they just outwork",
    startMs: 6200,
    durationMs: 850,
    tokens: [
      { text: "they", fromMs: 6200, toMs: 6350 },
      { text: "just", fromMs: 6350, toMs: 6530 },
      { text: "outwork", fromMs: 6530, toMs: 6900 },
    ],
  },
  {
    text: "everyone else",
    startMs: 7050,
    durationMs: 700,
    tokens: [
      { text: "everyone", fromMs: 7050, toMs: 7400 },
      { text: "else", fromMs: 7400, toMs: 7650 },
    ],
  },
];

const HORMOZI_HIGHLIGHTS: HormoziHighlightWord[] = [
  { text: "stop", color: "#F7C204" },
  { text: "excuses", color: "#F7C204" },
  { text: "massive", color: "#02FB23" },
  { text: "action", color: "#02FB23" },
  { text: "win", color: "#F7C204" },
  { text: "outwork", color: "#02FB23" },
];

/* ─── Glitch Data ─── */

const GLITCH_PAGES: TikTokPage[] = [
  {
    text: "break the system",
    startMs: 0,
    durationMs: 1200,
    tokens: [
      { text: "break", fromMs: 0, toMs: 300 },
      { text: "the", fromMs: 300, toMs: 470 },
      { text: "system", fromMs: 470, toMs: 1050 },
    ],
  },
  {
    text: "before it breaks you",
    startMs: 1350,
    durationMs: 1200,
    tokens: [
      { text: "before", fromMs: 1350, toMs: 1550 },
      { text: "it", fromMs: 1550, toMs: 1670 },
      { text: "breaks", fromMs: 1670, toMs: 2150 },
      { text: "you", fromMs: 2150, toMs: 2400 },
    ],
  },
  {
    text: "your potential",
    startMs: 2600,
    durationMs: 900,
    tokens: [
      { text: "your", fromMs: 2600, toMs: 2800 },
      { text: "potential", fromMs: 2800, toMs: 3400 },
    ],
  },
  {
    text: "is unlimited",
    startMs: 3500,
    durationMs: 900,
    tokens: [
      { text: "is", fromMs: 3500, toMs: 3650 },
      { text: "unlimited", fromMs: 3650, toMs: 4300 },
    ],
  },
  {
    text: "stop waiting",
    startMs: 4500,
    durationMs: 800,
    tokens: [
      { text: "stop", fromMs: 4500, toMs: 4750 },
      { text: "waiting", fromMs: 4750, toMs: 5200 },
    ],
  },
  {
    text: "execute now",
    startMs: 5400,
    durationMs: 900,
    tokens: [
      { text: "execute", fromMs: 5400, toMs: 5900 },
      { text: "now", fromMs: 5900, toMs: 6200 },
    ],
  },
  {
    text: "fear is a liar",
    startMs: 6400,
    durationMs: 1000,
    tokens: [
      { text: "fear", fromMs: 6400, toMs: 6650 },
      { text: "is", fromMs: 6650, toMs: 6780 },
      { text: "a", fromMs: 6780, toMs: 6880 },
      { text: "liar", fromMs: 6880, toMs: 7300 },
    ],
  },
  {
    text: "destroy your comfort",
    startMs: 7500,
    durationMs: 1000,
    tokens: [
      { text: "destroy", fromMs: 7500, toMs: 7900 },
      { text: "your", fromMs: 7900, toMs: 8050 },
      { text: "comfort", fromMs: 8050, toMs: 8400 },
    ],
  },
];

const GLITCH_HIGHLIGHTS: GlitchHighlightWord[] = [
  { text: "system", preset: "cyan" },
  { text: "breaks", preset: "red" },
  { text: "unlimited", preset: "green" },
  { text: "execute", preset: "cyan" },
  { text: "liar", preset: "red" },
  { text: "destroy", preset: "red" },
];

/* ─── Emoji Pop Data ─── */

const EMOJI_PAGES: TikTokPage[] = [
  {
    text: "your brain is",
    startMs: 0,
    durationMs: 900,
    tokens: [
      { text: "your", fromMs: 0, toMs: 200 },
      { text: "brain", fromMs: 200, toMs: 500 },
      { text: "is", fromMs: 500, toMs: 700 },
    ],
  },
  {
    text: "your weapon",
    startMs: 900,
    durationMs: 800,
    tokens: [
      { text: "your", fromMs: 900, toMs: 1100 },
      { text: "weapon", fromMs: 1100, toMs: 1600 },
    ],
  },
  {
    text: "stop crying about it",
    startMs: 1800,
    durationMs: 1200,
    tokens: [
      { text: "stop", fromMs: 1800, toMs: 2050 },
      { text: "crying", fromMs: 2050, toMs: 2400 },
      { text: "about", fromMs: 2400, toMs: 2650 },
      { text: "it", fromMs: 2650, toMs: 2900 },
    ],
  },
  {
    text: "get up and grind",
    startMs: 3100,
    durationMs: 1100,
    tokens: [
      { text: "get", fromMs: 3100, toMs: 3300 },
      { text: "up", fromMs: 3300, toMs: 3450 },
      { text: "and", fromMs: 3450, toMs: 3600 },
      { text: "grind", fromMs: 3600, toMs: 4050 },
    ],
  },
  {
    text: "the money won't wait",
    startMs: 4250,
    durationMs: 1100,
    tokens: [
      { text: "the", fromMs: 4250, toMs: 4400 },
      { text: "money", fromMs: 4400, toMs: 4700 },
      { text: "won't", fromMs: 4700, toMs: 4950 },
      { text: "wait", fromMs: 4950, toMs: 5250 },
    ],
  },
  {
    text: "nobody is coming",
    startMs: 5450,
    durationMs: 1000,
    tokens: [
      { text: "nobody", fromMs: 5450, toMs: 5700 },
      { text: "is", fromMs: 5700, toMs: 5850 },
      { text: "coming", fromMs: 5850, toMs: 6350 },
    ],
  },
  {
    text: "to save you",
    startMs: 6500,
    durationMs: 900,
    tokens: [
      { text: "to", fromMs: 6500, toMs: 6650 },
      { text: "save", fromMs: 6650, toMs: 6950 },
      { text: "you", fromMs: 6950, toMs: 7300 },
    ],
  },
  {
    text: "be your own king",
    startMs: 7500,
    durationMs: 1000,
    tokens: [
      { text: "be", fromMs: 7500, toMs: 7700 },
      { text: "your", fromMs: 7700, toMs: 7900 },
      { text: "own", fromMs: 7900, toMs: 8100 },
      { text: "king", fromMs: 8100, toMs: 8400 },
    ],
  },
];

/* ─── Negative Flash Data ─── */

const NEGATIVE_PAGES: TikTokPage[] = [
  {
    text: "the stakes have never been this high",
    startMs: 0,
    durationMs: 2000,
    tokens: [
      { text: "the", fromMs: 0, toMs: 200 },
      { text: "stakes", fromMs: 200, toMs: 500 },
      { text: "have", fromMs: 500, toMs: 700 },
      { text: "never", fromMs: 700, toMs: 1000 },
      { text: "been", fromMs: 1000, toMs: 1300 },
      { text: "this", fromMs: 1300, toMs: 1500 },
      { text: "high", fromMs: 1500, toMs: 1900 },
    ],
  },
  {
    text: "you either win or die trying",
    startMs: 2100,
    durationMs: 2000,
    tokens: [
      { text: "you", fromMs: 2100, toMs: 2300 },
      { text: "either", fromMs: 2300, toMs: 2600 },
      { text: "win", fromMs: 2600, toMs: 2950 },
      { text: "or", fromMs: 2950, toMs: 3100 },
      { text: "die", fromMs: 3100, toMs: 3400 },
      { text: "trying", fromMs: 3400, toMs: 4000 },
    ],
  },
  {
    text: "so stop playing small",
    startMs: 4200,
    durationMs: 1600,
    tokens: [
      { text: "so", fromMs: 4200, toMs: 4350 },
      { text: "stop", fromMs: 4350, toMs: 4650 },
      { text: "playing", fromMs: 4650, toMs: 4950 },
      { text: "small", fromMs: 4950, toMs: 5700 },
    ],
  },
  {
    text: "this is your life fight for it",
    startMs: 5900,
    durationMs: 2200,
    tokens: [
      { text: "this", fromMs: 5900, toMs: 6100 },
      { text: "is", fromMs: 6100, toMs: 6250 },
      { text: "your", fromMs: 6250, toMs: 6450 },
      { text: "life", fromMs: 6450, toMs: 6800 },
      { text: "fight", fromMs: 6800, toMs: 7200 },
      { text: "for", fromMs: 7200, toMs: 7400 },
      { text: "it", fromMs: 7400, toMs: 8000 },
    ],
  },
];

/* ─── Main Showcase Component ─── */

export const ShowcaseDemo: React.FC = () => {
  const section1Start = 0;
  const section2Start = SECTION_WITH_TITLE;
  const section3Start = SECTION_WITH_TITLE * 2;
  const section4Start = SECTION_WITH_TITLE * 3;

  return (
    <AbsoluteFill style={{ backgroundColor: "#000000" }}>
      {/* ═══ Section 1: Hormozi Pop-In ═══ */}
      <Sequence from={section1Start} durationInFrames={TITLE_DURATION}>
        <TitleCard title="Hormozi Pop-In" subtitle="word-by-word pop animation" />
      </Sequence>
      <Sequence
        from={section1Start + TITLE_DURATION}
        durationInFrames={SECTION_DURATION}
      >
        <AbsoluteFill>
          <Video
            src={staticFile("sample-video.mp4")}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          <HormoziPopIn
            pages={HORMOZI_PAGES}
            highlightWords={HORMOZI_HIGHLIGHTS}
            position="bottom"
          />
        </AbsoluteFill>
      </Sequence>

      {/* ═══ Section 2: Glitch Highlight ═══ */}
      <Sequence from={section2Start} durationInFrames={TITLE_DURATION}>
        <TitleCard title="Glitch Highlight" subtitle="rgb split + distortion on keywords" />
      </Sequence>
      <Sequence
        from={section2Start + TITLE_DURATION}
        durationInFrames={SECTION_DURATION}
      >
        <AbsoluteFill>
          <Video
            src={staticFile("sample-video.mp4")}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          <GlitchHighlight
            pages={GLITCH_PAGES}
            highlightWords={GLITCH_HIGHLIGHTS}
            glitchDurationFrames={14}
            position="bottom"
          />
        </AbsoluteFill>
      </Sequence>

      {/* ═══ Section 3: Emoji Pop ═══ */}
      <Sequence from={section3Start} durationInFrames={TITLE_DURATION}>
        <TitleCard title="Emoji Pop" subtitle="contextual emoji reactions" />
      </Sequence>
      <Sequence
        from={section3Start + TITLE_DURATION}
        durationInFrames={SECTION_DURATION}
      >
        <AbsoluteFill>
          <Video
            src={staticFile("sample-video.mp4")}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          <EmojiPop pages={EMOJI_PAGES} position="bottom" />
        </AbsoluteFill>
      </Sequence>

      {/* ═══ Section 4: Negative Flash ═══ */}
      <Sequence from={section4Start} durationInFrames={TITLE_DURATION}>
        <TitleCard title="Negative Flash" subtitle="color-inverted keyword effect" />
      </Sequence>
      <Sequence
        from={section4Start + TITLE_DURATION}
        durationInFrames={SECTION_DURATION}
      >
        <AbsoluteFill>
          <Video
            src={staticFile("sample-video.mp4")}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          <NegativeFlash pages={NEGATIVE_PAGES} position="bottom" />
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};
