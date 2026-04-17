import React from "react";
import { staticFile } from "remotion";
import { Breathe } from "../components/zoom/Breathe";

export const ParallaxDepthDemo: React.FC = () => {
  return (
    <Breathe
      src={staticFile("sample-video.mp4")}
      events={[]}
      amplitude={1.0}
    />
  );
};
