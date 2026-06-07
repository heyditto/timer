import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";
import { useScrollStore } from "../state/useScrollStore";
import { useCameraStore } from "../state/useCameraStore";
import { CAMERA } from "../config";

const prefersReducedMotion =
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Scroll-driven camera rig. A `cameraGroup` rides the orbit/look-at curves so it
 * revolves around the centered target, while a nested PerspectiveCamera adds
 * subtle mouse parallax on top. Adapted from the spline rig in the credited
 * source project.
 */
export const OrbitCamera = () => {
  const { pointer } = useThree();
  const curves = useScrollStore((state) => state.curves);

  const cameraGroupRef = useRef<THREE.Group>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);

  const targetPosition = useRef(new THREE.Vector3());
  const targetLookAt = useRef(new THREE.Vector3());
  const currentLookAt = useRef(new THREE.Vector3());
  const currentPointer = useRef(new THREE.Vector2());
  const isInitialFrame = useRef(true);

  useFrame(() => {
    const group = cameraGroupRef.current;
    const camera = cameraRef.current;
    if (!group || !camera) return;

    const { scrollProgress } = useScrollStore.getState();

    curves.cameraPathCurve.getPointAt(scrollProgress, targetPosition.current);
    curves.cameraLookAtCurve.getPointAt(scrollProgress, targetLookAt.current);

    if (isInitialFrame.current) {
      group.position.copy(targetPosition.current);
      currentLookAt.current.copy(targetLookAt.current);
      group.lookAt(currentLookAt.current);
      // Match the original: the nested camera faces "outward" along the path.
      camera.rotation.set(0, CAMERA.baseYaw, 0);
      isInitialFrame.current = false;
    } else {
      group.position.lerp(targetPosition.current, CAMERA.lerpFactor);
      currentLookAt.current.lerp(targetLookAt.current, CAMERA.lerpFactor);
      group.lookAt(currentLookAt.current);
    }

    if (!prefersReducedMotion) {
      currentPointer.current.lerp(pointer, CAMERA.lerpFactor);
      camera.position.set(
        currentPointer.current.x * CAMERA.parallaxStrength,
        currentPointer.current.y * CAMERA.parallaxStrength,
        0,
      );
      camera.rotation.set(
        -currentPointer.current.y * CAMERA.parallaxStrength,
        -currentPointer.current.x * CAMERA.parallaxStrength + CAMERA.baseYaw,
        0,
      );
    }

    const { zoom } = useCameraStore.getState();
    if (camera.zoom !== zoom) {
      camera.zoom = zoom;
      camera.updateProjectionMatrix();
    }
  });

  return (
    <group ref={cameraGroupRef}>
      <PerspectiveCamera makeDefault fov={CAMERA.fov} ref={cameraRef} />
    </group>
  );
};
