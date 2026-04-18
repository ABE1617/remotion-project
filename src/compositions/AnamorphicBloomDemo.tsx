import React from "react";
import { AbsoluteFill } from "remotion";
import { AnamorphicBloom } from "../components/color-effects";
import {
  ColorDemoStageVideo,
  ColorDemoLabel,
} from "./shared/ColorDemoStage";

export const AnamorphicBloomDemo: React.FC = () => {
  return (
    <AbsoluteFill>
      <AnamorphicBloom intensity={1} timing={{ mode: "persistent" }}>
        <ColorDemoStageVideo />
      </AnamorphicBloom>
      <ColorDemoLabel
        name="Anamorphic Bloom"
        note="Horizontal streak bloom on highlights"
      />
    </AbsoluteFill>
  );
};
