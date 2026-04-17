import React from "react";
import { ProgressBar } from "../components/motion-graphics/ProgressBar";
import { MGDemoStage } from "./shared/MGDemoStage";

export const ProgressBarDemo: React.FC = () => {
  return (
    <MGDemoStage>
      <ProgressBar
        label="Road to the goal"
        value={72000}
        total={100000}
        formatValue={(v) => `$${(v / 1000).toFixed(0)}K`}
        fillColor="#D4A12A"
        accentColor="#D4A12A"
        milestones={[
          { at: 0.25, label: "$25K" },
          { at: 0.5, label: "$50K" },
          { at: 0.75, label: "$75K" },
        ]}
        startMs={400}
        durationMs={5000}
      />
    </MGDemoStage>
  );
};
