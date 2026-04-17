import React from "react";
import { AnnotationArrow } from "../components/motion-graphics/AnnotationArrow";
import { MGDemoStage } from "./shared/MGDemoStage";

export const AnnotationArrowDemo: React.FC = () => {
  return (
    <MGDemoStage>
      <AnnotationArrow
        start={{ x: 200, y: 1400 }}
        end={{ x: 800, y: 900 }}
        pathType="curved-arc"
        color="#FFD60A"
        startMs={500}
        durationMs={3500}
      />
    </MGDemoStage>
  );
};
