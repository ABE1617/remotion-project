import React from "react";
import { LowerThird } from "../components/motion-graphics/LowerThird";
import { MGDemoStage } from "./shared/MGDemoStage";

export const LowerThirdLightDemo: React.FC = () => {
  return (
    <MGDemoStage>
      <LowerThird
        name="ZAC ALEXANDER"
        title="FOUNDER · ALEXANDER MEDIA"
        startMs={400}
        durationMs={4500}
        accentColor="#16120E"
        theme="light"
      />
    </MGDemoStage>
  );
};
