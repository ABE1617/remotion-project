import React from "react";
import { Sequence } from "remotion";
import { LightLeak } from "@remotion/light-leaks";

export interface LensBurnHit {
  /** Frame where the burn starts. */
  startFrame: number;
  /** Duration in frames. Default: 30 */
  durationFrames?: number;
}

export interface LensBurnProps {
  /** Array of timed hits — each one triggers a light leak burst. */
  hits: LensBurnHit[];
  /** Opacity of the light leak overlay. Default: 0.15 */
  opacity?: number;
  /** Hue shift in degrees (toward amber/warm). Default: 40 */
  hueShift?: number;
}

/**
 * Standalone light-leak / lens-burn effect.
 * Drop this into any composition and pass timed hits
 * to trigger warm cinematic flares over the video.
 */
export const LensBurn: React.FC<LensBurnProps> = ({
  hits,
  opacity = 0.15,
  hueShift = 40,
}) => {
  return (
    <>
      {hits.map((hit, idx) => (
        <Sequence
          key={idx}
          from={hit.startFrame}
          durationInFrames={hit.durationFrames ?? 30}
        >
          <LightLeak
            seed={idx}
            hueShift={hueShift}
            style={{ opacity }}
          />
        </Sequence>
      ))}
    </>
  );
};
