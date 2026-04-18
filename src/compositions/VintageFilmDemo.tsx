import React from "react";
import { AbsoluteFill } from "remotion";
import { VintageFilm } from "../components/color-effects";
import {
  ColorDemoStageVideo,
  ColorDemoLabel,
} from "./shared/ColorDemoStage";

export const VintageFilmDemo: React.FC = () => {
  return (
    <AbsoluteFill>
      <VintageFilm intensity={1} timing={{ mode: "persistent" }}>
        <ColorDemoStageVideo />
      </VintageFilm>
      <ColorDemoLabel name="Vintage Film" note="Kodachrome + halation + grain" />
    </AbsoluteFill>
  );
};
