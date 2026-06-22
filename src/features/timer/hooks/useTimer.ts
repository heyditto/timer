import { useCallback, useEffect, useRef, useState } from "react";
import type { TimerMode, TimerStatus } from "../types";
import { TIMER_TICK_MS } from "../config";
import { syncTimerMotion, timerMotion } from "../state/timerMotion";

export interface TimerController {
  status: TimerStatus;
  /** Total length of the current session in ms. */
  durationMs: number;
  /** Time left in the current session in ms. */
  remainingMs: number;
  /** 0..1 elapsed fraction of the current session. */
  progress: number;
  /** Zero-based index for the active presentation segment. */
  segmentIndex: number;
  /** Number of completed presentation segments. */
  completedSegments: number;
  /** Total number of segments in the current presentation series. */
  totalSegments: number;
  /** Start a fresh session of the given length and mode. */
  start: (minutes: number, mode: TimerMode, totalSegments?: number) => void;
  pause: () => void;
  resume: () => void;
  reset: () => void;
}

/**
 * Single source of truth for timer state. Uses wall-clock timestamps so the
 * countdown stays accurate even if tick callbacks are throttled.
 */
export const useTimer = (): TimerController => {
  const [status, setStatus] = useState<TimerStatus>("idle");
  const [durationMs, setDurationMs] = useState(0);
  const [remainingMs, setRemainingMs] = useState(0);
  const [segmentIndex, setSegmentIndex] = useState(0);
  const [completedSegments, setCompletedSegments] = useState(0);
  const [totalSegments, setTotalSegments] = useState(1);

  const endTimeRef = useRef<number | null>(null);
  const intervalRef = useRef<number | null>(null);
  const modeRef = useRef<TimerMode>("focus");
  const statusRef = useRef<TimerStatus>("idle");
  const durationRef = useRef(0);
  const remainingRef = useRef(0);
  const segmentIndexRef = useRef(0);
  const completedSegmentsRef = useRef(0);
  const totalSegmentsRef = useRef(1);

  const publishMotion = useCallback(() => {
    syncTimerMotion({
      status: statusRef.current,
      durationMs: durationRef.current,
      remainingMs: remainingRef.current,
      endTime: endTimeRef.current,
      segmentIndex: segmentIndexRef.current,
      totalSegments: totalSegmentsRef.current,
      manualWalkProgress: timerMotion.manualWalkProgress,
    });
  }, []);

  const clearTick = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const tick = useCallback(() => {
    if (endTimeRef.current === null) return;
    const remaining = Math.max(0, endTimeRef.current - performance.now());
    remainingRef.current = remaining;
    setRemainingMs(remaining);
    publishMotion();

    if (remaining <= 0) {
      remainingRef.current = 0;
      const nextCompletedSegments = completedSegmentsRef.current + 1;
      completedSegmentsRef.current = nextCompletedSegments;
      setCompletedSegments(nextCompletedSegments);

      if (
        modeRef.current === "focus" &&
        nextCompletedSegments < totalSegmentsRef.current
      ) {
        const nextSegmentIndex = segmentIndexRef.current + 1;
        segmentIndexRef.current = nextSegmentIndex;
        remainingRef.current = durationRef.current;
        endTimeRef.current = performance.now() + durationRef.current;
        setSegmentIndex(nextSegmentIndex);
        setRemainingMs(durationRef.current);
        publishMotion();
        return;
      }

      clearTick();
      endTimeRef.current = null;
      const nextStatus =
        modeRef.current === "break" ? "idle" : "completed";
      statusRef.current = nextStatus;
      setStatus(nextStatus);
      publishMotion();
    }
  }, [clearTick, publishMotion]);

  const startTick = useCallback(() => {
    clearTick();
    intervalRef.current = window.setInterval(tick, TIMER_TICK_MS);
  }, [clearTick, tick]);

  const start = useCallback(
    (minutes: number, mode: TimerMode, segments = 1) => {
      const total = minutes * 60 * 1000;
      const segmentTotal = Math.max(1, Math.floor(segments));
      modeRef.current = mode;
      endTimeRef.current = performance.now() + total;
      durationRef.current = total;
      remainingRef.current = total;
      segmentIndexRef.current = 0;
      completedSegmentsRef.current = 0;
      totalSegmentsRef.current = mode === "focus" ? segmentTotal : 1;
      timerMotion.manualWalkProgress = null;
      statusRef.current = mode === "break" ? "break" : "running";
      setDurationMs(total);
      setRemainingMs(total);
      setSegmentIndex(0);
      setCompletedSegments(0);
      setTotalSegments(totalSegmentsRef.current);
      setStatus(statusRef.current);
      publishMotion();
      startTick();
    },
    [startTick, publishMotion],
  );

  const pause = useCallback(() => {
    if (status !== "running" && status !== "break") return;
    clearTick();
    if (endTimeRef.current !== null) {
      remainingRef.current = Math.max(
        0,
        endTimeRef.current - performance.now(),
      );
      setRemainingMs(remainingRef.current);
    }
    endTimeRef.current = null;
    statusRef.current = "paused";
    setStatus("paused");
    publishMotion();
  }, [status, clearTick, publishMotion]);

  const resume = useCallback(() => {
    if (status !== "paused" || remainingMs <= 0) return;
    endTimeRef.current = performance.now() + remainingMs;
    statusRef.current =
      modeRef.current === "break" ? "break" : "running";
    setStatus(statusRef.current);
    publishMotion();
    startTick();
  }, [status, remainingMs, startTick, publishMotion]);

  const reset = useCallback(() => {
    clearTick();
    endTimeRef.current = null;
    durationRef.current = 0;
    remainingRef.current = 0;
    segmentIndexRef.current = 0;
    completedSegmentsRef.current = 0;
    totalSegmentsRef.current = 1;
    timerMotion.manualWalkProgress = null;
    statusRef.current = "idle";
    setStatus("idle");
    setDurationMs(0);
    setRemainingMs(0);
    setSegmentIndex(0);
    setCompletedSegments(0);
    setTotalSegments(1);
    publishMotion();
  }, [clearTick, publishMotion]);

  useEffect(() => clearTick, [clearTick]);

  const progress =
    durationMs > 0 ? 1 - Math.max(0, remainingMs) / durationMs : 0;

  return {
    status,
    durationMs,
    remainingMs,
    progress,
    segmentIndex,
    completedSegments,
    totalSegments,
    start,
    pause,
    resume,
    reset,
  };
};
