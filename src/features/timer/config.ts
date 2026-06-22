import type { TimerPreset } from "./types";

export const TIMER_PRESETS: TimerPreset[] = [
  { label: "5min Timer", minutes: 5, mode: "focus" },
];

export const PRESENTATION_SEGMENT_MINUTES = 5;
export const PRESENTATION_SEGMENT_COUNT = 5;

/** How often the countdown re-reads the clock (ms). */
export const TIMER_TICK_MS = 200;
