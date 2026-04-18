import React from "react";
import { AbsoluteFill } from "remotion";
import { SplitTone } from "../components/color-effects";
import {
  ColorDemoStageVideo,
  ColorDemoLabel,
} from "./shared/ColorDemoStage";

export const SplitToneDemo: React.FC = () => {
  return (
    <AbsoluteFill>
      <SplitTone
        shadowColor="#d97a3a"
        highlightColor="#6fc2c9"
        intensity={1}
        timing={{ mode: "persistent" }}
      >
        <ColorDemoStageVideo />
      </SplitTone>
      <ColorDemoLabel
        name="Split Tone"
        note="Orange shadows / teal highlights"
      />
    </AbsoluteFill>
  );
};
