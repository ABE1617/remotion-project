import React from "react";
import { AbsoluteFill, spring, useVideoConfig } from "remotion";
import { SPRING_SNAPPY } from "../../../utils/animations";
import { FONT_FAMILIES } from "../../../utils/fonts";
import { resolveMGPosition } from "../shared/positioning";
import { useMGPhase } from "../shared/useMGPhase";
import { HeartIcon } from "./icons";
import { Avatar, composeBubbleTransform, formatCount } from "./shared";
import type { InstagramCommentProps } from "./types";

// ---------------------------------------------------------------------------
// InstagramComment — the float-over-feed comment line used inside IG Stories
// and Reels overlays. The comment has no card — just subtle darkening and
// a text-shadow to keep legible over busy video behind it.
// ---------------------------------------------------------------------------

const TEXT_SHADOW = "0 2px 8px rgba(0,0,0,0.4)";

export const InstagramComment: React.FC<InstagramCommentProps> = ({
  startMs,
  durationMs,
  enterFrames,
  exitFrames,
  anchor,
  offsetX,
  offsetY,
  scale,
  width = 620,
  avatarSrc,
  initials,
  avatarColor = "#E1306C",
  username,
  comment,
  timestamp,
  likes,
}) => {
  const { containerStyle, wrapperStyle } = resolveMGPosition(
    { anchor, offsetX, offsetY, scale },
    { anchor: "top", offsetY: 820 },
  );
  const { fps } = useVideoConfig();
  const { visible, localFrame, exitProgress } = useMGPhase(
    { startMs, durationMs, enterFrames, exitFrames },
    { defaultEnterFrames: 12, defaultExitFrames: 8 },
  );

  if (!visible) return null;

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

  return (
    <AbsoluteFill style={containerStyle}>
      <div style={wrapperStyle}>
      <div
        style={{
          width,
          transform,
          opacity,
          transformOrigin: "center center",
          // Subtle left-to-right gradient ramp adds just enough contrast for
          // white text without looking like an opaque "card".
          background:
            "linear-gradient(to right, rgba(0,0,0,0.6), rgba(0,0,0,0.3))",
          borderRadius: 12,
          padding: 18,
          fontFamily: FONT_FAMILIES.inter,
          display: "flex",
          flexDirection: "row",
          alignItems: "flex-start",
          WebkitFontSmoothing: "antialiased",
        }}
      >
        <Avatar
          size={44}
          src={avatarSrc}
          initials={initials}
          fallbackColor={avatarColor}
          fontFamily={FONT_FAMILIES.inter}
          fallbackText={username}
        />

        <div
          style={{
            marginLeft: 12,
            flex: 1,
            display: "flex",
            flexDirection: "column",
            minWidth: 0,
          }}
        >
          {/* Username bolded inline with comment text — IG's signature layout */}
          <div
            style={{
              fontSize: 22,
              lineHeight: 1.3,
              color: "#FFFFFF",
              textShadow: TEXT_SHADOW,
              wordBreak: "break-word",
            }}
          >
            <span
              style={{
                fontWeight: 600,
                marginRight: 6,
              }}
            >
              {username}
            </span>
            <span style={{ fontWeight: 400 }}>{comment}</span>
          </div>

          {/* Reply · timestamp meta row */}
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 12,
              marginTop: 8,
              fontSize: 20,
              color: "#A8A8A8",
              textShadow: TEXT_SHADOW,
            }}
          >
            <span style={{ fontWeight: 600 }}>Reply</span>
            <span style={{ opacity: 0.7 }}>·</span>
            <span style={{ fontWeight: 400 }}>{timestamp}</span>
            {likes && likes > 0 ? (
              <>
                <span style={{ opacity: 0.7 }}>·</span>
                <span style={{ fontWeight: 400 }}>
                  {formatCount(likes)} likes
                </span>
              </>
            ) : null}
          </div>
        </div>

        {/* Right-aligned heart icon, vertically centered against the avatar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginLeft: 12,
            marginTop: 10, // aligns with username row baseline
            flexShrink: 0,
            filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.35))",
          }}
        >
          <HeartIcon size={22} color="#FFFFFF" />
        </div>
      </div>
      </div>
    </AbsoluteFill>
  );
};
