import type * as THREE from "three";

/** Named curves sampled by scroll progress each frame. */
export interface SceneCurves {
  /** Path the camera position rides around the diorama. */
  cameraPathCurve: THREE.CatmullRomCurve3;
  /** Path the camera look-at target rides. */
  cameraLookAtCurve: THREE.CatmullRomCurve3;
  /** Path the central character travels along. */
  movingCharactersCurve: THREE.CatmullRomCurve3;
}
