import React from "react";
import { NewspaperReveal } from "../components/motion-graphics/NewspaperReveal";
import { MGDemoStage } from "./shared/MGDemoStage";

export const NewspaperRevealDemo: React.FC = () => {
  return (
    <MGDemoStage>
      <NewspaperReveal startMs={500} durationMs={500} />
    </MGDemoStage>
  );
};
