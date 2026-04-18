import React from "react";
import { AbsoluteFill } from "remotion";
import { CineMono } from "../components/color-effects";
import {
  ColorDemoStageVideo,
  ColorDemoLabel,
} from "./shared/ColorDemoStage";

export const CineMonoDemo: React.FC = () => {
  return (
    <AbsoluteFill>
      <CineMono intensity={1} timing={{ mode: "persistent" }}>
        <ColorDemoStageVideo />
      </CineMono>
      <ColorDemoLabel name="Cine Mono" note="Channel-mixed B&W" />
    </AbsoluteFill>
  );
};
