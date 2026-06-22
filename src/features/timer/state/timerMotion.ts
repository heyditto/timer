import * as THREE from "three";
import type { TimerStatus } from "../types";

export type TimerMotionSnapshot = {
  status: TimerStatus;
  durationMs: number;
  remainingMs: number;
  endTime: number | null;
  segmentIndex: number;
  totalSegments: number;
  manualWalkProgress: number | null;
};

/** Mutable snapshot read every animation frame for smooth character motion. */
export const timerMotion: TimerMotionSnapshot = {
  status: "idle",
  durationMs: 0,
  remainingMs: 0,
  endTime: null,
  segmentIndex: 0,
  totalSegments: 1,
  manualWalkProgress: null,
};

const clamp01 = (value: number) => THREE.MathUtils.clamp(value, 0, 1);
const wrap01 = (value: number): number => ((value % 1) + 1) % 1;

/** Frame-accurate walk progress for the 3D scene. */
export const getSmoothWalkProgress = (): number => {
  const {
    status,
    durationMs,
    remainingMs,
    endTime,
    manualWalkProgress,
    segmentIndex,
    totalSegments,
  } = timerMotion;
  const segmentCount = Math.max(1, totalSegments);
  const segmentOffset = clamp01(segmentIndex / segmentCount);

  if (manualWalkProgress !== null) {
    return manualWalkProgress;
  }

  if (status === "running" && endTime !== null && durationMs > 0) {
    const remaining = Math.max(0, endTime - performance.now());
    const segmentProgress = clamp01(1 - remaining / durationMs);
    return clamp01(segmentOffset + segmentProgress / segmentCount);
  }

  if (status === "paused" && durationMs > 0) {
    const segmentProgress = clamp01(1 - remainingMs / durationMs);
    return clamp01(segmentOffset + segmentProgress / segmentCount);
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
  timerMotion.segmentIndex = snapshot.segmentIndex;
  timerMotion.totalSegments = snapshot.totalSegments;
  timerMotion.manualWalkProgress = snapshot.manualWalkProgress;
};

export const setManualWalkProgress = (progress: number | null) => {
  timerMotion.manualWalkProgress =
    progress === null ? null : wrap01(progress);
};

export const nudgeManualWalkProgress = (delta: number) => {
  if (
    timerMotion.status === "running" ||
    timerMotion.status === "paused" ||
    timerMotion.status === "break"
  ) {
    return;
  }

  timerMotion.manualWalkProgress = wrap01(
    (timerMotion.manualWalkProgress ?? getSmoothWalkProgress()) + delta,
  );
};
