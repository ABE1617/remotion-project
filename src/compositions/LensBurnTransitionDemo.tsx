import React from "react";
import { staticFile } from "remotion";
import { TransitionDemoWrapper } from "./TransitionDemoWrapper";
import { LensBurn } from "../components/transitions/LensBurn";
const SRC = staticFile("sample-video.mp4");
export const LensBurnTransitionDemo: React.FC = () => (
  <TransitionDemoWrapper transitionStartMs={2500} transitionDurationMs={1800}>
    {({ progress }) => <LensBurn clipA={SRC} clipB={SRC} progress={progress} />}
  </TransitionDemoWrapper>
);
