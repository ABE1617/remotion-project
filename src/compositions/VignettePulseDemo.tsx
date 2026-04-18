import React from "react";
import { AbsoluteFill } from "remotion";
import { VignettePulse } from "../components/color-effects";
import {
  ColorDemoStageVideo,
  ColorDemoLabel,
} from "./shared/ColorDemoStage";

// Hold the tightened vignette persistently for the demo so reviewers can
// study the look. In production it's typically driven in pulsed mode on
// beat hits.
export const VignettePulseDemo: React.FC = () => {
  return (
    <AbsoluteFill>
      <VignettePulse
        baseDarkness={0.35}
        baseInnerPct={58}
        intensity={0.7}
        timing={{ mode: "persistent" }}
      >
        <ColorDemoStageVideo />
      </VignettePulse>
      <ColorDemoLabel name="Vignette Pulse" note="Tightened vignette (held)" />
    </AbsoluteFill>
  );
};
