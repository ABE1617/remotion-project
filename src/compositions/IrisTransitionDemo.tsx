import React from "react";
import { staticFile } from "remotion";
import { TransitionDemoWrapper } from "./TransitionDemoWrapper";
import { Iris } from "../components/transitions/Iris";
const SRC = staticFile("sample-video.mp4");
export const IrisTransitionDemo: React.FC = () => (
  <TransitionDemoWrapper transitionStartMs={3500} transitionDurationMs={700}>
    {({ progress }) => (
      <Iris clipA={SRC} clipB={SRC} progress={progress} direction="in" />
    )}
  </TransitionDemoWrapper>
);
