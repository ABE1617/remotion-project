import React from "react";
import { AbsoluteFill } from "remotion";
import { DuotonePulse } from "../components/color-effects";
import {
  ColorDemoStageVideo,
  ColorDemoLabel,
} from "./shared/ColorDemoStage";

export const DuotonePulseDemo: React.FC = () => {
  return (
    <AbsoluteFill>
      <DuotonePulse
        shadowColor="#0c1a36"
        highlightColor="#f2b160"
        intensity={1}
        bpm={100}
        timing={{ mode: "persistent" }}
      >
        <ColorDemoStageVideo />
      </DuotonePulse>
      <ColorDemoLabel name="Duotone Pulse" note="Navy → amber, beat breathe" />
    </AbsoluteFill>
  );
};
