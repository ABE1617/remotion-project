import React from "react";
import { AbsoluteFill, spring, useVideoConfig } from "remotion";
import { SPRING_SNAPPY } from "../../../utils/animations";
import { FONT_FAMILIES } from "../../../utils/fonts";
import { resolveMGPosition } from "../shared/positioning";
import { useMGPhase } from "../shared/useMGPhase";
import {
  HeartIcon,
  ReplyIcon,
  RepostIcon,
  VerifiedIcon,
  ViewsIcon,
} from "./icons";
import { Avatar, composeBubbleTransform, formatCount } from "./shared";
import type { TweetBubbleProps } from "./types";

// ---------------------------------------------------------------------------
// TweetBubble — mocks a Twitter/X post card with avatar, handle row, body
// text, and the four-icon interaction row. Palette swaps between the light
// and dark themes depending on `darkMode`.
// ---------------------------------------------------------------------------

// Palette table: the minimum set of colors Twitter actually uses for a post
// card. Kept in a tight object so the rest of the component reads linearly.
const THEME = {
  light: {
    bg: "#FFFFFF",
    text: "#0F1419",
    muted: "#536471",
    shadow: "0 4px 16px rgba(0,0,0,0.12)",
  },
  dark: {
    bg: "#16181C",
    text: "#E7E9EA",
    muted: "#71767B",
    shadow: "0 4px 16px rgba(0,0,0,0.45)",
  },
} as const;

export const TweetBubble: React.FC<TweetBubbleProps> = ({
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
  avatarColor = "#C8551F",
  name,
  handle,
  timestamp,
  verified,
  text,
  stats,
  darkMode = false,
}) => {
  // Default anchor: centered horizontally, 720px from top (legacy position).
  const { containerStyle, wrapperStyle } = resolveMGPosition(
    { anchor, offsetX, offsetY, scale },
    { anchor: "top", offsetY: 720 },
  );
  const { fps } = useVideoConfig();
  const { visible, localFrame, exitProgress } = useMGPhase(
    { startMs, durationMs, enterFrames, exitFrames },
    { defaultEnterFrames: 12, defaultExitFrames: 8 },
  );

  if (!visible) return null;

  // Snappy spring drives a normalized 0→1 enter progress used to interpolate
  // the card's scale, translateY, and opacity in one shot.
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

  const theme = darkMode ? THEME.dark : THEME.light;

  // Handle string can be passed raw ("@naval") or with timestamp suffix.
  // If caller provided a separate `timestamp`, compose the Twitter-style
  // "@handle · 2h" for them — otherwise render `handle` as-is.
  const handleLine = timestamp ? `${handle} · ${timestamp}` : handle;

  return (
    <AbsoluteFill style={containerStyle}>
      <div style={wrapperStyle}>
      <div
        style={{
          width,
          transform,
          opacity,
          transformOrigin: "center center",
          backgroundColor: theme.bg,
          borderRadius: 16,
          padding: 20,
          boxShadow: theme.shadow,
          fontFamily: FONT_FAMILIES.inter,
          // Sub-pixel font smoothing trick — on Chrome this reads slightly
          // closer to the SF-Pro rendering Twitter uses in its real app.
          WebkitFontSmoothing: "antialiased",
        }}
      >
        {/* --- Header row: avatar + name/handle ---------------------------- */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "flex-start",
          }}
        >
          <Avatar
            size={48}
            src={avatarSrc}
            initials={initials}
            fallbackColor={avatarColor}
            fontFamily={FONT_FAMILIES.inter}
            fallbackText={name}
          />

          <div
            style={{
              marginLeft: 12,
              display: "flex",
              flexDirection: "column",
              minWidth: 0,
              flex: 1,
            }}
          >
            {/* Name + verified badge inline */}
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 4,
              }}
            >
              <span
                style={{
                  fontSize: 26,
                  fontWeight: 700,
                  color: theme.text,
                  letterSpacing: "-0.01em",
                  lineHeight: 1.15,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {name}
              </span>
              {verified ? (
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    flexShrink: 0,
                  }}
                >
                  <VerifiedIcon size={22} />
                </span>
              ) : null}
            </div>

            {/* Handle + timestamp */}
            <div
              style={{
                fontSize: 22,
                fontWeight: 400,
                color: theme.muted,
                lineHeight: 1.2,
                marginTop: 2,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {handleLine}
            </div>
          </div>
        </div>

        {/* --- Tweet body text --------------------------------------------- */}
        <div
          style={{
            fontSize: 28,
            fontWeight: 400,
            color: theme.text,
            lineHeight: 1.35,
            marginTop: 12,
            letterSpacing: "-0.005em",
            // Allow wrapping; Twitter uses word-break: break-word by default
            wordBreak: "break-word",
          }}
        >
          {text}
        </div>

        {/* --- Interaction row --------------------------------------------- */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 20,
            // Twitter's interaction row is slightly narrower than the card;
            // a touch of right padding keeps the views count off the edge.
            paddingRight: 16,
          }}
        >
          <InteractionItem
            icon={<ReplyIcon size={22} color={theme.muted} />}
            label={formatCount(stats.replies)}
            color={theme.muted}
          />
          <InteractionItem
            icon={<RepostIcon size={22} color={theme.muted} />}
            label={formatCount(stats.reposts)}
            color={theme.muted}
          />
          <InteractionItem
            icon={<HeartIcon size={22} color={theme.muted} />}
            label={formatCount(stats.likes)}
            color={theme.muted}
          />
          <InteractionItem
            icon={<ViewsIcon size={22} color={theme.muted} />}
            label={formatCount(stats.views)}
            color={theme.muted}
          />
        </div>
      </div>
      </div>
    </AbsoluteFill>
  );
};

// Single icon + count cluster used four times in the interaction row.
const InteractionItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  color: string;
}> = ({ icon, label, color }) => (
  <div
    style={{
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    }}
  >
    {icon}
    <span
      style={{
        fontSize: 18,
        fontWeight: 400,
        color,
        lineHeight: 1,
      }}
    >
      {label}
    </span>
  </div>
);
