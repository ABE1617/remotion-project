import React from "react";
import { QuoteCard } from "../components/motion-graphics/QuoteCard";
import { MGDemoStage } from "./shared/MGDemoStage";

export const QuoteCardDemo: React.FC = () => {
  return (
    <MGDemoStage>
      <QuoteCard
        quote="The people who are crazy enough to think they can change the world are the ones who do."
        attribution="Steve Jobs, 2005"
        startMs={400}
        durationMs={5000}
      />
    </MGDemoStage>
  );
};
