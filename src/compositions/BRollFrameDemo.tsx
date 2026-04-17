import React from "react";
import { staticFile } from "remotion";
import { BRollFrame } from "../components/motion-graphics/BRollFrame";
import { MGDemoStage } from "./shared/MGDemoStage";

export const BRollFrameDemo: React.FC = () => {
  return (
    <MGDemoStage>
      <BRollFrame
        src={staticFile("stage.jpg")}
        mediaType="image"
        aspectRatio="4:5"
        width={620}
        position="center"
        variant="polaroid"
        caption="Stage I, 2024"
        startMs={400}
        durationMs={4000}
      />
    </MGDemoStage>
  );
};
