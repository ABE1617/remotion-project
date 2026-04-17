import React from "react";
import { staticFile } from "remotion";
import { TransitionDemoWrapper } from "./TransitionDemoWrapper";
import { LightLeak } from "../components/transitions/LightLeak";
const SRC = staticFile("sample-video.mp4");
export const LightLeakTransitionDemo: React.FC = () => (
  <TransitionDemoWrapper transitionStartMs={3000} transitionDurationMs={750}>
    {({ progress }) => <LightLeak clipA={SRC} clipB={SRC} progress={progress} />}
  </TransitionDemoWrapper>
);
