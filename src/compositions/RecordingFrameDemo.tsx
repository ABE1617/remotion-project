import React from "react";
import { RecordingFrame } from "../components/motion-graphics/RecordingFrame";
import { MGDemoStage } from "./shared/MGDemoStage";

export const RecordingFrameDemo: React.FC = () => {
  return (
    <MGDemoStage>
      <RecordingFrame startMs={0} durationMs={5000} />
    </MGDemoStage>
  );
};
