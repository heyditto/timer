import { Experience } from "./app/Experience";
import { Hud } from "./app/Hud";
import { LoadingScreen } from "./components/ui/LoadingScreen";
import {
  PRESENTATION_SEGMENT_COUNT,
  PRESENTATION_SEGMENT_MINUTES,
} from "./features/timer/config";
import { useTimer } from "./features/timer/hooks/useTimer";

const App = () => {
  const timer = useTimer();

  return (
    <>
      <Experience />
      <Hud
        timer={timer}
        focusMinutes={PRESENTATION_SEGMENT_MINUTES}
        totalSegments={PRESENTATION_SEGMENT_COUNT}
        startLabel="Start Timer"
      />
      <LoadingScreen />
    </>
  );
};

export default App;
