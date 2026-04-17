import React from "react";
import { ChartReveal } from "../components/motion-graphics/ChartReveal";
import { MGDemoStage } from "./shared/MGDemoStage";

export const ChartRevealDemo: React.FC = () => {
  return (
    <MGDemoStage>
      <ChartReveal
        chartType="line"
        title="MONTHLY REVENUE"
        data={[
          { label: "Jan", value: 12 },
          { label: "Feb", value: 18 },
          { label: "Mar", value: 25 },
          { label: "Apr", value: 31 },
          { label: "May", value: 48 },
          { label: "Jun", value: 72 },
        ]}
        fillBelow
        cardStyle="dark"
        accentColor="#FF3B30"
        highlight={{ index: 5, label: "$72K" }}
        startMs={400}
        durationMs={5500}
      />
    </MGDemoStage>
  );
};
