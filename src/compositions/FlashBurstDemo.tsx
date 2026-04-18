import React from "react";
import { AbsoluteFill } from "remotion";
import { FlashBurst } from "../components/color-effects";
import {
  ColorDemoStageVideo,
  ColorDemoLabel,
} from "./shared/ColorDemoStage";

// Fire four flash hits across the 10s demo so reviewers can judge curve + decay
export const FlashBurstDemo: React.FC = () => {
  return (
    <AbsoluteFill>
      <FlashBurst
        intensity={0.9}
        timing={{
          mode: "pulsed",
          pulses: [
            { peakFrame: 30 },
            { peakFrame: 90 },
            { peakFrame: 150 },
            { peakFrame: 220 },
          ],
        }}
      >
        <ColorDemoStageVideo />
      </FlashBurst>
      <ColorDemoLabel name="Flash Burst" note="Photo-flash punctuation" />
    </AbsoluteFill>
  );
};
