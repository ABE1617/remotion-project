export function framesToMs(frame: number, fps: number): number {
  return (frame / fps) * 1000;
}

export function msToFrames(ms: number, fps: number): number {
  return Math.round((ms / 1000) * fps);
}

export function secondsToFrames(seconds: number, fps: number): number {
  return Math.round(seconds * fps);
}

export function getCurrentTimeMs(frame: number, fps: number): number {
  return framesToMs(frame, fps);
}
