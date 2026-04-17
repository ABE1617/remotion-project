import React from "react";
import { staticFile } from "remotion";
import { TransitionDemoWrapper } from "./TransitionDemoWrapper";
import { ShutterFlash } from "../components/transitions/ShutterFlash";
const SRC = staticFile("sample-video.mp4");
export const ShutterFlashTransitionDemo: React.FC = () => (
  <TransitionDemoWrapper transitionStartMs={3500} transitionDurationMs={450}>
    {({ progress }) => <ShutterFlash clipA={SRC} clipB={SRC} progress={progress} />}
  </TransitionDemoWrapper>
);
