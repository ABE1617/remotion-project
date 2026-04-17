import React from "react";
import { ComparisonSplit } from "../components/motion-graphics/ComparisonSplit";
import { MGDemoStage } from "./shared/MGDemoStage";

// Demo: the 80% creator use case — animated stat before/after.
// "$2,000 PER MONTH" on the dim "before" side, "$20,000 PER MONTH" on the
// bright "after" side. Both count up in parallel.
export const ComparisonSplitDemo: React.FC = () => {
  return (
    <MGDemoStage>
      <ComparisonSplit
        orientation="vertical"
        sides={[
          {
            type: "stat",
            value: 2000,
            prefix: "$",
            label: "Per month",
            desaturate: true,
          },
          {
            type: "stat",
            value: 20000,
            prefix: "$",
            label: "Per month",
          },
        ]}
        labels={["BEFORE", "AFTER"]}
        theme="dark"
        accentColor="#C8551F"
        startMs={400}
        durationMs={5500}
      />
    </MGDemoStage>
  );
};
