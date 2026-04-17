import React from "react";
import { staticFile } from "remotion";
import { BRollFrame } from "../components/motion-graphics/BRollFrame";
import { MGDemoStage } from "./shared/MGDemoStage";

export const BRollFrameDemo: React.FC = () => {
  return (
    <MGDemoStage>
      <BRollFrame
        src={[
          staticFile("stage.jpg"),
          staticFile("stage.jpg"),
          staticFile("stage.jpg"),
        ]}
        mediaType="image"
        aspectRatio="4:5"
        width={620}
        anchor="center"
        variant="polaroid"
        caption={["Stage I, 2023", "Stage II, 2024", "Stage III, 2025"]}
        startMs={400}
        durationMs={4000}
      />
    </MGDemoStage>
  );
};
