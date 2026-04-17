import React from "react";
import { StatCard } from "../components/motion-graphics/StatCard";
import { MGDemoStage } from "./shared/MGDemoStage";

export const StatCardDemo: React.FC = () => {
  return (
    <MGDemoStage>
      <StatCard
        value={500000}
        prefix="$"
        label="REVENUE GENERATED IN 90 DAYS"
        source="Source: Internal data, 2024"
        cardStyle="dark"
        startMs={400}
        durationMs={5000}
      />
    </MGDemoStage>
  );
};
