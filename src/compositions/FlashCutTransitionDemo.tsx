import React from "react";
import { staticFile } from "remotion";
import { TransitionDemoWrapper } from "./TransitionDemoWrapper";
import { FlashCut } from "../components/transitions/FlashCut";
const SRC = staticFile("sample-video.mp4");
export const FlashCutTransitionDemo: React.FC = () => (
  <TransitionDemoWrapper transitionStartMs={3500} transitionDurationMs={400}>
    {({ progress }) => <FlashCut clipA={SRC} clipB={SRC} progress={progress} />}
  </TransitionDemoWrapper>
);
