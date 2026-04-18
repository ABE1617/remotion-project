import React from "react";
import { AbsoluteFill } from "remotion";
import { FilmGrain } from "../components/color-effects";
import {
  ColorDemoStageVideo,
  ColorDemoLabel,
} from "./shared/ColorDemoStage";

export const FilmGrainDemo: React.FC = () => {
  return (
    <AbsoluteFill>
      <FilmGrain intensity={1} timing={{ mode: "persistent" }}>
        <ColorDemoStageVideo />
      </FilmGrain>
      <ColorDemoLabel name="Film Grain" note="Animated cinema grain + flicker" />
    </AbsoluteFill>
  );
};
