import { PaperButton } from "../../../components/ui/PaperButton";
import { TIMER_PRESETS } from "../config";
import type { TimerController } from "../hooks/useTimer";
import "./TimerControls.css";

type TimerControlsProps = Pick<
  TimerController,
  "status" | "start" | "pause" | "resume" | "reset"
>;

/** Adaptive controls: presets when idle/done, transport buttons while active. */
export const TimerControls = ({
  status,
  start,
  pause,
  resume,
  reset,
}: TimerControlsProps) => {
  const showPresets = status === "idle" || status === "completed";

  return (
    <div className="timer-controls">
      {showPresets && (
        <div className="timer-controls__presets">
          {TIMER_PRESETS.map((preset) => (
            <PaperButton
              key={preset.label}
              variant={preset.mode === "break" ? "secondary" : "primary"}
              onClick={() => start(preset.minutes, preset.mode)}
            >
              {preset.label}
            </PaperButton>
          ))}
        </div>
      )}

      {(status === "running" || status === "break") && (
        <div className="timer-controls__transport">
          <PaperButton variant="primary" onClick={pause}>
            Pause
          </PaperButton>
          <PaperButton variant="ghost" onClick={reset}>
            Reset
          </PaperButton>
        </div>
      )}

      {status === "paused" && (
        <div className="timer-controls__transport">
          <PaperButton variant="primary" onClick={resume}>
            Resume
          </PaperButton>
          <PaperButton variant="ghost" onClick={reset}>
            Reset
          </PaperButton>
        </div>
      )}
    </div>
  );
};
