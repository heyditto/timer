import { useCallback, useEffect, useRef, useState } from "react";
import type { TimerMode, TimerStatus } from "../types";
import { TIMER_TICK_MS } from "../config";

export interface TimerController {
  status: TimerStatus;
  /** Total length of the current session in ms. */
  durationMs: number;
  /** Time left in the current session in ms. */
  remainingMs: number;
  /** 0..1 elapsed fraction of the current session. */
  progress: number;
  /** Start a fresh session of the given length and mode. */
  start: (minutes: number, mode: TimerMode) => void;
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

  const endTimeRef = useRef<number | null>(null);
  const intervalRef = useRef<number | null>(null);
  const modeRef = useRef<TimerMode>("focus");

  const clearTick = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const tick = useCallback(() => {
    if (endTimeRef.current === null) return;
    const remaining = Math.max(0, endTimeRef.current - performance.now());
    setRemainingMs(remaining);

    if (remaining <= 0) {
      clearTick();
      endTimeRef.current = null;
      setStatus(modeRef.current === "break" ? "idle" : "completed");
    }
  }, [clearTick]);

  const startTick = useCallback(() => {
    clearTick();
    intervalRef.current = window.setInterval(tick, TIMER_TICK_MS);
  }, [clearTick, tick]);

  const start = useCallback(
    (minutes: number, mode: TimerMode) => {
      const total = minutes * 60 * 1000;
      modeRef.current = mode;
      endTimeRef.current = performance.now() + total;
      setDurationMs(total);
      setRemainingMs(total);
      setStatus(mode === "break" ? "break" : "running");
      startTick();
    },
    [startTick],
  );

  const pause = useCallback(() => {
    if (status !== "running" && status !== "break") return;
    clearTick();
    if (endTimeRef.current !== null) {
      setRemainingMs(Math.max(0, endTimeRef.current - performance.now()));
    }
    endTimeRef.current = null;
    setStatus("paused");
  }, [status, clearTick]);

  const resume = useCallback(() => {
    if (status !== "paused" || remainingMs <= 0) return;
    endTimeRef.current = performance.now() + remainingMs;
    setStatus(modeRef.current === "break" ? "break" : "running");
    startTick();
  }, [status, remainingMs, startTick]);

  const reset = useCallback(() => {
    clearTick();
    endTimeRef.current = null;
    setStatus("idle");
    setDurationMs(0);
    setRemainingMs(0);
  }, [clearTick]);

  useEffect(() => clearTick, [clearTick]);

  const progress =
    durationMs > 0 ? 1 - Math.max(0, remainingMs) / durationMs : 0;

  return {
    status,
    durationMs,
    remainingMs,
    progress,
    start,
    pause,
    resume,
    reset,
  };
};
