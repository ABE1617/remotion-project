import React from "react";
import { SceneTitle } from "../components/motion-graphics/SceneTitle";
import { MGDemoStage } from "./shared/MGDemoStage";

export const SceneTitleDemo: React.FC = () => {
  return (
    <MGDemoStage>
      <SceneTitle
        label="PART 01"
        title={"THE\nHOOK"}
        variant="full"
        accentColor="#FF3B30"
        startMs={300}
        durationMs={3500}
      />
    </MGDemoStage>
  );
};
