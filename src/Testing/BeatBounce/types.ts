import type { SpringConfig } from "remotion";
import type { CaptionStyleProps } from "../../types/captions";

export interface WaveformConfig {
  /** Number of equalizer bars. Default: 24 */
  barCount?: number;
  /** Max bar height in px. Default: 80 */
  maxBarHeight?: number;
  /** Min bar height in px. Default: 6 */
  minBarHeight?: number;
  /** Bar width in px. Default: 8 */
  barWidth?: number;
  /** Gap between bars in px. Default: 4 */
  barGap?: number;
  /** Border radius on bars. Default: 4 */
  barBorderRadius?: number;
  /** Overall waveform opacity. Default: 0.6 */
  opacity?: number;
}

export interface BeatBounceProps extends CaptionStyleProps {
  /** Color for waveform bars and active word highlight. Default: "#00D4FF" */
  accentColor?: string;
  /** Optional real per-frame amplitude data (0-1). Default: simulated from timing */
  amplitudeData?: number[];
  /** Waveform bar configuration */
  waveform?: WaveformConfig;
  /** Bounce drop distance in px. Default: 12 */
  bounceDistance?: number;
  /** Spring config for word bounce entrance. Default: snappy spring */
  bounceSpring?: SpringConfig;
  /** Whether active word gets a scale pulse. Default: true */
  enableScalePulse?: boolean;
  /** Scale multiplier on active word pulse. Default: 1.08 */
  pulseScale?: number;
  /** Max words displayed per line. Default: 4 */
  maxWordsPerLine?: number;
  /** Letter spacing in em. Default: 0.03 */
  letterSpacing?: number;
  /** Force uppercase text. Default: false */
  allCaps?: boolean;
  /** Min text-shadow stroke width at low amplitude. Default: 2 */
  minStrokeWidth?: number;
  /** Max text-shadow stroke width at peak amplitude. Default: 5 */
  maxStrokeWidth?: number;
  /** Show waveform bars behind text. Default: true */
  showWaveform?: boolean;
  /** Page fade-out duration in ms. Default: 120 */
  fadeOutDurationMs?: number;
}
