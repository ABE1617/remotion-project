import React from "react";
import { staticFile } from "remotion";
import { TransitionDemoWrapper } from "./TransitionDemoWrapper";
import { ScanlineTear } from "../components/transitions/ScanlineTear";
const SRC = staticFile("sample-video.mp4");
export const ScanlineTearTransitionDemo: React.FC = () => (
  <TransitionDemoWrapper transitionStartMs={3500} transitionDurationMs={500}>
    {({ progress }) => (
      <ScanlineTear clipA={SRC} clipB={SRC} progress={progress} />
    )}
  </TransitionDemoWrapper>
);
