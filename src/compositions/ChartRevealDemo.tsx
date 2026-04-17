import React from "react";
import { ChartReveal } from "../components/motion-graphics/ChartReveal";
import { MGDemoStage } from "./shared/MGDemoStage";

// Viral short-form bar pattern: bold title, bars grow with counting values
// on top, peak bar highlighted in white.
export const ChartRevealDemo: React.FC = () => {
  return (
    <MGDemoStage>
      <ChartReveal
        chartType="bar"
        title="Monthly Revenue"
        prefix="$"
        suffix="K"
        data={[
          { label: "Jan", value: 12 },
          { label: "Feb", value: 18 },
          { label: "Mar", value: 25 },
          { label: "Apr", value: 31 },
          { label: "May", value: 48 },
          { label: "Jun", value: 72 },
        ]}
        accentColor="#C8551F"
        highlight={{ index: 5 }}
        startMs={400}
        durationMs={5500}
      />
    </MGDemoStage>
  );
};
