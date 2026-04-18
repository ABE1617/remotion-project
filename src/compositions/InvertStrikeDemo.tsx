import React from "react";
import { AbsoluteFill } from "remotion";
import { InvertStrike } from "../components/color-effects";
import {
  ColorDemoStageVideo,
  ColorDemoLabel,
} from "./shared/ColorDemoStage";

// Hold the inverted look persistently for the demo so reviewers can study
// it. In production it's typically driven in pulsed mode on beat hits.
export const InvertStrikeDemo: React.FC = () => {
  return (
    <AbsoluteFill>
      <InvertStrike intensity={1} timing={{ mode: "persistent" }}>
        <ColorDemoStageVideo />
      </InvertStrike>
      <ColorDemoLabel name="Invert Strike" note="Color inversion (held)" />
    </AbsoluteFill>
  );
};
