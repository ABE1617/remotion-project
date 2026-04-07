import React, { useMemo } from "react";
import {
  AbsoluteFill,
  Sequence,
  spring,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { SpringConfig } from "remotion";
import type { CaptionToken } from "../shared/types";
import type { BounceKineticProps } from "./types";
import { FONT_FAMILIES } from "../../../utils/fonts";
import { msToFrames } from "../../../utils/timing";

const BOUNCE_SPRING: SpringConfig = {
  mass: 0.4,
  damping: 7.5,
  stiffness: 240,
  overshootClamping: false,
};

function buildStrokeShadow(sw: number, color: string): string {
  return [
    `${-sw}px ${-sw}px 0 ${color}`,
    `${sw}px ${-sw}px 0 ${color}`,
    `${-sw}px ${sw}px 0 ${color}`,
    `${sw}px ${sw}px 0 ${color}`,
    `0 ${-sw}px 0 ${color}`,
    `0 ${sw}px 0 ${color}`,
    `${-sw}px 0 0 ${color}`,
    `${sw}px 0 0 ${color}`,
    "0 6px 12px rgba(0,0,0,0.6)",
  ].join(", ");
}

/** Renders a single bouncing word (inside its own Sequence) */
const BounceWord: React.FC<{
  token: CaptionToken;
  color: string;
  fontSize: number;
  fontFamily: string;
  letterSpacing: number;
  textShadow: string;
  springConfig: SpringConfig;
  enableRotation: boolean;
  rotationRange: number;
  durationFrames: number;
}> = ({
  token,
  color,
  fontSize,
  fontFamily,
  letterSpacing,
  textShadow,
  springConfig,
  enableRotation,
  rotationRange,
  durationFrames,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const springVal = spring({
    fps,
    frame,
    config: springConfig,
  });

  const scale = springVal;

  const rotation = enableRotation
    ? interpolate(springVal, [0, 1], [rotationRange, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 0;

  // Smooth exit — fade out over last 3 frames instead of hard cut
  const exitOpacity = interpolate(
    frame,
    [durationFrames - 3, durationFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 40px",
      }}
    >
      <div
        style={{
          fontFamily,
          fontWeight: 800,
          fontSize,
          color,
          textTransform: "uppercase",
          letterSpacing: `${letterSpacing}em`,
          textShadow,
          transform: `scale(${scale}) rotate(${rotation}deg)`,
          transformOrigin: "center center",
          textAlign: "center",
          lineHeight: 1.1,
          maxWidth: "85%",
          wordBreak: "break-word",
          opacity: exitOpacity,
        }}
      >
        {token.text}
      </div>
    </AbsoluteFill>
  );
};

export const BounceKinetic: React.FC<BounceKineticProps> = ({
  pages,
  colors = ["#FFFFFF", "#FFD700", "#FF4444"],
  fontSize = 90,
  fontFamily = FONT_FAMILIES.poppins,
  strokeColor = "#000000",
  strokeWidth = 4,
  springConfig = BOUNCE_SPRING,
  enableRotation = true,
  rotationRange = 3,
  letterSpacing = 0.02,
}) => {
  const { fps } = useVideoConfig();

  const allTokens = useMemo(() => {
    const tokens: CaptionToken[] = [];
    for (const page of pages) {
      for (const token of page.tokens) {
        tokens.push(token);
      }
    }
    return tokens;
  }, [pages]);

  const textShadow = useMemo(
    () => buildStrokeShadow(strokeWidth, strokeColor),
    [strokeWidth, strokeColor],
  );

  return (
    <AbsoluteFill>
      {allTokens.map((token, idx) => {
        const startFrame = msToFrames(token.start, fps);
        const durationFrames = msToFrames(token.end - token.start, fps);
        if (durationFrames <= 0) return null;

        return (
          <Sequence
            key={idx}
            from={startFrame}
            durationInFrames={durationFrames}
            name={token.text.toUpperCase()}
          >
            <BounceWord
              token={token}
              color={colors[idx % colors.length]}
              fontSize={fontSize}
              fontFamily={fontFamily}
              letterSpacing={letterSpacing}
              textShadow={textShadow}
              springConfig={springConfig}
              enableRotation={enableRotation}
              rotationRange={rotationRange}
              durationFrames={durationFrames}
            />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
