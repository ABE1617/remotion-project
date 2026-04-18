import React from "react";
import { AbsoluteFill } from "remotion";
import { Portra } from "../components/color-effects";
import {
  ColorDemoStageVideo,
  ColorDemoLabel,
} from "./shared/ColorDemoStage";

export const PortraDemo: React.FC = () => {
  return (
    <AbsoluteFill>
      <Portra intensity={1} timing={{ mode: "persistent" }}>
        <ColorDemoStageVideo />
      </Portra>
      <ColorDemoLabel name="Portra" note="Kodak Portra 400 editorial" />
    </AbsoluteFill>
  );
};
