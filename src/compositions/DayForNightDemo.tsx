import React from "react";
import { AbsoluteFill } from "remotion";
import { DayForNight } from "../components/color-effects";
import {
  ColorDemoStageVideo,
  ColorDemoLabel,
} from "./shared/ColorDemoStage";

export const DayForNightDemo: React.FC = () => {
  return (
    <AbsoluteFill>
      <DayForNight intensity={1} timing={{ mode: "persistent" }}>
        <ColorDemoStageVideo />
      </DayForNight>
      <ColorDemoLabel name="Day For Night" note="Cyan shadows, warm skin" />
    </AbsoluteFill>
  );
};
