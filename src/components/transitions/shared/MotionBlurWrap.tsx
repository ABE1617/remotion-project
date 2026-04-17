import React from "react";
import { interpolate } from "remotion";

// ---------------------------------------------------------------------------
// MotionBlurWrap — multi-sample motion blur for transition elements.
// ---------------------------------------------------------------------------
//
// Renders N copies of `children` offset along a motion vector with an opacity
// falloff, producing convincing streaks behind a moving element. This is
// what separates a cheap translate-with-blur from a Pixflow-quality whip.
//
// Difference from SVG feGaussianBlur:
//   - feGaussianBlur softens the edges uniformly. Looks "hazy," not "streaky."
//   - MotionBlurWrap renders actual displaced copies — each trailing sample
//     is a real instance of the content, offset and faded. Streaks preserve
//     detail at the current frame while smearing behind it.
//
// Cost: O(samples × children-complexity). Keep samples in the 6-10 range for
// transitions (they're short). Above 12 the quality gain is marginal and the
// render cost grows.
//
// Usage:
//   <MotionBlurWrap samples={8} offsetX={-60} offsetY={0}>
//     <OffthreadVideo src={clipA} />
//   </MotionBlurWrap>
//
// offsetX / offsetY is the MOTION VECTOR (where the element is heading). The
// trail extends in the OPPOSITE direction, behind the current position.

export interface MotionBlurWrapProps {
  // Number of sample copies. More = smoother streak, more render cost.
  // Default 8.
  samples?: number;
  // Motion vector in pixels. If both are 0, the wrap is a no-op and just
  // renders `children` once.
  offsetX?: number;
  offsetY?: number;
  // Opacity of the furthest trailing sample. Default 0.12.
  trailOpacity?: number;
  // Style applied to the outer wrapper.
  style?: React.CSSProperties;
  children: React.ReactNode;
}

export const MotionBlurWrap: React.FC<MotionBlurWrapProps> = ({
  samples = 8,
  offsetX = 0,
  offsetY = 0,
  trailOpacity = 0.12,
  style,
  children,
}) => {
  // No motion or no samples — render children directly, skip the cost.
  if ((offsetX === 0 && offsetY === 0) || samples < 2) {
    return <>{children}</>;
  }

  // Render in reverse so the CURRENT position (i=0) paints last (on top).
  const copies: React.ReactNode[] = [];
  for (let i = samples - 1; i >= 0; i--) {
    const t = i / (samples - 1); // 0 = at target, 1 = at trail end
    // Samples sit BEHIND the current position, opposite to the motion vector.
    const dx = -offsetX * t;
    const dy = -offsetY * t;
    const opacity = interpolate(t, [0, 1], [1, trailOpacity]);
    copies.push(
      <div
        key={i}
        style={{
          position: "absolute",
          inset: 0,
          transform: `translate(${dx}px, ${dy}px)`,
          opacity,
          pointerEvents: "none",
          willChange: "transform, opacity",
        }}
      >
        {children}
      </div>,
    );
  }

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        ...style,
      }}
    >
      {copies}
    </div>
  );
};
