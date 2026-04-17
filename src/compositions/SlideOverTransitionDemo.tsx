import React from "react";
import { staticFile } from "remotion";
import { TransitionDemoWrapper } from "./TransitionDemoWrapper";
import { SlideOver } from "../components/transitions/SlideOver";
const SRC = staticFile("sample-video.mp4");
export const SlideOverTransitionDemo: React.FC = () => (
  <TransitionDemoWrapper transitionStartMs={2500} transitionDurationMs={1200}>
    {({ progress }) => <SlideOver clipA={SRC} clipB={SRC} progress={progress} />}
  </TransitionDemoWrapper>
);
