import React from "react";
import { StickyNotes } from "../components/motion-graphics/StickyNotes";
import { MGDemoStage } from "./shared/MGDemoStage";

export const StickyNotesDemo: React.FC = () => {
  return (
    <MGDemoStage>
      <StickyNotes
        notes={[
          { text: "Focus", color: "#FFEF8C", rotation: -6 },
          { text: "Ship it", color: "#A8D7FF", rotation: 3 },
          { text: "Celebrate", color: "#FFB8D1", rotation: -2 },
        ]}
        startMs={500}
        durationMs={4000}
      />
    </MGDemoStage>
  );
};
