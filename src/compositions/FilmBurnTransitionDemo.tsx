import React from "react";
import { staticFile } from "remotion";
import { TransitionDemoWrapper } from "./TransitionDemoWrapper";
import { FilmBurn } from "../components/transitions/FilmBurn";

const SRC = staticFile("sample-video.mp4");

export const FilmBurnTransitionDemo: React.FC = () => (
  <TransitionDemoWrapper transitionStartMs={3000} transitionDurationMs={500}>
    {({ progress }) => (
      <FilmBurn clipA={SRC} clipB={SRC} progress={progress} />
    )}
  </TransitionDemoWrapper>
);
