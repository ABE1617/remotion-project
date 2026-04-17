import React from "react";
import { staticFile } from "remotion";
import { TransitionDemoWrapper } from "./TransitionDemoWrapper";
import { PaperTear } from "../components/transitions/PaperTear";
const SRC = staticFile("sample-video.mp4");
export const PaperTearTransitionDemo: React.FC = () => (
  <TransitionDemoWrapper transitionStartMs={3500} transitionDurationMs={800}>
    {({ progress }) => (
      <PaperTear clipA={SRC} clipB={SRC} progress={progress} />
    )}
  </TransitionDemoWrapper>
);
