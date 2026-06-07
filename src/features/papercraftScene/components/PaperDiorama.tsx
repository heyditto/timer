import { useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import { useLoader } from "@react-three/fiber";
import * as THREE from "three";

interface PaperDioramaProps {
  /** GLB/texture base name, e.g. "Scene_1_Winter". */
  modelKey: string;
  /** Number of baked texture atlases for this scene (1..4). */
  atlasCount: number;
  /** Exact mesh node names to hide from this scene. */
  excludeMeshes?: readonly string[];
}

/**
 * Builds an unlit MeshBasicMaterial for a baked atlas. DoubleSide keeps flat
 * paper cutouts visible as the camera revolves around them.
 */
const makeMaterial = (texture: THREE.Texture): THREE.MeshBasicMaterial => {
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.flipY = false;
  texture.generateMipmaps = false;
  return new THREE.MeshBasicMaterial({
    map: texture,
    alphaTest: 0.6,
    side: THREE.DoubleSide,
  });
};

/**
 * Renders a whole seasonal diorama GLB at its authored transforms, assigning
 * each mesh the baked atlas implied by its `{modelKey}_{layer}_...` node name.
 * This brings over the original foreground/background layers generically without
 * hand-porting every mesh.
 */
export const PaperDiorama = ({
  modelKey,
  atlasCount,
  excludeMeshes,
}: PaperDioramaProps) => {
  const gltf = useGLTF(`/models/${modelKey}-transformed.glb`);

  const atlasUrls = useMemo(
    () =>
      Array.from(
        { length: atlasCount },
        (_, i) => `/textures/${modelKey}_${i + 1}.webp`,
      ),
    [modelKey, atlasCount],
  );
  const textures = useLoader(THREE.TextureLoader, atlasUrls);

  const scene = useMemo(() => {
    const cloned = gltf.scene.clone(true);
    const materials = (textures as THREE.Texture[]).map(makeMaterial);
    const layerRegex = new RegExp(`${modelKey}_([1-${atlasCount}])`);

    cloned.traverse((object) => {
      const mesh = object as THREE.Mesh;
      if (!mesh.isMesh) return;
      if (excludeMeshes?.some((name) => mesh.name === name)) {
        mesh.visible = false;
        return;
      }
      const match = mesh.name.match(layerRegex);
      const index = match ? Number(match[1]) - 1 : 0;
      mesh.material = materials[index] ?? materials[0];
      mesh.frustumCulled = false;
    });

    return cloned;
  }, [gltf, textures, modelKey, atlasCount, excludeMeshes]);

  return <primitive object={scene} />;
};
