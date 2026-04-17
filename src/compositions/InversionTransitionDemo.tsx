import React from "react";
import { staticFile } from "remotion";
import { TransitionDemoWrapper } from "./TransitionDemoWrapper";
import { Inversion } from "../components/transitions/Inversion";
const SRC = staticFile("sample-video.mp4");
export const InversionTransitionDemo: React.FC = () => (
  <TransitionDemoWrapper transitionStartMs={3500} transitionDurationMs={350}>
    {({ progress }) => (
      <Inversion clipA={SRC} clipB={SRC} progress={progress} />
    )}
  </TransitionDemoWrapper>
);
