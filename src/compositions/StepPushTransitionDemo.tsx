import React from "react";
import { staticFile } from "remotion";
import { TransitionDemoWrapper } from "./TransitionDemoWrapper";
import { StepPush } from "../components/transitions/StepPush";
const SRC = staticFile("sample-video.mp4");
export const StepPushTransitionDemo: React.FC = () => (
  <TransitionDemoWrapper transitionStartMs={3500} transitionDurationMs={600}>
    {({ progress }) => (
      <StepPush clipA={SRC} clipB={SRC} progress={progress} direction="left" />
    )}
  </TransitionDemoWrapper>
);
