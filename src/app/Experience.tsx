import { useCallback, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { ReactLenis, useLenis } from "lenis/react";
import type Lenis from "lenis";
import { Scene } from "../features/papercraftScene/components/Scene";
import { useScrollStore } from "../features/papercraftScene/state/useScrollStore";
import { CHARACTER_WALK, SCROLL_HEIGHT } from "../features/papercraftScene/config";

const BACKGROUND_COLOR = "#f4ead8";

/**
 * Pushes Lenis scroll progress into the scroll store and tracks an `isScrolling`
 * flag (debounced back to idle). Lives inside <ReactLenis> so `useLenis` resolves
 * the instance via context and re-registers once it exists — attaching directly
 * to a forwarded ref misses the instance because ReactLenis sets it after mount.
 */
const ScrollDriver = () => {
  const setScrollProgress = useScrollStore((state) => state.setScrollProgress);
  const setIsScrolling = useScrollStore((state) => state.setIsScrolling);
  const idleTimeout = useRef<ReturnType<typeof setTimeout>>(undefined);

  const handleScroll = useCallback(
    (lenis: Lenis) => {
      setScrollProgress(lenis.progress);
      setIsScrolling(true);
      if (idleTimeout.current) clearTimeout(idleTimeout.current);
      idleTimeout.current = setTimeout(
        () => setIsScrolling(false),
        CHARACTER_WALK.idleDelay,
      );
    },
    [setScrollProgress, setIsScrolling],
  );

  useLenis(handleScroll);
  return null;
};

/**
 * Root experience: smooth infinite scroll (Lenis) drives normalized progress
 * into the scroll store, while a fixed full-viewport Canvas renders the scene.
 * A tall invisible div provides the scroll surface area.
 */
export const Experience = () => {
  return (
    <ReactLenis root options={{ infinite: true, syncTouch: true }}>
      <ScrollDriver />
      <Canvas flat style={{ position: "fixed", inset: 0 }}>
        <color attach="background" args={[BACKGROUND_COLOR]} />
        <Scene />
      </Canvas>
      <div
        aria-hidden
        style={{ height: SCROLL_HEIGHT, width: "100%", pointerEvents: "none" }}
      />
    </ReactLenis>
  );
};
