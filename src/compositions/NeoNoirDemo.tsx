import React from "react";
import { AbsoluteFill } from "remotion";
import { NeoNoir } from "../components/color-effects";
import {
  ColorDemoStageVideo,
  ColorDemoLabel,
} from "./shared/ColorDemoStage";

export const NeoNoirDemo: React.FC = () => {
  return (
    <AbsoluteFill>
      <NeoNoir intensity={1} timing={{ mode: "persistent" }}>
        <ColorDemoStageVideo />
      </NeoNoir>
      <ColorDemoLabel name="Neo Noir" note="Fincher cold-desat grade" />
    </AbsoluteFill>
  );
};
