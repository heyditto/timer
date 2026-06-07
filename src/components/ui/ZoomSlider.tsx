import type { ChangeEvent } from "react";
import { useCameraStore } from "../../features/papercraftScene/state/useCameraStore";
import { ZOOM } from "../../features/papercraftScene/config";
import "./ZoomSlider.css";

const MinusIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" d="M5 12h14" />
  </svg>
);

const PlusIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" d="M12 5v14M5 12h14" />
  </svg>
);

/** Paper-styled zoom control bound to the camera store. */
export const ZoomSlider = () => {
  const zoom = useCameraStore((state) => state.zoom);
  const setZoom = useCameraStore((state) => state.setZoom);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setZoom(parseFloat(event.target.value));
  };

  return (
    <div className="zoom-slider">
      <span className="zoom-slider__icon" aria-hidden>
        <MinusIcon />
      </span>
      <input
        className="zoom-slider__input"
        type="range"
        min={ZOOM.min}
        max={ZOOM.max}
        step={ZOOM.step}
        value={zoom}
        onChange={handleChange}
        aria-label="Camera zoom"
      />
      <span className="zoom-slider__icon" aria-hidden>
        <PlusIcon />
      </span>
    </div>
  );
};
