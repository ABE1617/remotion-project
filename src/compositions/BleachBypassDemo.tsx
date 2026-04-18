import React from "react";
import { AbsoluteFill } from "remotion";
import { BleachBypass } from "../components/color-effects";
import {
  ColorDemoStageVideo,
  ColorDemoLabel,
} from "./shared/ColorDemoStage";

export const BleachBypassDemo: React.FC = () => {
  return (
    <AbsoluteFill>
      <BleachBypass intensity={1} timing={{ mode: "persistent" }}>
        <ColorDemoStageVideo />
      </BleachBypass>
      <ColorDemoLabel name="Bleach Bypass" note="Silver retention / thriller" />
    </AbsoluteFill>
  );
};
