import React from "react";
import { LowerThird } from "../components/motion-graphics/LowerThird";
import { MGDemoStage } from "./shared/MGDemoStage";

export const LowerThirdDemo: React.FC = () => {
  return (
    <MGDemoStage>
      <LowerThird
        name="ZAC ALEXANDER"
        title="FOUNDER · ALEXANDER MEDIA"
        startMs={400}
        durationMs={4500}
        accentColor="#FF3B30"
      />
    </MGDemoStage>
  );
};
