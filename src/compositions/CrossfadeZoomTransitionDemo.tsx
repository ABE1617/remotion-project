import React from "react";
import { staticFile } from "remotion";
import { TransitionDemoWrapper } from "./TransitionDemoWrapper";
import { CrossfadeZoom } from "../components/transitions/CrossfadeZoom";
const SRC = staticFile("sample-video.mp4");
export const CrossfadeZoomTransitionDemo: React.FC = () => (
  <TransitionDemoWrapper transitionStartMs={2500} transitionDurationMs={1800}>
    {({ progress }) => <CrossfadeZoom clipA={SRC} clipB={SRC} progress={progress} />}
  </TransitionDemoWrapper>
);
