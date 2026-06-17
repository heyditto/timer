import { useLayoutEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { usePaperTexture } from "../../../lib/three/usePaperTexture";
import { useScrollStore } from "../../papercraftScene/state/useScrollStore";
import { CHARACTER, CHARACTER_WALK } from "../../papercraftScene/config";

const MODEL_URL = "/models/Moving_Characters-transformed.glb";
const ATLAS_URL = "/textures/Moving_Characters_1.webp";

/** Winter front-facing meshes shown while the character stands idle. */
const FRONT_POSE_NODES = [
  "Moving_Characters_Winter_arm_left_front",
  "Moving_Characters_Winter_arm_right_front",
  "Moving_Characters_Winter_front_character",
  "Moving_Characters_Winter_Front_Smile",
  "Moving_Characters_Winter_front_smile_face",
  "Moving_Characters_Winter_head_front",
] as const;

type GLTFNodes = Record<string, THREE.Mesh>;

const prefersReducedMotion =
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * The central character the camera follows. It travels the moving-characters
 * curve by scroll progress, oriented along the path, with a gentle idle bob.
 *
 * While the user scrolls it swaps from the front idle pose to a side-facing
 * walking pose: arms and feet swing in stride, the side face switches to a
 * smile, and the pose settles back to front once scrolling stops. The cluster
 * is auto-centered (from the front pose) so it sits on the curve regardless of
 * GLB offset. Reduced-motion users keep the static front pose.
 */
export const MovingCharacter = () => {
  const { nodes } = useGLTF(MODEL_URL) as unknown as { nodes: GLTFNodes };
  const material = usePaperTexture(ATLAS_URL, { side: "double" });
  const curves = useScrollStore((state) => state.curves);

  const groupRef = useRef<THREE.Group>(null);
  const centerRef = useRef<THREE.Group>(null);
  const bobRef = useRef<THREE.Group>(null);

  const frontPoseRef = useRef<THREE.Group>(null);
  const sidePoseRef = useRef<THREE.Group>(null);

  const leftArmRef = useRef<THREE.Mesh>(null);
  const rightArmRef = useRef<THREE.Mesh>(null);
  const leftFootRef = useRef<THREE.Mesh>(null);
  const rightFootRef = useRef<THREE.Mesh>(null);
  const sideFaceRef = useRef<THREE.Mesh>(null);
  const sideSmileFaceRef = useRef<THREE.Mesh>(null);

  const targetPosition = useRef(new THREE.Vector3());
  const lookAtTarget = useRef(new THREE.Vector3());
  const upVector = useRef(new THREE.Vector3(0, 1, 0));
  const previousProgress = useRef(0);

  useLayoutEffect(() => {
    const front = frontPoseRef.current;
    const center = centerRef.current;
    if (!front || !center) return;
    // Center on the front pose so existing framing is preserved; the side pose
    // shares the same local origin and rides along.
    const box = new THREE.Box3().setFromObject(front);
    const middle = new THREE.Vector3();
    box.getCenter(middle);
    center.position.set(-middle.x, -middle.y, -middle.z);
  }, []);

  useFrame((state) => {
    const group = groupRef.current;
    if (!group) return;

    const { scrollProgress, isScrolling } = useScrollStore.getState();
    const curve = curves.movingCharactersCurve;

    curve.getPointAt(scrollProgress, targetPosition.current);
    const tangent = curve.getTangentAt(scrollProgress);

    // Snap across the infinite-scroll wrap to avoid a long lerp across the loop.
    const wrapped =
      Math.abs(scrollProgress - previousProgress.current) > 0.5;
    if (wrapped) {
      group.position.copy(targetPosition.current);
    } else {
      group.position.lerp(targetPosition.current, CHARACTER.lerpFactor);
    }

    lookAtTarget.current
      .copy(targetPosition.current)
      .add(lookAtTarget.current.crossVectors(tangent, upVector.current));
    group.lookAt(lookAtTarget.current);

    if (bobRef.current && !prefersReducedMotion) {
      bobRef.current.position.y =
        Math.sin(state.clock.elapsedTime * CHARACTER.bobSpeed) *
        CHARACTER.bobAmplitude;
    }

    // Walking behavior is the moving, motion-heavy part — skip when reduced.
    const walking = isScrolling && !prefersReducedMotion;

    const front = frontPoseRef.current;
    const side = sidePoseRef.current;
    if (front && side) {
      // Slide the inactive pose out of view; the active pose slides up to 0.
      const frontTarget = walking ? CHARACTER_WALK.hiddenOffsetY : 0;
      const sideTarget = walking ? 0 : CHARACTER_WALK.hiddenOffsetY;
      front.position.y = THREE.MathUtils.lerp(
        front.position.y,
        frontTarget,
        CHARACTER_WALK.poseLerp,
      );
      side.position.y = THREE.MathUtils.lerp(
        side.position.y,
        sideTarget,
        CHARACTER_WALK.poseLerp,
      );
    }

    // Swing limbs in stride with scroll progress (frozen when not scrolling).
    const swing =
      Math.sin(scrollProgress * CHARACTER_WALK.swingFrequency) *
      CHARACTER_WALK.swingAmplitude;
    if (leftArmRef.current)
      leftArmRef.current.rotation.z =
        nodes.Moving_Characters_Winter_left_arm.rotation.z + swing;
    if (rightArmRef.current)
      rightArmRef.current.rotation.z =
        nodes.Moving_Characters_Winter_right_arm.rotation.z - swing;
    if (leftFootRef.current)
      leftFootRef.current.rotation.z =
        nodes.Moving_Characters_Winter_left_foot.rotation.z + swing;
    if (rightFootRef.current)
      rightFootRef.current.rotation.z =
        nodes.Moving_Characters_Winter_right_foot.rotation.z - swing;

    // Smiling side face while actively walking, neutral side face otherwise.
    if (sideFaceRef.current) sideFaceRef.current.visible = !walking;
    if (sideSmileFaceRef.current) sideSmileFaceRef.current.visible = walking;

    previousProgress.current = scrollProgress;
  });

  return (
    <group ref={groupRef}>
      <group ref={centerRef}>
        <group ref={bobRef}>
          <group ref={frontPoseRef}>
            {FRONT_POSE_NODES.map((name) => {
              const node = nodes[name];
              if (!node) return null;
              return (
                <mesh
                  key={name}
                  geometry={node.geometry}
                  material={material}
                  position={node.position}
                  rotation={node.rotation}
                  scale={node.scale}
                />
              );
            })}
          </group>

          <group
            ref={sidePoseRef}
            position={[0, CHARACTER_WALK.hiddenOffsetY, 0]}
          >
            <mesh
              geometry={nodes.Moving_Characters_Winter_side.geometry}
              material={material}
              position={nodes.Moving_Characters_Winter_side.position}
            />
            <mesh
              ref={leftArmRef}
              geometry={nodes.Moving_Characters_Winter_left_arm.geometry}
              material={material}
              position={nodes.Moving_Characters_Winter_left_arm.position}
            />
            <mesh
              ref={rightArmRef}
              geometry={nodes.Moving_Characters_Winter_right_arm.geometry}
              material={material}
              position={nodes.Moving_Characters_Winter_right_arm.position}
            />
            <mesh
              ref={leftFootRef}
              geometry={nodes.Moving_Characters_Winter_left_foot.geometry}
              material={material}
              position={nodes.Moving_Characters_Winter_left_foot.position}
            />
            <mesh
              ref={rightFootRef}
              geometry={nodes.Moving_Characters_Winter_right_foot.geometry}
              material={material}
              position={nodes.Moving_Characters_Winter_right_foot.position}
            />
            <mesh
              ref={sideFaceRef}
              geometry={nodes.Moving_Characters_Winter_side_face.geometry}
              material={material}
              position={nodes.Moving_Characters_Winter_side_face.position}
            />
            <mesh
              ref={sideSmileFaceRef}
              visible={false}
              geometry={nodes.Moving_Characters_Winter_side_face_smile.geometry}
              material={material}
              position={
                nodes.Moving_Characters_Winter_side_face_smile.position
              }
            />
          </group>
        </group>
      </group>
    </group>
  );
};

useGLTF.preload(MODEL_URL);
usePaperTexture.preload(ATLAS_URL);
