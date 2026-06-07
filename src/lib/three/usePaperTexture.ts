import { useMemo } from "react";
import { useLoader } from "@react-three/fiber";
import * as THREE from "three";

export type PaperTextureSide = "front" | "double";

export interface PaperTextureOptions {
  transparent?: boolean;
  alphaTest?: number;
  side?: PaperTextureSide;
  flipY?: boolean;
}

/**
 * Loads a baked papercraft atlas and returns an unlit MeshBasicMaterial.
 *
 * The papercraft look is baked into the texture itself, so we deliberately use
 * MeshBasicMaterial (no lighting/PBR) to display the art exactly as authored.
 */
export const usePaperTexture = (
  textureUrl: string,
  options: PaperTextureOptions = {},
): THREE.MeshBasicMaterial => {
  const {
    transparent = false,
    alphaTest = 0.6,
    side = "front",
    flipY = false,
  } = options;

  const texture = useLoader(THREE.TextureLoader, textureUrl);

  return useMemo(() => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.flipY = flipY;
    texture.generateMipmaps = false;

    return new THREE.MeshBasicMaterial({
      map: texture,
      transparent,
      alphaTest,
      side: side === "front" ? THREE.FrontSide : THREE.DoubleSide,
    });
  }, [texture, transparent, alphaTest, side, flipY]);
};

usePaperTexture.preload = (url: string) => {
  useLoader.preload(THREE.TextureLoader, url);
};
