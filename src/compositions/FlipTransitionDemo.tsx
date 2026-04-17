import React from "react";
import { staticFile } from "remotion";
import { TransitionDemoWrapper } from "./TransitionDemoWrapper";
import { Flip } from "../components/transitions/Flip";
const SRC = staticFile("sample-video.mp4");
export const FlipTransitionDemo: React.FC = () => (
  <TransitionDemoWrapper transitionStartMs={2500} transitionDurationMs={1500}>
    {({ progress }) => <Flip clipA={SRC} clipB={SRC} progress={progress} />}
  </TransitionDemoWrapper>
);
