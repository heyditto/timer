import * as THREE from "three";
import {
  cameraLookAtCurveData,
  cameraPathCurveData,
  movingCharactersCurveData,
  type CurveDefinition,
} from "./curveData";
import type { SceneCurves } from "../types";

/** Builds a closed Catmull-Rom curve, rotating points to honor `startIndex`. */
const buildCurve = (data: CurveDefinition): THREE.CatmullRomCurve3 => {
  let points = data.points.map(([x, y, z]) => new THREE.Vector3(x, y, z));

  if (data.startIndex > 0 && data.startIndex < points.length) {
    points = [
      ...points.slice(data.startIndex),
      ...points.slice(0, data.startIndex),
    ];
  }

  const curve = new THREE.CatmullRomCurve3(points);
  curve.closed = data.closed;
  return curve;
};

/**
 * Creates the camera and character curves from the authored point data so the
 * camera revolves through the seasonal diorama while following the character.
 */
export const createCurves = (): SceneCurves => ({
  cameraPathCurve: buildCurve(cameraPathCurveData),
  cameraLookAtCurve: buildCurve(cameraLookAtCurveData),
  movingCharactersCurve: buildCurve(movingCharactersCurveData),
});
