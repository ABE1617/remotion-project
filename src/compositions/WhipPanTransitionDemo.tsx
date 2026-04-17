import React from "react";
import { staticFile } from "remotion";
import { TransitionDemoWrapper } from "./TransitionDemoWrapper";
import { WhipPan } from "../components/transitions/WhipPan";
const SRC = staticFile("sample-video.mp4");
export const WhipPanTransitionDemo: React.FC = () => (
  <TransitionDemoWrapper transitionStartMs={3500} transitionDurationMs={400}>
    {({ progress }) => <WhipPan clipA={SRC} clipB={SRC} progress={progress} />}
  </TransitionDemoWrapper>
);
