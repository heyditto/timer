import { PaperButton } from "../components/ui/PaperButton";
import { TimerDisplay } from "../features/timer/components/TimerDisplay";
import type { TimerController } from "../features/timer/hooks/useTimer";
import "./Hud.css";

interface HudProps {
  timer: TimerController;
  focusMinutes: number;
  totalSegments: number;
  startLabel: string;
  chimeVolume: number;
  onChimeVolumeChange: (volume: number) => void;
  onPreviewChime: () => void;
}

/**
 * Papercraft overlay: timer readout at the top, transport controls at the bottom.
 */
export const Hud = ({
  timer,
  focusMinutes,
  totalSegments,
  startLabel,
  chimeVolume,
  onChimeVolumeChange,
  onPreviewChime,
}: HudProps) => {
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
          idleRemainingMs={focusMinutes * 60 * 1000}
        />
      </div>

      <div className="hud__bottom hud__interactive">
        {showStart && (
          <div className="hud__start-controls">
            <PaperButton
              variant="primary"
              onClick={() => timer.start(focusMinutes, "focus", totalSegments)}
            >
              {startLabel}
            </PaperButton>

            <div
              className="hud__chime-control"
              aria-label="Chime volume control"
            >
              <label className="hud__chime-label" htmlFor="chime-volume">
                Chime
                <span>{Math.round(chimeVolume * 100)}%</span>
              </label>
              <input
                id="chime-volume"
                className="hud__chime-slider"
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={chimeVolume}
                onChange={(event) =>
                  onChimeVolumeChange(Number(event.currentTarget.value))
                }
                aria-label="Chime volume"
              />
              <PaperButton
                className="hud__chime-preview"
                variant="secondary"
                onClick={onPreviewChime}
                aria-label="Preview completion chime"
                title="Preview completion chime"
              >
                <svg
                  className="hud__chime-icon"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M12 22a2.5 2.5 0 0 0 2.35-1.65h-4.7A2.5 2.5 0 0 0 12 22Z" />
                  <path d="M18 16.5V11a6 6 0 0 0-4.5-5.8V4a1.5 1.5 0 0 0-3 0v1.2A6 6 0 0 0 6 11v5.5l-1.45 1.45A1.2 1.2 0 0 0 5.4 20h13.2a1.2 1.2 0 0 0 .85-2.05L18 16.5Z" />
                </svg>
              </PaperButton>
            </div>
          </div>
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
