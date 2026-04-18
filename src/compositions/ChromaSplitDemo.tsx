import React from "react";
import { AbsoluteFill } from "remotion";
import { ChromaSplit } from "../components/color-effects";
import {
  ColorDemoStageVideo,
  ColorDemoLabel,
} from "./shared/ColorDemoStage";

// Pulsed chroma split: subtle drift baseline + stronger hits on beats.
export const ChromaSplitDemo: React.FC = () => {
  return (
    <AbsoluteFill>
      <ChromaSplit
        offset={16}
        drift
        intensity={1}
        timing={{
          mode: "pulsed",
          pulses: [
            { peakFrame: 40, attackFrames: 3, holdFrames: 4, releaseFrames: 12 },
            { peakFrame: 120, attackFrames: 3, holdFrames: 4, releaseFrames: 12 },
            { peakFrame: 200, attackFrames: 3, holdFrames: 4, releaseFrames: 12 },
          ],
        }}
      >
        <ColorDemoStageVideo />
      </ChromaSplit>
      <ColorDemoLabel name="Chroma Split" note="RGB channel offset pulses" />
    </AbsoluteFill>
  );
};
