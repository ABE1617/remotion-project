import React from "react";
import { AbsoluteFill } from "remotion";
import { GoldenHour } from "../components/color-effects";
import {
  ColorDemoStageVideo,
  ColorDemoLabel,
} from "./shared/ColorDemoStage";

export const GoldenHourDemo: React.FC = () => {
  return (
    <AbsoluteFill>
      <GoldenHour intensity={1} timing={{ mode: "persistent" }}>
        <ColorDemoStageVideo />
      </GoldenHour>
      <ColorDemoLabel name="Golden Hour" note="Warm amber lock" />
    </AbsoluteFill>
  );
};
