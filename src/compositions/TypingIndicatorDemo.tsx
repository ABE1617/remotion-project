import React from "react";
import { TypingIndicator } from "../components/motion-graphics/TypingIndicator";
import { MGDemoStage } from "./shared/MGDemoStage";

export const TypingIndicatorDemo: React.FC = () => {
  return (
    <MGDemoStage>
      <TypingIndicator
        side="incoming"
        startMs={400}
        durationMs={5000}
      />
    </MGDemoStage>
  );
};
