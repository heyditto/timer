import { useEffect, useRef, useState } from "react";
import { Experience } from "./app/Experience";
import { Hud } from "./app/Hud";
import { LoadingScreen } from "./components/ui/LoadingScreen";
import {
  PRESENTATION_SEGMENT_COUNT,
  PRESENTATION_SEGMENT_MINUTES,
} from "./features/timer/config";
import { useTimer } from "./features/timer/hooks/useTimer";
import {
  DEFAULT_CHIME_VOLUME,
  playCompletionChime,
} from "./features/timer/utils/playChime";

const App = () => {
  const timer = useTimer();
  const [chimeVolume, setChimeVolume] = useState(DEFAULT_CHIME_VOLUME);
  const previousCompletedSegmentsRef = useRef(timer.completedSegments);

  useEffect(() => {
    if (
      timer.completedSegments > previousCompletedSegmentsRef.current &&
      timer.status !== "idle"
    ) {
      playCompletionChime(chimeVolume);
    }

    previousCompletedSegmentsRef.current = timer.completedSegments;
  }, [chimeVolume, timer.completedSegments, timer.status]);

  return (
    <>
      <Experience />
      <Hud
        timer={timer}
        focusMinutes={PRESENTATION_SEGMENT_MINUTES}
        totalSegments={PRESENTATION_SEGMENT_COUNT}
        startLabel="Start Timer"
        chimeVolume={chimeVolume}
        onChimeVolumeChange={setChimeVolume}
        onPreviewChime={() => playCompletionChime(chimeVolume)}
      />
      <LoadingScreen />
    </>
  );
};

export default App;
