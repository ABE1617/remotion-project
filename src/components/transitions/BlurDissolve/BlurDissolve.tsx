import React from "react";
import { AbsoluteFill, interpolate, Easing, OffthreadVideo } from "remotion";
import type { BlurDissolveProps } from "../types";

export const BLUR_DISSOLVE_PEAK_PROGRESS = 0.475;

/**
 * BlurDissolve — dreamy, introspective crossfade. Clip A blurs heavily
 * (ease-in: focus actively lost), hard cut hidden at peak blur, then Clip B
 * resolves from blur to clarity (ease-out: attention refocusing). The
 * asymmetric blur-in (47%) vs blur-out (53%) mimics human attention.
 */
export const BlurDissolve: React.FC<BlurDissolveProps> = ({
  clipA,
  clipB,
  progress,
  style,
  peakBlur = 50,
  scaleAmplitude = 0.04,
  desaturationDip = true,
}) => {
  const easeInCubic = Easing.bezier(0.32, 0, 0.67, 0);
  const easeOutCubic = Easing.bezier(0.33, 1, 0.68, 1);

  // Asymmetric blur: in covers 0–0.475 (ease-in), out covers 0.475–1 (ease-out).
  const clipABlurProgress = interpolate(progress, [0, BLUR_DISSOLVE_PEAK_PROGRESS], [0, 1], {
    easing: easeInCubic,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const clipABlur = clipABlurProgress * peakBlur;

  const clipBBlurProgress = interpolate(progress, [BLUR_DISSOLVE_PEAK_PROGRESS, 1], [1, 0], {
    easing: easeOutCubic,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const clipBBlur = clipBBlurProgress * peakBlur;

  // Matching depth-shift scale curves.
  const clipAScale = scaleAmplitude > 0
    ? interpolate(progress, [0, BLUR_DISSOLVE_PEAK_PROGRESS], [1, 1 + scaleAmplitude], {
        easing: easeInCubic,
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 1;

  const clipBScale = scaleAmplitude > 0
    ? interpolate(progress, [BLUR_DISSOLVE_PEAK_PROGRESS, 1], [1 - scaleAmplitude, 1], {
        easing: easeOutCubic,
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 1;

  // Saturation dip centered on the cut.
  const clipASaturate = desaturationDip
    ? interpolate(progress, [0.35, BLUR_DISSOLVE_PEAK_PROGRESS], [1, 0.85], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 1;

  const clipBSaturate = desaturationDip
    ? interpolate(progress, [BLUR_DISSOLVE_PEAK_PROGRESS, 0.6], [0.85, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 1;

  const showClipB = progress >= BLUR_DISSOLVE_PEAK_PROGRESS;

  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#000", ...style }}>
      {!showClipB && (
        <AbsoluteFill
          style={{
            transform: `scale(${clipAScale})`,
            filter: `blur(${clipABlur}px) saturate(${clipASaturate})`,
            willChange: "filter, transform",
          }}
        >
          <OffthreadVideo
            src={clipA}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </AbsoluteFill>
      )}
      {showClipB && (
        <AbsoluteFill
          style={{
            transform: `scale(${clipBScale})`,
            filter: `blur(${clipBBlur}px) saturate(${clipBSaturate})`,
            willChange: "filter, transform",
          }}
        >
          <OffthreadVideo
            src={clipB}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
