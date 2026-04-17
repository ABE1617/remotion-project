import React from "react";
import { staticFile } from "remotion";
import { TransitionDemoWrapper } from "./TransitionDemoWrapper";
import { CardLift } from "../components/transitions/CardLift";
const SRC = staticFile("sample-video.mp4");
export const CardLiftTransitionDemo: React.FC = () => (
  <TransitionDemoWrapper transitionStartMs={3500} transitionDurationMs={650}>
    {({ progress }) => (
      <CardLift clipA={SRC} clipB={SRC} progress={progress} />
    )}
  </TransitionDemoWrapper>
);
