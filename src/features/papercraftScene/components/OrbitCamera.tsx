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
 * Center-locked camera rig. The camera stays in the middle of the spherical
 * world and rotates to follow the scroll-driven character path.
 */
export const OrbitCamera = () => {
  const { pointer } = useThree();
  const curves = useScrollStore((state) => state.curves);

  const cameraRef = useRef<THREE.PerspectiveCamera>(null);

  const targetLookAt = useRef(new THREE.Vector3());
  const currentLookAt = useRef(new THREE.Vector3());
  const currentPointer = useRef(new THREE.Vector2());
  const isInitialFrame = useRef(true);

  useFrame(() => {
    const camera = cameraRef.current;
    if (!camera) return;

    const { scrollProgress } = useScrollStore.getState();

    curves.movingCharactersCurve.getPointAt(scrollProgress, targetLookAt.current);
    targetLookAt.current.y += CAMERA.characterLookAtOffsetY;

    camera.position.fromArray(CAMERA.centerPosition);

    if (!prefersReducedMotion) {
      currentPointer.current.lerp(pointer, CAMERA.lerpFactor);
      targetLookAt.current.x +=
        currentPointer.current.x * CAMERA.parallaxStrength;
      targetLookAt.current.y +=
        currentPointer.current.y * CAMERA.parallaxStrength;
    }

    if (isInitialFrame.current) {
      currentLookAt.current.copy(targetLookAt.current);
      camera.lookAt(currentLookAt.current);
      isInitialFrame.current = false;
    } else {
      currentLookAt.current.lerp(targetLookAt.current, CAMERA.lerpFactor);
      camera.lookAt(currentLookAt.current);
    }

    const { zoom } = useCameraStore.getState();
    if (camera.zoom !== zoom) {
      camera.zoom = zoom;
      camera.updateProjectionMatrix();
    }
  });

  return (
    <PerspectiveCamera
      makeDefault
      fov={CAMERA.fov}
      ref={cameraRef}
      position={CAMERA.centerPosition}
    />
  );
};
