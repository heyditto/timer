import { formatTime } from "../utils/formatTime";
import type { TimerStatus } from "../types";
import "./TimerDisplay.css";

interface TimerDisplayProps {
  status: TimerStatus;
  remainingMs: number;
  progress: number;
  idleRemainingMs: number;
}

const STATUS_LABEL: Record<TimerStatus, string> = {
  idle: "Ready when you are",
  running: "Presenting",
  paused: "Paused",
  completed: "Time's up!",
  break: "On a break",
};

/** Reads out the current session time and status. */
export const TimerDisplay = ({
  status,
  remainingMs,
  progress,
  idleRemainingMs,
}: TimerDisplayProps) => {
  const time = status === "idle" ? formatTime(idleRemainingMs) : formatTime(remainingMs);

  return (
    <div className={`timer-display timer-display--${status}`}>
      <span className="timer-display__label">{STATUS_LABEL[status]}</span>
      <time className="timer-display__time" aria-live="polite">
        {time}
      </time>
      <div className="timer-display__ribbon" aria-hidden>
        <div
          className="timer-display__ribbon-fill"
          style={{ width: `${Math.round(progress * 100)}%` }}
        />
      </div>
    </div>
  );
};
