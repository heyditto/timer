import { Experience } from "./app/Experience";
import { Hud } from "./app/Hud";
import { LoadingScreen } from "./components/ui/LoadingScreen";
import { useTimer } from "./features/timer/hooks/useTimer";

const App = () => {
  const timer = useTimer();

  return (
    <>
      <Experience />
      <Hud timer={timer} focusMinutes={5} startLabel="5min Timer" />
      <LoadingScreen />
    </>
  );
};

export default App;
