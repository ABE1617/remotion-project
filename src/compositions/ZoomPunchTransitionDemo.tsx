import React from "react";
import { staticFile } from "remotion";
import { TransitionDemoWrapper } from "./TransitionDemoWrapper";
import { ZoomPunch } from "../components/transitions/ZoomPunch";
const SRC = staticFile("sample-video.mp4");
export const ZoomPunchTransitionDemo: React.FC = () => (
  <TransitionDemoWrapper transitionStartMs={3500} transitionDurationMs={400}>
    {({ progress }) => <ZoomPunch clipA={SRC} clipB={SRC} progress={progress} />}
  </TransitionDemoWrapper>
);
