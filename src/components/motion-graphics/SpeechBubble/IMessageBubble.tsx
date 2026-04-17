import React from "react";
import { AbsoluteFill, interpolate, spring, useVideoConfig } from "remotion";
import { SPRING_SNAPPY } from "../../../utils/animations";
import { FONT_FAMILIES } from "../../../utils/fonts";
import { useMGPhase } from "../shared/useMGPhase";
import { composeBubbleTransform } from "./shared";
import type { IMessageBubbleProps } from "./types";

// ---------------------------------------------------------------------------
// IMessageBubble — iOS Messages chat bubble in incoming/outgoing color modes.
//
// Outgoing uses the iMessage blue gradient (brighter at the top, deeper at
// the bottom) and its tail hooks off the bottom-right corner. Incoming uses
// the system dark gray with a bottom-left tail. Tails are hand-drawn SVGs
// colored identically to the bubble fill so they blend seamlessly.
//
// Optional `typewriter` mode shows the familiar three-dot "typing" indicator
// bubble for the first ~30 frames, then replaces it with the real bubble
// whose text types character-by-character over the following 60 frames.
// ---------------------------------------------------------------------------

// iMessage outgoing gradient. Top → bottom: cyan-blue → deeper blue.
const OUTGOING_GRADIENT = "linear-gradient(180deg, #1E9BF0 0%, #0479D9 100%)";
const OUTGOING_FALLBACK = "#0A84FF"; // used for the tail solid fill
const INCOMING_COLOR = "#2C2C2E";

const TYPING_PHASE_FRAMES = 30;
const TYPE_REVEAL_FRAMES = 60;

export const IMessageBubble: React.FC<IMessageBubbleProps> = ({
  startMs,
  durationMs,
  enterFrames,
  exitFrames,
  position,
  width = 620,
  messageType,
  text,
  status,
  typewriter = false,
}) => {
  const { fps } = useVideoConfig();
  const { visible, localFrame, exitProgress } = useMGPhase(
    { startMs, durationMs, enterFrames, exitFrames },
    { defaultEnterFrames: 12, defaultExitFrames: 8 },
  );

  if (!visible) return null;

  const isOutgoing = messageType === "outgoing";
  const bubbleFill = isOutgoing ? OUTGOING_GRADIENT : INCOMING_COLOR;
  const tailColor = isOutgoing ? OUTGOING_FALLBACK : INCOMING_COLOR;

  // Main entrance spring (applies to whichever bubble is currently on-screen,
  // whether that's the typing indicator or the real message).
  const enterProgress = spring({
    fps,
    frame: localFrame,
    config: SPRING_SNAPPY,
    durationInFrames: 12,
  });
  const { transform, opacity } = composeBubbleTransform(
    enterProgress,
    exitProgress,
  );

  // --- Typewriter phase logic -----------------------------------------------
  // We split the timeline into three stages when `typewriter` is on:
  //   0                           → typing indicator is visible
  //   TYPING_PHASE_FRAMES         → real bubble appears, text begins revealing
  //   TYPING_PHASE_FRAMES + 60    → full text visible, just holds
  const showTypingIndicator =
    typewriter && localFrame < TYPING_PHASE_FRAMES;

  // Characters to render when we're in type-reveal window.
  let displayedText = text;
  if (typewriter) {
    const typeFrame = localFrame - TYPING_PHASE_FRAMES;
    const chars = Math.max(
      0,
      Math.floor(
        interpolate(typeFrame, [0, TYPE_REVEAL_FRAMES], [0, text.length], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }),
      ),
    );
    displayedText = text.slice(0, chars);
  }

  const left = position ? position.x : (1080 - width) / 2;
  const top = position ? position.y : 820;

  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left,
          top,
          width,
          transform,
          opacity,
          transformOrigin: "center center",
          fontFamily: FONT_FAMILIES.inter,
          display: "flex",
          // Outgoing hugs the right edge of the container; incoming hugs left.
          justifyContent: isOutgoing ? "flex-end" : "flex-start",
          flexDirection: "column",
          alignItems: isOutgoing ? "flex-end" : "flex-start",
          WebkitFontSmoothing: "antialiased",
        }}
      >
        {showTypingIndicator ? (
          <TypingIndicatorBubble
            isOutgoing={isOutgoing}
            bubbleFill={bubbleFill}
            tailColor={tailColor}
            frame={localFrame}
          />
        ) : (
          <MessageBubble
            isOutgoing={isOutgoing}
            bubbleFill={bubbleFill}
            tailColor={tailColor}
            text={displayedText}
          />
        )}

        {/* Status line — only rendered for outgoing bubbles once the real
            message is shown. Hidden during typing indicator phase. */}
        {isOutgoing && status && !showTypingIndicator ? (
          <div
            style={{
              fontSize: 18,
              fontWeight: 600,
              color: "#8E8E93",
              marginTop: 6,
              marginRight: 4,
              letterSpacing: "-0.01em",
            }}
          >
            {status}
          </div>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Real message bubble — rounded rectangle + directional tail.
// ---------------------------------------------------------------------------

const MessageBubble: React.FC<{
  isOutgoing: boolean;
  bubbleFill: string;
  tailColor: string;
  text: string;
}> = ({ isOutgoing, bubbleFill, tailColor, text }) => {
  return (
    <div
      style={{
        position: "relative",
        maxWidth: 480,
      }}
    >
      <div
        style={{
          background: bubbleFill,
          borderRadius: 26,
          paddingLeft: 18,
          paddingRight: 18,
          paddingTop: 14,
          paddingBottom: 14,
          color: "#FFFFFF",
          fontSize: 30,
          fontWeight: 400,
          lineHeight: 1.3,
          letterSpacing: "-0.005em",
          wordBreak: "break-word",
          // A very subtle drop shadow gives the bubble tactility against
          // busy video backgrounds without looking like a card.
          boxShadow: "0 2px 8px rgba(0,0,0,0.18)",
          // Ensure text area is at least wide enough to show a blinking cursor
          // if needed during the typewriter reveal.
          minHeight: 30 * 1.3,
        }}
      >
        {text}
      </div>
      <Tail isOutgoing={isOutgoing} color={tailColor} />
    </div>
  );
};

// ---------------------------------------------------------------------------
// Typing indicator — small gray/blue bubble with 3 bouncing dots.
// The bounce uses a sine phase offset per-dot so the dots animate out of sync
// like the real iMessage indicator.
// ---------------------------------------------------------------------------

const TypingIndicatorBubble: React.FC<{
  isOutgoing: boolean;
  bubbleFill: string;
  tailColor: string;
  frame: number;
}> = ({ isOutgoing, bubbleFill, tailColor, frame }) => {
  // Three dots with offset phases so their up/down motion is out of sync.
  const dotPhase = (offset: number) =>
    Math.sin((frame + offset) * 0.35) * 4;

  return (
    <div
      style={{
        position: "relative",
      }}
    >
      <div
        style={{
          background: bubbleFill,
          borderRadius: 22,
          paddingLeft: 20,
          paddingRight: 20,
          paddingTop: 16,
          paddingBottom: 16,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
          boxShadow: "0 2px 8px rgba(0,0,0,0.18)",
        }}
      >
        {[0, 4, 8].map((offset) => (
          <div
            key={offset}
            style={{
              width: 10,
              height: 10,
              borderRadius: 5,
              backgroundColor: "rgba(255,255,255,0.7)",
              transform: `translateY(${dotPhase(offset)}px)`,
            }}
          />
        ))}
      </div>
      <Tail isOutgoing={isOutgoing} color={tailColor} />
    </div>
  );
};

// ---------------------------------------------------------------------------
// Tail — tiny SVG drop that hooks off the bottom of the bubble. Two variants:
// outgoing (bottom-right, points right) and incoming (bottom-left, points
// left). The viewBox/ transform is mirrored for incoming.
// ---------------------------------------------------------------------------

const Tail: React.FC<{ isOutgoing: boolean; color: string }> = ({
  isOutgoing,
  color,
}) => {
  // Path authored for outgoing (right side). Mirror via CSS for incoming.
  // The tail draws a small scoop that starts flush with the bubble's bottom
  // edge and curls outward, ending in a tiny round drop.
  const tailPath = "M0 0 C6 8 12 14 18 16 C12 18 6 20 0 22 Z";

  return (
    <svg
      width={18}
      height={22}
      viewBox="0 0 18 22"
      style={{
        position: "absolute",
        bottom: 0,
        [isOutgoing ? "right" : "left"]: -6,
        transform: isOutgoing ? "scaleX(1)" : "scaleX(-1)",
      }}
    >
      <path d={tailPath} fill={color} />
    </svg>
  );
};
