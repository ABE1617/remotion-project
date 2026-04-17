import React from "react";
import { Toggle } from "../components/motion-graphics/Toggle";
import { MGDemoStage } from "./shared/MGDemoStage";

export const ToggleDemo: React.FC = () => {
  return (
    <MGDemoStage>
      <Toggle
        text="Growth mode"
        activateAtMs={800}
        startMs={500}
        durationMs={4000}
      />
    </MGDemoStage>
  );
};
