import { create } from "zustand";
import { createCurves } from "../curves/createCurves";
import type { SceneCurves } from "../types";

interface ScrollState {
  /** Camera curves, created once at store init. */
  curves: SceneCurves;
  /** Normalized scroll progress (0..1) driven by Lenis. */
  scrollProgress: number;
  /** True while the user is actively scrolling (debounced by the driver). */
  isScrolling: boolean;
  setScrollProgress: (value: number) => void;
  setIsScrolling: (value: boolean) => void;
}

export const useScrollStore = create<ScrollState>((set) => ({
  curves: createCurves(),
  scrollProgress: 0,
  isScrolling: false,
  setScrollProgress: (value) => set({ scrollProgress: value }),
  setIsScrolling: (value) => set({ isScrolling: value }),
}));
