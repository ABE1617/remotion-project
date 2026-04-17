import React from "react";
import { AbsoluteFill, spring, useVideoConfig } from "remotion";
import { SPRING_SNAPPY } from "../../../utils/animations";
import { FONT_FAMILIES } from "../../../utils/fonts";
import { useMGPhase } from "../shared/useMGPhase";
import { HeartIcon } from "./icons";
import { Avatar, composeBubbleTransform, formatCount } from "./shared";
import type { TikTokCommentProps } from "./types";

// ---------------------------------------------------------------------------
// TikTokComment — TikTok's over-video comment row. No card; a strong text
// shadow keeps the white text legible on any background. Heart + like count
// sit to the right of the comment, stacked vertically.
// ---------------------------------------------------------------------------

const TEXT_SHADOW = "0 2px 8px rgba(0,0,0,0.7)";

export const TikTokComment: React.FC<TikTokCommentProps> = ({
  startMs,
  durationMs,
  enterFrames,
  exitFrames,
  position,
  width = 620,
  avatarSrc,
  initials,
  avatarColor = "#FE2C55",
  username,
  comment,
  likes,
}) => {
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
          {/* Muted username above the comment, TikTok-style */}
          <div
            style={{
              fontSize: 22,
              fontWeight: 500,
              color: "#A8A8A8",
              textShadow: TEXT_SHADOW,
              lineHeight: 1.2,
              letterSpacing: "-0.005em",
            }}
          >
            {username}
          </div>

          {/* White comment text */}
          <div
            style={{
              fontSize: 24,
              fontWeight: 400,
              color: "#FFFFFF",
              textShadow: TEXT_SHADOW,
              marginTop: 4,
              lineHeight: 1.3,
              wordBreak: "break-word",
            }}
          >
            {comment}
          </div>
        </div>

        {/* Right stack: heart over like count, vertically aligned */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginLeft: 16,
            flexShrink: 0,
            filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.55))",
          }}
        >
          <HeartIcon size={28} color="#FFFFFF" />
          <div
            style={{
              fontSize: 18,
              fontWeight: 500,
              color: "#A8A8A8",
              marginTop: 6,
              textShadow: TEXT_SHADOW,
              lineHeight: 1,
            }}
          >
            {formatCount(likes)}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
