import React from "react";
import { SceneTitle } from "../components/motion-graphics/SceneTitle";
import { MGDemoStage } from "./shared/MGDemoStage";

export const SceneTitleLightDemo: React.FC = () => {
  return (
    <MGDemoStage>
      <SceneTitle
        label="PART 01"
        title={"THE\nHOOK"}
        variant="full"
        theme="light"
        accentColor="#C8551F"
        startMs={300}
        durationMs={3500}
      />
    </MGDemoStage>
  );
};
