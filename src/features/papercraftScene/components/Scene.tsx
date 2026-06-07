import { Suspense } from "react";
import { OrbitCamera } from "./OrbitCamera";
import { PaperDiorama } from "./PaperDiorama";
import { WinterBuildings } from "./buildings/WinterBuildings";
import { WinterSchool } from "./buildings/WinterSchool";
import { MovingCharacter } from "../../characters/components/MovingCharacter";

/** Baked winter meshes to hide (the wooden sled on the snow floor). */
const WINTER_HIDDEN_MESHES = [
  "Scene_1_Winter_3_Player",
  "Scene_1_Winter_3_Bird_Baked",
] as const;

/** Composes the 3D scene: camera rig, seasonal dioramas, and the character. */
export const Scene = () => {
  return (
    <>
      <OrbitCamera />
      {/* Soft, shadowless light. Only affects the lit custom buildings; the
          baked dioramas use unlit MeshBasic materials and ignore it. */}
      <ambientLight intensity={0.9} />
      <directionalLight position={[4, 8, 6]} intensity={0.8} />
      <Suspense fallback={null}>
        <PaperDiorama
          modelKey="Scene_1_Winter"
          atlasCount={4}
          excludeMeshes={WINTER_HIDDEN_MESHES}
        />
        <PaperDiorama modelKey="Scene_2_Spring" atlasCount={4} />
        <PaperDiorama modelKey="Scene_3_Summer" atlasCount={4} />
        <PaperDiorama modelKey="Scene_4_Fall" atlasCount={3} />
        <WinterBuildings />
        <WinterSchool />
        <MovingCharacter />
      </Suspense>
    </>
  );
};
