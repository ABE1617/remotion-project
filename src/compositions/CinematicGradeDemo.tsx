import React from "react";
import { AbsoluteFill } from "remotion";
import { CinematicGrade } from "../components/color-effects";
import {
  ColorDemoStageVideo,
  ColorDemoLabel,
} from "./shared/ColorDemoStage";

export const CinematicGradeDemo: React.FC = () => {
  return (
    <AbsoluteFill>
      <CinematicGrade intensity={1} timing={{ mode: "persistent" }}>
        <ColorDemoStageVideo />
      </CinematicGrade>
      <ColorDemoLabel name="Cinematic Grade" note="Teal & orange film look" />
    </AbsoluteFill>
  );
};
