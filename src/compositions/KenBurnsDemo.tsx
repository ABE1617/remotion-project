import React from "react";
import { staticFile } from "remotion";
import { KenBurns } from "../components/zoom/KenBurns";

export const KenBurnsDemo: React.FC = () => {
  return (
    <KenBurns
      src={staticFile("sample-video.mp4")}
      events={[]}
      direction="in"
      startScale={1.0}
      endScale={1.12}
      driftX={20}
      driftY={-8}
    />
  );
};
