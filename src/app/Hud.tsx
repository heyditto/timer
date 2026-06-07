import { useTimer } from "../features/timer/hooks/useTimer";
import { TimerDisplay } from "../features/timer/components/TimerDisplay";
import { TimerControls } from "../features/timer/components/TimerControls";
import { ZoomSlider } from "../components/ui/ZoomSlider";
import "./Hud.css";

/**
 * DOM overlay above the 3D canvas: timer readout, controls, and zoom. The
 * wrapper is click-through so scroll still reaches the canvas; interactive
 * elements opt back into pointer events.
 */
export const Hud = () => {
  const timer = useTimer();

  return (
    <div className="hud">
      <div className="hud__top hud__interactive">
        <TimerDisplay
          status={timer.status}
          remainingMs={timer.remainingMs}
          progress={timer.progress}
        />
      </div>

      <div className="hud__bottom">
        <div className="hud__interactive">
          <TimerControls
            status={timer.status}
            start={timer.start}
            pause={timer.pause}
            resume={timer.resume}
            reset={timer.reset}
          />
        </div>
        <div className="hud__zoom hud__interactive">
          <ZoomSlider />
        </div>
      </div>
    </div>
  );
};
