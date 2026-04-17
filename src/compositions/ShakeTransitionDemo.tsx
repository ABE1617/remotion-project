import React from "react";
import { staticFile } from "remotion";
import { TransitionDemoWrapper } from "./TransitionDemoWrapper";
import { Shake } from "../components/transitions/Shake";
const SRC = staticFile("sample-video.mp4");
export const ShakeTransitionDemo: React.FC = () => (
  <TransitionDemoWrapper transitionStartMs={3500} transitionDurationMs={500}>
    {({ progress }) => (
      <Shake clipA={SRC} clipB={SRC} progress={progress} intensity="heavy" />
    )}
  </TransitionDemoWrapper>
);
