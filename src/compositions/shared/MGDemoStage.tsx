import React from "react";
import { AbsoluteFill, staticFile } from "remotion";
import { Video } from "@remotion/media";

// Standard background stage for motion-graphics demos. Uses the project's
// sample video so each MG component is judged against real footage rather
// than a flat color.
export const MGDemoStage: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <AbsoluteFill>
      <Video
        src={staticFile("sample-video.mp4")}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
      {children}
    </AbsoluteFill>
  );
};
