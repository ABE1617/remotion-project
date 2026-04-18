import React, { CSSProperties } from "react";
import {
  AbsoluteFill,
  interpolate,
  Easing,
  OffthreadVideo,
  Img,
} from "remotion";
import type { CrossfadeZoomProps } from "../types";

// Render either a video or an image based on the file extension so the
// same transition can cross-fade into a still photo.
const isImage = (src: string) => /\.(jpe?g|png|gif|webp|avif|bmp)$/i.test(src);
const MediaLayer: React.FC<{ src: string; style: CSSProperties }> = ({
  src,
  style,
}) =>
  isImage(src) ? <Img src={src} style={style} /> : <OffthreadVideo src={src} style={style} />;

/** Crossfade Zoom — Clip A zooms in slightly + fades, Clip B fades in + zooms out slightly. Premium cross-dissolve with motion. Accepts image or video for either side. */
export const CrossfadeZoom: React.FC<CrossfadeZoomProps> = ({
  clipA, clipB, progress, style,
}) => {
  const ease = Easing.bezier(0.25, 0.46, 0.45, 0.94);

  const scaleA = interpolate(progress, [0, 1], [1, 1.12], { easing: ease, extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const opacityA = interpolate(progress, [0.1, 0.7], [1, 0], { easing: ease, extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const scaleB = interpolate(progress, [0, 1], [1.12, 1], { easing: ease, extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const opacityB = interpolate(progress, [0.3, 0.9], [0, 1], { easing: ease, extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const mediaStyle: CSSProperties = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  };

  return (
    <AbsoluteFill style={{ overflow: "hidden", ...style }}>
      <AbsoluteFill style={{ transform: `scale(${scaleB})`, opacity: opacityB }}>
        <MediaLayer src={clipB} style={mediaStyle} />
      </AbsoluteFill>
      {opacityA > 0.01 && (
        <AbsoluteFill style={{ transform: `scale(${scaleA})`, opacity: opacityA }}>
          <MediaLayer src={clipA} style={mediaStyle} />
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
