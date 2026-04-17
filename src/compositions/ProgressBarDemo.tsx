import React from "react";
import { ProgressBar } from "../components/motion-graphics/ProgressBar";
import { MGDemoStage } from "./shared/MGDemoStage";

export const ProgressBarDemo: React.FC = () => {
  return (
    <MGDemoStage>
      <ProgressBar
        label="Revenue to goal"
        value={72000}
        total={100000}
        formatValue={(v) => `$${(v / 1000).toFixed(0)}K`}
        accentColor="#FF3B30"
        milestones={[{ at: 0.25 }, { at: 0.5 }, { at: 0.75 }]}
        startMs={400}
        durationMs={5000}
      />
    </MGDemoStage>
  );
};
