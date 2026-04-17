import React from "react";
import { AbsoluteFill } from "remotion";
import { AnnotationArrow } from "../components/motion-graphics/AnnotationArrow";
import { MGDemoStage } from "./shared/MGDemoStage";

// Showcase scenario — a ring marker on the frame (the "target of interest")
// with a straight arrow pointing at it from the lower-left. No text; the
// marker alone is enough to show the arrow is annotating something specific.

const TARGET_POS = { x: 760, y: 720 };
const ARROW_START = { x: 180, y: 1500 };
const ACCENT = "#C8551F";
const RING_DIAMETER = 140;
const RING_STROKE = 4;

export const AnnotationArrowDemo: React.FC = () => {
  return (
    <MGDemoStage>
      {/* Ring marker at the target point */}
      <AbsoluteFill>
        <div
          style={{
            position: "absolute",
            left: TARGET_POS.x - RING_DIAMETER / 2,
            top: TARGET_POS.y - RING_DIAMETER / 2,
            width: RING_DIAMETER,
            height: RING_DIAMETER,
            borderRadius: "50%",
            border: `${RING_STROKE}px solid ${ACCENT}`,
            boxShadow: "0 0 0 2px rgba(0,0,0,0.35)",
          }}
        />
      </AbsoluteFill>

      <AnnotationArrow
        start={ARROW_START}
        end={TARGET_POS}
        pathType="straight"
        color={ACCENT}
        strokeWidth={8}
        seed={3}
        startMs={500}
        durationMs={3500}
      />
    </MGDemoStage>
  );
};
