import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
  OffthreadVideo,
} from "remotion";
import { msToFrames } from "../../../utils/timing";
import type { SplitFrameProps } from "../types";

/**
 * Split Frame — video splits into 2 or 3 vertical panels, each showing
 * a different zoom level of the same video. Creates a multi-cam / editorial
 * feel from a single source. Panels slide in, hold, then slide back out.
 */

interface PanelConfig {
  scale: number;
  originX: number;
  originY: number;
}

const TWO_PANELS: PanelConfig[] = [
  { scale: 1.0, originX: 0.5, originY: 0.5 },
  { scale: 1.5, originX: 0.5, originY: 0.38 },
];

const THREE_PANELS: PanelConfig[] = [
  { scale: 1.4, originX: 0.5, originY: 0.35 },
  { scale: 1.0, originX: 0.5, originY: 0.5 },
  { scale: 1.7, originX: 0.48, originY: 0.38 },
];

export const SplitFrame: React.FC<SplitFrameProps> = ({
  src,
  events,
  style,
  panels = 2,
  gap = 6,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames, width, height } = useVideoConfig();

  const panelConfigs = panels === 3 ? THREE_PANELS : TWO_PANELS;

  // Calculate split progress
  let splitProgress = 0;

  if (events.length === 0) {
    const rampIn = Math.round(durationInFrames * 0.25);
    const holdEnd = Math.round(durationInFrames * 0.7);

    if (frame < rampIn) {
      splitProgress = interpolate(frame, [0, rampIn], [0, 1], {
        easing: Easing.out(Easing.cubic),
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
    } else if (frame < holdEnd) {
      splitProgress = 1;
    } else {
      splitProgress = interpolate(frame, [holdEnd, durationInFrames], [1, 0], {
        easing: Easing.in(Easing.cubic),
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
    }
  } else {
    for (const event of events) {
      const eventStart = msToFrames(event.startMs, fps);
      const eventEnd = msToFrames(event.startMs + event.durationMs, fps);
      if (frame < eventStart || frame > eventEnd) continue;

      const eventDuration = eventEnd - eventStart;
      const rampIn = eventStart + Math.round(eventDuration * 0.2);
      const holdEnd = eventStart + Math.round(eventDuration * 0.7);

      if (frame < rampIn) {
        splitProgress = interpolate(frame, [eventStart, rampIn], [0, 1], {
          easing: Easing.out(Easing.cubic),
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
      } else if (frame < holdEnd) {
        splitProgress = 1;
      } else {
        splitProgress = interpolate(frame, [holdEnd, eventEnd], [1, 0], {
          easing: Easing.in(Easing.cubic),
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
      }
    }
  }

  // When not split, show normal video
  if (splitProgress < 0.01) {
    return (
      <AbsoluteFill style={{ overflow: "hidden", ...style }}>
        <OffthreadVideo
          src={src}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </AbsoluteFill>
    );
  }

  const panelCount = panelConfigs.length;
  const totalGap = gap * (panelCount - 1) * splitProgress;
  const panelWidth = (width - totalGap) / panelCount;

  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#000", ...style }}>
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          gap: gap * splitProgress,
        }}
      >
        {panelConfigs.map((panel, i) => {
          // Each panel slides in from its direction
          const slideOffset =
            i === 0
              ? -width * 0.3 * (1 - splitProgress)
              : i === panelCount - 1
                ? width * 0.3 * (1 - splitProgress)
                : 0;

          return (
            <div
              key={i}
              style={{
                flex: 1,
                overflow: "hidden",
                position: "relative",
                transform: `translateX(${slideOffset}px)`,
              }}
            >
              <OffthreadVideo
                src={src}
                style={{
                  width: `${width}px`,
                  height: `${height}px`,
                  objectFit: "cover",
                  position: "absolute",
                  top: 0,
                  left: -(panelWidth * i + gap * i * splitProgress),
                  transform: `scale(${1 + (panel.scale - 1) * splitProgress})`,
                  transformOrigin: `${panel.originX * 100}% ${panel.originY * 100}%`,
                }}
              />
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
