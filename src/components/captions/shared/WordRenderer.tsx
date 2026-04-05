import React from "react";
import type { CaptionToken } from "./types";

interface WordRendererProps {
  tokens: CaptionToken[];
  currentTimeMs: number;
  renderWord: (
    token: CaptionToken,
    index: number,
    isActive: boolean,
    progress: number,
  ) => React.ReactNode;
}

/**
 * Iterates through tokens and calls renderWord for each,
 * providing timing-aware isActive and progress values.
 */
export const WordRenderer: React.FC<WordRendererProps> = ({
  tokens,
  currentTimeMs,
  renderWord,
}) => {
  return (
    <>
      {tokens.map((token, index) => {
        const isActive =
          currentTimeMs >= token.start && currentTimeMs < token.end;
        const tokenDuration = token.end - token.start;
        const progress =
          tokenDuration > 0
            ? Math.max(
                0,
                Math.min(1, (currentTimeMs - token.start) / tokenDuration),
              )
            : 0;

        return (
          <React.Fragment key={index}>
            {renderWord(token, index, isActive, progress)}
          </React.Fragment>
        );
      })}
    </>
  );
};
