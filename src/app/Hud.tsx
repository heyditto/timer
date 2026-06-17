import { PaperButton } from "../components/ui/PaperButton";
import { TimerDisplay } from "../features/timer/components/TimerDisplay";
import type { TimerController } from "../features/timer/hooks/useTimer";
import "./Hud.css";

interface HudProps {
  timer: TimerController;
  focusMinutes: number;
  startLabel: string;
}

/**
 * Papercraft overlay: timer readout at the top, transport controls at the bottom.
 */
export const Hud = ({ timer, focusMinutes, startLabel }: HudProps) => {
  const showStart = timer.status === "idle" || timer.status === "completed";
  const showTransport =
    timer.status === "running" ||
    timer.status === "paused" ||
    timer.status === "break";

  return (
    <div className="hud">
      <div className="hud__top hud__interactive">
        <TimerDisplay
          status={timer.status}
          remainingMs={timer.remainingMs}
          progress={timer.progress}
        />
      </div>

      <div className="hud__bottom hud__interactive">
        {showStart && (
          <PaperButton
            variant="primary"
            onClick={() => timer.start(focusMinutes, "focus")}
          >
            {startLabel}
          </PaperButton>
        )}

        {showTransport && (
          <div className="hud__transport">
            {timer.status === "running" || timer.status === "break" ? (
              <PaperButton variant="secondary" onClick={() => timer.pause()}>
                Pause
              </PaperButton>
            ) : (
              <PaperButton variant="primary" onClick={() => timer.resume()}>
                Resume
              </PaperButton>
            )}
            <PaperButton variant="ghost" onClick={() => timer.reset()}>
              Stop
            </PaperButton>
          </div>
        )}
      </div>
    </div>
  );
};
