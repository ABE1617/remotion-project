import React from "react";
import { AbsoluteFill, interpolate, spring, useVideoConfig } from "remotion";
import { FONT_FAMILIES } from "../../../utils/fonts";
import { useMGPhase } from "../shared/useMGPhase";
import { APP_ICONS } from "./icons";
import type { NotificationProps } from "./types";

// ---------------------------------------------------------------------------
// Notification — mock iOS / Android push notification motion graphic.
// ---------------------------------------------------------------------------
//
// Choreography (30fps):
//   Entrance (14f): drops down from above with a small overshoot-and-settle
//     spring. Opacity fades 0→1 over the first 10 frames. Spring config is
//     tuned to mimic a real iOS/Android notification drop.
//   Hold: completely static — no parallax. Real notifications don't move.
//   Exit (10f): cubic ease-in slide back up to translateY(-100%). The last
//     4 frames also fade opacity so it disappears cleanly as it leaves.
//
// Platform differences are declared in the `STYLES` table below and applied
// to corner radius, padding, font stack, blur strength, background tint, and
// drop shadow. The blur is intentional — it's the single visual cue that
// separates a "real" notification from a generic floating card. Both
// `backdropFilter` and `WebkitBackdropFilter` are set for browser coverage.

// Spring config specifically tuned for notification drop-in. Low damping +
// unclamped overshoot = visible (but subtle) bounce, like a real notification.
const NOTIFICATION_SPRING = {
  mass: 0.6,
  damping: 14,
  stiffness: 220,
  overshootClamping: false,
};

interface PlatformStyle {
  topOffset: number;
  sideInset: number;
  paddingY: number;
  paddingX: number;
  radius: number;
  background: string;
  blur: string;
  border: string | "none";
  shadow: string | "none";
  iconSize: number;
  iconRadius: number;
  fontFamily: string;
  appNameOpacity: number;
}

// All visual constants live here — platform switches just swap this object.
const STYLES: Record<"ios" | "android", PlatformStyle> = {
  ios: {
    topOffset: 24,
    sideInset: 28,
    paddingY: 18,
    paddingX: 22,
    radius: 22,
    background: "rgba(28, 28, 30, 0.72)",
    blur: "blur(40px) saturate(160%)",
    border: "1px solid rgba(255,255,255,0.08)",
    shadow: "none",
    iconSize: 56,
    iconRadius: 14,
    fontFamily: FONT_FAMILIES.inter,
    appNameOpacity: 0.92,
  },
  android: {
    topOffset: 32,
    sideInset: 24,
    paddingY: 22,
    paddingX: 24,
    radius: 28,
    background: "rgba(35, 35, 38, 0.85)",
    blur: "blur(28px)",
    border: "none",
    shadow: "0 8px 24px rgba(0,0,0,0.4)",
    iconSize: 60,
    iconRadius: 16,
    fontFamily: FONT_FAMILIES.roboto,
    appNameOpacity: 0.88,
  },
};

export const Notification: React.FC<NotificationProps> = ({
  startMs,
  durationMs,
  enterFrames,
  exitFrames,
  platform = "ios",
  app,
  appName,
  timestamp = "now",
  title,
  body,
}) => {
  const { fps } = useVideoConfig();
  const { visible, localFrame, exitProgress, phase } = useMGPhase(
    { startMs, durationMs, enterFrames, exitFrames },
    { defaultEnterFrames: 14, defaultExitFrames: 10 },
  );

  if (!visible) return null;

  const style = STYLES[platform];
  const Icon = APP_ICONS[app];

  // --- Entrance animation ------------------------------------------------
  // Spring drives translateY from -100% → 0 with a subtle overshoot.
  // `spring()` returns ~1 at rest, so we map it directly into a 0→1
  // normalized value and then into the translate range.
  const dropSpring = spring({
    fps,
    frame: localFrame,
    config: NOTIFICATION_SPRING,
    durationInFrames: 14,
  });
  const enterTranslatePct = interpolate(dropSpring, [0, 1], [-100, 0]);

  const enterOpacity = interpolate(localFrame, [0, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // --- Exit animation ----------------------------------------------------
  // Cubic ease-in slide back up to -100%. The cubic curve accelerates as
  // it leaves the screen, matching how notifications get yanked up quickly.
  const exitEased = Math.pow(exitProgress, 3);
  const exitTranslatePct = exitEased * -100;

  // Fade only in the last 4 frames of exit (exitProgress in [0.6, 1.0]).
  const exitFade = interpolate(exitProgress, [0.6, 1], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // --- Compose final transform + opacity ---------------------------------
  // During entrance: translate driven by spring. During exit: driven by
  // cubic ease. These phases never overlap so they can just be summed.
  const translateYPct =
    phase === "exiting" || phase === "after"
      ? exitTranslatePct
      : enterTranslatePct;

  const opacity =
    phase === "exiting" || phase === "after"
      ? exitFade
      : enterOpacity;

  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          top: style.topOffset,
          left: style.sideInset,
          right: style.sideInset,
          transform: `translateY(${translateYPct}%)`,
          opacity,
          borderRadius: style.radius,
          background: style.background,
          backdropFilter: style.blur,
          WebkitBackdropFilter: style.blur,
          border: style.border === "none" ? undefined : style.border,
          boxShadow: style.shadow === "none" ? undefined : style.shadow,
          paddingTop: style.paddingY,
          paddingBottom: style.paddingY,
          paddingLeft: style.paddingX,
          paddingRight: style.paddingX,
          display: "flex",
          flexDirection: "row",
          alignItems: "flex-start",
          fontFamily: style.fontFamily,
        }}
      >
        {/* App icon — fixed square on the far left */}
        <div
          style={{
            width: style.iconSize,
            height: style.iconSize,
            borderRadius: style.iconRadius,
            overflow: "hidden",
            flexShrink: 0,
          }}
        >
          <Icon size={style.iconSize} />
        </div>

        {/* Content column — flex 1, everything right of the icon */}
        <div
          style={{
            flex: 1,
            marginLeft: 16,
            display: "flex",
            flexDirection: "column",
            minWidth: 0,
          }}
        >
          {/* Top row: app name (left) + timestamp (right) */}
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div
              style={{
                fontSize: 26,
                fontWeight: 600,
                color: `rgba(255,255,255,${style.appNameOpacity})`,
                letterSpacing: "-0.01em",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {appName}
            </div>
            <div
              style={{
                fontSize: 24,
                fontWeight: 500,
                color: "rgba(255,255,255,0.56)",
                marginLeft: 12,
                flexShrink: 0,
              }}
            >
              {timestamp}
            </div>
          </div>

          {/* Title — focal point of the notification */}
          <div
            style={{
              fontSize: 32,
              fontWeight: 700,
              color: "#FFFFFF",
              marginTop: 6,
              lineHeight: 1.2,
              letterSpacing: "-0.01em",
            }}
          >
            {title}
          </div>

          {/* Body — truncates at 2 lines so long strings never break layout */}
          <div
            style={{
              fontSize: 28,
              fontWeight: 400,
              color: "rgba(255,255,255,0.78)",
              marginTop: 4,
              lineHeight: 1.3,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {body}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
