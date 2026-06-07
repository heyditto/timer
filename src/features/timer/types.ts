export type TimerStatus =
  | "idle"
  | "running"
  | "paused"
  | "completed"
  | "break";

export type TimerMode = "focus" | "break";

export interface TimerPreset {
  label: string;
  minutes: number;
  mode: TimerMode;
}
