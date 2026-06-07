import { Experience } from "./app/Experience";
import { Hud } from "./app/Hud";
import { LoadingScreen } from "./components/ui/LoadingScreen";

const App = () => {
  return (
    <>
      <Experience />
      <Hud />
      <LoadingScreen />
    </>
  );
};

export default App;
