import React from "react";
import { AbsoluteFill, interpolate, OffthreadVideo } from "remotion";
import type { PixelateProps } from "../types";

export const PIXELATE_PEAK_PROGRESS = 0.5;

/**
 * Pixelate — clip dissolves into large pixel blocks at the cut, then
 * resolves back on the incoming side. Uses the down-scale → up-scale
 * trick with `image-rendering: pixelated` for real pixelation rather
 * than a Gaussian-blur fake.
 *
 * At progress 0.5 the inner video is rendered at roughly
 * `(frame-size / peakBlockSize)` pixels then scaled back up, which
 * produces pure rectangular blocks.
 */
export const Pixelate: React.FC<PixelateProps> = ({
  clipA,
  clipB,
  progress,
  style,
  peakBlockSize = 60,
}) => {
  const showB = progress >= PIXELATE_PEAK_PROGRESS;
  const activeClip = showB ? clipB : clipA;

  // Block size peaks at progress 0.5 — smooth triangular ramp.
  const blockSize = interpolate(
    progress,
    [0, 0.5, 1],
    [1, peakBlockSize, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // Inner container is rendered at 1/blockSize resolution, then scaled
  // back to 100% with pixelated rendering.
  const innerWidth = `${(100 / blockSize).toFixed(4)}%`;
  const innerHeight = innerWidth;
  const scaleFactor = blockSize;

  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#000", ...style }}>
      <AbsoluteFill style={{ overflow: "hidden" }}>
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: innerWidth,
            height: innerHeight,
            transform: `scale(${scaleFactor})`,
            transformOrigin: "top left",
            imageRendering: "pixelated",
            willChange: "transform",
          }}
        >
          <OffthreadVideo
            src={activeClip}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              imageRendering: "pixelated",
            }}
          />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
