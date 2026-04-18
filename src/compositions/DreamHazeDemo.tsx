import React from "react";
import { AbsoluteFill } from "remotion";
import { DreamHaze } from "../components/color-effects";
import {
  ColorDemoStageVideo,
  ColorDemoLabel,
} from "./shared/ColorDemoStage";

export const DreamHazeDemo: React.FC = () => {
  return (
    <AbsoluteFill>
      <DreamHaze intensity={1} timing={{ mode: "persistent" }}>
        <ColorDemoStageVideo />
      </DreamHaze>
      <ColorDemoLabel name="Dream Haze" note="Lifted blacks, soft diffusion" />
    </AbsoluteFill>
  );
};
