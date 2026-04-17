import type { MGTimingProps } from "../shared/types";

export interface NewspaperRevealProps extends MGTimingProps {
  // Asset path for the newspaper image. Defaults to `torn-newspaper.png`
  // under /public. Pass a custom path if your project uses a different
  // newspaper graphic.
  assetPath?: string;
}
