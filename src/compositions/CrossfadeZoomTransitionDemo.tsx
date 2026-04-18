import React from "react";
import { staticFile } from "remotion";
import { TransitionDemoWrapper } from "./TransitionDemoWrapper";
import { CrossfadeZoom } from "../components/transitions/CrossfadeZoom";
const VIDEO = staticFile("sample-video.mp4");
const PHOTO = staticFile("stage.jpg");
export const CrossfadeZoomTransitionDemo: React.FC = () => (
  <TransitionDemoWrapper transitionStartMs={2500} transitionDurationMs={1800}>
    {({ progress }) => (
      <CrossfadeZoom clipA={VIDEO} clipB={PHOTO} progress={progress} />
    )}
  </TransitionDemoWrapper>
);
