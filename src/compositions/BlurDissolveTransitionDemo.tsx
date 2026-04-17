import React from "react";
import { staticFile } from "remotion";
import { TransitionDemoWrapper } from "./TransitionDemoWrapper";
import { BlurDissolve } from "../components/transitions/BlurDissolve";
const SRC = staticFile("sample-video.mp4");
export const BlurDissolveTransitionDemo: React.FC = () => (
  <TransitionDemoWrapper transitionStartMs={3000} transitionDurationMs={750}>
    {({ progress }) => <BlurDissolve clipA={SRC} clipB={SRC} progress={progress} />}
  </TransitionDemoWrapper>
);
