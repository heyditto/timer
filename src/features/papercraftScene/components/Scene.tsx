import { Suspense } from "react";
import { OrbitCamera } from "./OrbitCamera";
import { SphericalWorld } from "./SphericalWorld";
import { WinterBuildings } from "./buildings/WinterBuildings";
import { WinterSchool } from "./buildings/WinterSchool";
import { MovingCharacter } from "../../characters/components/MovingCharacter";

/** Composes the 3D scene: camera rig, native world, buildings, and character. */
export const Scene = () => {
  return (
    <>
      <OrbitCamera />
      {/* Soft, shadowless light. Only affects the lit custom buildings; the
          baked dioramas use unlit MeshBasic materials and ignore it. */}
      <ambientLight intensity={0.9} />
      <directionalLight position={[4, 8, 6]} intensity={0.8} />
      <Suspense fallback={null}>
        <SphericalWorld />
        <WinterBuildings />
        <WinterSchool />
        <MovingCharacter />
      </Suspense>
    </>
  );
};
