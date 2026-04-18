import React from "react";
import { AbsoluteFill } from "remotion";
import { Halation } from "../components/color-effects";
import {
  ColorDemoStageVideo,
  ColorDemoLabel,
} from "./shared/ColorDemoStage";

export const HalationDemo: React.FC = () => {
  return (
    <AbsoluteFill>
      <Halation intensity={1} timing={{ mode: "persistent" }}>
        <ColorDemoStageVideo />
      </Halation>
      <ColorDemoLabel name="Halation" note="Red bloom around highlights" />
    </AbsoluteFill>
  );
};
