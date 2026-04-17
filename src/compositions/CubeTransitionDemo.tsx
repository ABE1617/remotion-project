import React from "react";
import { staticFile } from "remotion";
import { TransitionDemoWrapper } from "./TransitionDemoWrapper";
import { Cube } from "../components/transitions/Cube";
const SRC = staticFile("sample-video.mp4");
export const CubeTransitionDemo: React.FC = () => (
  <TransitionDemoWrapper transitionStartMs={2500} transitionDurationMs={1500}>
    {({ progress }) => <Cube clipA={SRC} clipB={SRC} progress={progress} />}
  </TransitionDemoWrapper>
);
