import React from "react";
import { staticFile } from "remotion";
import { TransitionDemoWrapper } from "./TransitionDemoWrapper";
import { AnamorphicStreak } from "../components/transitions/AnamorphicStreak";
const SRC = staticFile("sample-video.mp4");
export const AnamorphicStreakTransitionDemo: React.FC = () => (
  <TransitionDemoWrapper transitionStartMs={3500} transitionDurationMs={600}>
    {({ progress }) => (
      <AnamorphicStreak clipA={SRC} clipB={SRC} progress={progress} />
    )}
  </TransitionDemoWrapper>
);
