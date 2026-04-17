import React from "react";
import { staticFile } from "remotion";
import { TransitionDemoWrapper } from "./TransitionDemoWrapper";
import { DollyZoom } from "../components/transitions/DollyZoom";
const SRC = staticFile("sample-video.mp4");
export const DollyZoomTransitionDemo: React.FC = () => (
  <TransitionDemoWrapper transitionStartMs={3500} transitionDurationMs={700}>
    {({ progress }) => (
      <DollyZoom clipA={SRC} clipB={SRC} progress={progress} direction="in" />
    )}
  </TransitionDemoWrapper>
);
