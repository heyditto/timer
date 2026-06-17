import * as THREE from "three";
import type { SceneCurves } from "../types";

const PROCEDURAL_CURVES = {
  segments: 24,
  startAngle: -Math.PI / 2,
  characterRadius: 8.6,
  characterY: 0.28,
  cameraRadius: 10.8,
  cameraY: 2.45,
  lookAtRadius: 7.2,
  lookAtY: 1.12,
} as const;

const createRingPoints = ({
  radius,
  y,
  angleOffset = 0,
}: {
  radius: number;
  y: number;
  angleOffset?: number;
}) =>
  Array.from({ length: PROCEDURAL_CURVES.segments }, (_, index) => {
    const angle =
      PROCEDURAL_CURVES.startAngle +
      angleOffset +
      (index / PROCEDURAL_CURVES.segments) * Math.PI * 2;

    return new THREE.Vector3(
      Math.cos(angle) * radius,
      y,
      Math.sin(angle) * radius,
    );
  });

/** Builds a closed Catmull-Rom ring for the native spherical stage. */
const buildCurve = (points: THREE.Vector3[]): THREE.CatmullRomCurve3 => {
  const curve = new THREE.CatmullRomCurve3(points);
  curve.closed = true;
  return curve;
};

/**
 * Creates native camera and character curves for the procedural spherical stage.
 * Camera curves are retained for the shared SceneCurves contract; the active
 * centered camera samples the character curve as its rotating look-at target.
 */
export const createCurves = (): SceneCurves => ({
  cameraPathCurve: buildCurve(
    createRingPoints({
      radius: PROCEDURAL_CURVES.cameraRadius,
      y: PROCEDURAL_CURVES.cameraY,
    }),
  ),
  cameraLookAtCurve: buildCurve(
    createRingPoints({
      radius: PROCEDURAL_CURVES.lookAtRadius,
      y: PROCEDURAL_CURVES.lookAtY,
    }),
  ),
  movingCharactersCurve: buildCurve(
    createRingPoints({
      radius: PROCEDURAL_CURVES.characterRadius,
      y: PROCEDURAL_CURVES.characterY,
    }),
  ),
});
