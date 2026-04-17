import React from "react";
import { staticFile } from "remotion";
import { TransitionDemoWrapper } from "./TransitionDemoWrapper";
import { ZoomThrough } from "../components/transitions/ZoomThrough";
const SRC = staticFile("sample-video.mp4");
export const ZoomThroughTransitionDemo: React.FC = () => (
  <TransitionDemoWrapper transitionStartMs={2500} transitionDurationMs={1200}>
    {({ progress }) => <ZoomThrough clipA={SRC} clipB={SRC} progress={progress} />}
  </TransitionDemoWrapper>
);
