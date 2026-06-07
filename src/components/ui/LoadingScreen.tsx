import { useEffect, useState } from "react";
import { useProgress } from "@react-three/drei";
import "./LoadingScreen.css";

/**
 * Full-screen papercraft loading overlay. Reads asset load progress from drei's
 * global loader store and fades out once everything is ready.
 */
export const LoadingScreen = () => {
  const { progress, active } = useProgress();
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    if (!active && progress >= 100) {
      const timeout = window.setTimeout(() => setHidden(true), 700);
      return () => window.clearTimeout(timeout);
    }
  }, [active, progress]);

  if (hidden) return null;

  const isDone = !active && progress >= 100;

  return (
    <div
      className={`loading-screen${isDone ? " loading-screen--done" : ""}`}
      role="status"
      aria-live="polite"
    >
      <div className="loading-screen__card">
        <h1 className="loading-screen__title">Papercraft Timer</h1>
        <p className="loading-screen__subtitle">Folding the paper world…</p>
        <div className="loading-screen__bar">
          <div
            className="loading-screen__fill"
            style={{ width: `${Math.min(100, Math.round(progress))}%` }}
          />
        </div>
        <span className="loading-screen__percent">
          {Math.min(100, Math.round(progress))}%
        </span>
      </div>
    </div>
  );
};
