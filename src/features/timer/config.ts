import type { TimerPreset } from "./types";

export const TIMER_PRESETS: TimerPreset[] = [
  { label: "Demo 5min", minutes: 5, mode: "focus" },
];

/** How often the countdown re-reads the clock (ms). */
export const TIMER_TICK_MS = 200;
