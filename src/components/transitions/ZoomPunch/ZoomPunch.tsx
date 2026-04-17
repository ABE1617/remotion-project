import React from "react";
import { AbsoluteFill, interpolate, Easing, OffthreadVideo } from "remotion";
import type { ZoomPunchProps } from "../types";

export const ZOOM_PUNCH_PEAK_PROGRESS = 0.5;

/**
 * ZoomPunch — Quick ease-IN zoom on the outgoing clip immediately before the cut,
 * then a settled ease-OUT on the incoming clip. The acceleration curve on the
 * outgoing zoom is the premium signal: it should feel like the outgoing clip is
 * "leaning into the cut" rather than drifting.
 */
export const ZoomPunch: React.FC<ZoomPunchProps> = ({
  clipA,
  clipB,
  progress,
  style,
  direction = "in",
  focalPoint = { x: 0.5, y: 0.5 },
  chromaticAberration = true,
}) => {
  const easeIn = Easing.bezier(0.5, 0, 0.75, 0);
  const easeOut = Easing.bezier(0.25, 1, 0.5, 1);

  const isFirstHalf = progress < ZOOM_PUNCH_PEAK_PROGRESS;

  // Outgoing clip scale (ease-IN acceleration into the cut)
  const scaleA =
    direction === "in"
      ? interpolate(progress, [0, 0.5], [1.0, 1.1], {
          easing: easeIn,
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : 1.0;

  // Incoming clip scale
  const scaleB =
    direction === "in"
      ? interpolate(progress, [0.5, 0.85, 1], [1.05, 1.0, 1.0], {
          easing: easeOut,
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : interpolate(progress, [0.5, 1], [1.1, 1.0], {
          easing: easeOut,
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

  const origin = `${focalPoint.x * 100}% ${focalPoint.y * 100}%`;

  // Chromatic aberration active window ~3 frames around the cut (progress 0.48–0.52)
  const caStrength = interpolate(
    progress,
    [0.46, 0.5, 0.54],
    [0, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const caActive = chromaticAberration && caStrength > 0.01;

  const activeClip = isFirstHalf ? clipA : clipB;
  const activeScale = isFirstHalf ? scaleA : scaleB;

  // Subtle opacity pulse at the cut as an accent punch
  const pulse = interpolate(
    progress,
    [0.46, 0.5, 0.54],
    [1, 0.92, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const offset = 3 * caStrength;

  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#000", ...style }}>
      <AbsoluteFill
        style={{
          transform: `scale(${activeScale})`,
          transformOrigin: origin,
          opacity: pulse,
        }}
      >
        {caActive ? (
          <>
            {/* Red channel, shifted left */}
            <AbsoluteFill
              style={{
                transform: `translateX(${-offset}px)`,
                mixBlendMode: "screen",
                filter: "saturate(2) hue-rotate(0deg)",
              }}
            >
              <OffthreadVideo
                src={activeClip}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  filter:
                    "url(#zoompunch-red-filter)",
                }}
              />
              <svg width="0" height="0" style={{ position: "absolute" }}>
                <defs>
                  <filter id="zoompunch-red-filter">
                    <feColorMatrix
                      type="matrix"
                      values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"
                    />
                  </filter>
                </defs>
              </svg>
            </AbsoluteFill>
            {/* Green channel, center */}
            <AbsoluteFill style={{ mixBlendMode: "screen" }}>
              <OffthreadVideo
                src={activeClip}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  filter: "url(#zoompunch-green-filter)",
                }}
              />
              <svg width="0" height="0" style={{ position: "absolute" }}>
                <defs>
                  <filter id="zoompunch-green-filter">
                    <feColorMatrix
                      type="matrix"
                      values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0"
                    />
                  </filter>
                </defs>
              </svg>
            </AbsoluteFill>
            {/* Blue channel, shifted right */}
            <AbsoluteFill
              style={{
                transform: `translateX(${offset}px)`,
                mixBlendMode: "screen",
              }}
            >
              <OffthreadVideo
                src={activeClip}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  filter: "url(#zoompunch-blue-filter)",
                }}
              />
              <svg width="0" height="0" style={{ position: "absolute" }}>
                <defs>
                  <filter id="zoompunch-blue-filter">
                    <feColorMatrix
                      type="matrix"
                      values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0"
                    />
                  </filter>
                </defs>
              </svg>
            </AbsoluteFill>
          </>
        ) : (
          <OffthreadVideo
            src={activeClip}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
