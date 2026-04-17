import React from "react";
import { StatCard } from "../components/motion-graphics/StatCard";
import { MGDemoStage } from "./shared/MGDemoStage";

export const StatCardDemo: React.FC = () => {
  return (
    <MGDemoStage>
      <StatCard
        value={500000}
        prefix="$"
        label="In 90 days"
        startMs={400}
        durationMs={4500}
      />
    </MGDemoStage>
  );
};
