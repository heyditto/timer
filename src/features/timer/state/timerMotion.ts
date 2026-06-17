import * as THREE from "three";
import type { TimerStatus } from "../types";

export type TimerMotionSnapshot = {
  status: TimerStatus;
  durationMs: number;
  remainingMs: number;
  endTime: number | null;
};

/** Mutable snapshot read every animation frame for smooth character motion. */
export const timerMotion: TimerMotionSnapshot = {
  status: "idle",
  durationMs: 0,
  remainingMs: 0,
  endTime: null,
};

const clamp01 = (value: number) => THREE.MathUtils.clamp(value, 0, 1);

/** Frame-accurate walk progress for the 3D scene. */
export const getSmoothWalkProgress = (): number => {
  const { status, durationMs, remainingMs, endTime } = timerMotion;

  if (status === "running" && endTime !== null && durationMs > 0) {
    const remaining = Math.max(0, endTime - performance.now());
    return clamp01(1 - remaining / durationMs);
  }

  if (status === "paused" && durationMs > 0) {
    return clamp01(1 - remainingMs / durationMs);
  }

  if (status === "completed") {
    return 1;
  }

  return 0;
};

export const syncTimerMotion = (snapshot: TimerMotionSnapshot) => {
  timerMotion.status = snapshot.status;
  timerMotion.durationMs = snapshot.durationMs;
  timerMotion.remainingMs = snapshot.remainingMs;
  timerMotion.endTime = snapshot.endTime;
};
