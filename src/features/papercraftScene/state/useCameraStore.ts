import { create } from "zustand";
import { ZOOM } from "../config";

interface CameraState {
  /** Perspective camera zoom factor. */
  zoom: number;
  setZoom: (zoom: number) => void;
}

export const useCameraStore = create<CameraState>((set) => ({
  zoom: ZOOM.initial,
  setZoom: (zoom) => set({ zoom }),
}));
