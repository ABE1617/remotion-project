import React from "react";
import { AbsoluteFill } from "remotion";
import { CineStill } from "../components/color-effects";
import {
  ColorDemoStageVideo,
  ColorDemoLabel,
} from "./shared/ColorDemoStage";

export const CineStillDemo: React.FC = () => {
  return (
    <AbsoluteFill>
      <CineStill intensity={1} timing={{ mode: "persistent" }}>
        <ColorDemoStageVideo />
      </CineStill>
      <ColorDemoLabel name="CineStill" note="Tungsten-in-daylight, neon-night" />
    </AbsoluteFill>
  );
};
