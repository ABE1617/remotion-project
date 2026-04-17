import React from "react";
import { ComparisonSplit } from "../components/motion-graphics/ComparisonSplit";
import { MGDemoStage } from "./shared/MGDemoStage";

export const ComparisonSplitDemo: React.FC = () => {
  return (
    <MGDemoStage>
      <ComparisonSplit
        orientation="vertical"
        sides={[
          {
            type: "text",
            text: "BEFORE",
            color: "#888",
            bgColor: "#1A1A1A",
            desaturate: true,
          },
          { type: "text", text: "AFTER", color: "#FFF", bgColor: "#FF3B30" },
        ]}
        labels={["WRONG WAY", "RIGHT WAY"]}
        showVsPill
        startMs={400}
        durationMs={4500}
      />
    </MGDemoStage>
  );
};
