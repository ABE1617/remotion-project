import React from "react";
import { TornPaper } from "../components/motion-graphics/TornPaper";
import { MGDemoStage } from "./shared/MGDemoStage";

export const TornPaperDemo: React.FC = () => {
  return (
    <MGDemoStage>
      <TornPaper
        topText="BREAKING"
        bottomText="NEWS"
        startMs={400}
        durationMs={4000}
      />
    </MGDemoStage>
  );
};
