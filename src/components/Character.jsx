import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'
import { getSmoothWalkProgress, timerMotion } from '../features/timer/state/timerMotion'

const ARENA_CENTER = new THREE.Vector3(0, 0, 0.001)
const ARENA_RADIUS = 8.955
const START_ANGLE = Math.PI
const ORBIT_TURNS = 1
// GLB spawn orientation already faces the camera at START_ANGLE with zero Y rotation.
const FACE_CAMERA_OFFSET = -Math.PI / 2

/** Orbit speed is controlled by the timer duration in App.jsx. */
const BASE_WALK_CYCLES_PER_SECOND = 1.1

/**
 * Master multiplier for arm/leg/body animation rate only.
 * Higher = faster steps. Does not change how fast Jon moves around the arena.
 */
const WALK_ANIMATION_SPEED = 1.5

/** Fine-tune individual parts (1 = use master speed as-is). */
const ARM_ANIMATION_SPEED = 1
const LEG_ANIMATION_SPEED = 1
const BODY_ANIMATION_SPEED = 1

/** How far limbs and body move — amplitude, not speed. */
const ARM_SWING = 0.32
const LEG_SWING = 0.42
const BODY_BOB = 0.08
const BODY_TILT = 0.08

const baseBodyPosition = [1.452, 0.691, -0.817]
const baseBodyRotation = [-Math.PI / 2, 0, Math.PI / 2]
const baseLeftArmRotation = [-Math.PI / 2, 0, Math.PI / 2]
const baseRightArmRotation = [-Math.PI / 2, 0, Math.PI / 2]
const baseLeftLegRotation = [-Math.PI / 2, 0, Math.PI / 2]
const baseRightLegRotation = [-Math.PI / 2, 0, Math.PI / 2]

const clamp01 = (value) => THREE.MathUtils.clamp(value, 0, 1)

export function getCharacterAngle(scrollProgress) {
  const progress = clamp01(scrollProgress)
  return START_ANGLE + progress * Math.PI * 2 * ORBIT_TURNS
}

export function getCharacterPosition(scrollProgress) {
  const angle = getCharacterAngle(scrollProgress)
  return new THREE.Vector3(
    ARENA_CENTER.x + ARENA_RADIUS * Math.cos(angle),
    0,
    ARENA_CENTER.z + ARENA_RADIUS * Math.sin(angle),
  )
}

export { ARENA_CENTER, ARENA_RADIUS }

function getCharacterFacingY(position, cameraPosition) {
  const dx = cameraPosition.x - position.x
  const dz = cameraPosition.z - position.z
  return Math.atan2(dx, dz) + FACE_CAMERA_OFFSET
}

export function Character({ nodes, materials }) {
  const orbitRef = useRef()
  const faceRef = useRef()
  const bodyRef = useRef()
  const leftArmRef = useRef()
  const rightArmRef = useRef()
  const leftLegRef = useRef()
  const rightLegRef = useRef()
  const cameraTarget = useRef(new THREE.Vector3())
  const walkPhaseRef = useRef(0)
  const previousTimerStatusRef = useRef(timerMotion.status)

  useFrame(({ camera }, delta) => {
    const progress = getSmoothWalkProgress()
    const position = getCharacterPosition(progress)
    const { status } = timerMotion

    if (
      status === 'running' &&
      (previousTimerStatusRef.current === 'idle' ||
        previousTimerStatusRef.current === 'completed')
    ) {
      walkPhaseRef.current = 0
    }

    if (status === 'running') {
      walkPhaseRef.current +=
        delta *
        BASE_WALK_CYCLES_PER_SECOND *
        WALK_ANIMATION_SPEED *
        Math.PI *
        2
    } else if (status === 'idle') {
      walkPhaseRef.current = 0
    }

    previousTimerStatusRef.current = status

    const armPhase = walkPhaseRef.current * ARM_ANIMATION_SPEED
    const legPhase = walkPhaseRef.current * LEG_ANIMATION_SPEED
    const bodyPhase = walkPhaseRef.current * BODY_ANIMATION_SPEED
    const legWalk = Math.sin(legPhase)
    const legCounterWalk = Math.sin(legPhase + Math.PI)
    const armWalk = Math.sin(armPhase)
    const armCounterWalk = Math.sin(armPhase + Math.PI)
    const bob = Math.abs(Math.sin(bodyPhase)) * BODY_BOB
    const tilt = Math.sin(bodyPhase) * BODY_TILT

    if (orbitRef.current) {
      orbitRef.current.position.copy(position)
    }

    if (faceRef.current) {
      cameraTarget.current.set(camera.position.x, position.y, camera.position.z)
      faceRef.current.rotation.y = getCharacterFacingY(position, cameraTarget.current)
    }

    if (bodyRef.current) {
      bodyRef.current.position.y = baseBodyPosition[1] + bob
      bodyRef.current.rotation.z = baseBodyRotation[2] + tilt
    }

    if (leftArmRef.current) {
      leftArmRef.current.rotation.z =
        baseLeftArmRotation[2] + armCounterWalk * ARM_SWING
    }

    if (rightArmRef.current) {
      rightArmRef.current.rotation.z = baseRightArmRotation[2] + armWalk * ARM_SWING
    }

    if (leftLegRef.current) {
      leftLegRef.current.rotation.z =
        baseLeftLegRotation[2] + legCounterWalk * LEG_SWING
    }

    if (rightLegRef.current) {
      rightLegRef.current.rotation.z = baseRightLegRotation[2] + legWalk * LEG_SWING
    }
  })

  return (
    <group ref={orbitRef} position={getCharacterPosition(0).toArray()}>
      <group ref={faceRef}>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Jon_Stick.geometry}
          material={materials['Oak Wood2']}
          rotation={[0, 0, -Math.PI]}
          scale={[-0.026, -1, -0.026]}>
          <mesh
            ref={bodyRef}
            castShadow
            receiveShadow
            geometry={nodes.Jon_Body.geometry}
            material={materials.Jon_Body}
            position={baseBodyPosition}
            rotation={baseBodyRotation}
            scale={[-92.579, -39.07, -2.379]}
          />
          <mesh
            ref={leftArmRef}
            castShadow
            receiveShadow
            geometry={nodes.Jon_Left_Arm.geometry}
            material={materials.Jon_Left_Arm}
            position={[1.456, 0.69, -0.886]}
            rotation={baseLeftArmRotation}
            scale={[-92.579, -39.07, -2.379]}
          />
          <mesh
            ref={leftLegRef}
            castShadow
            receiveShadow
            geometry={nodes.Jon_Left_Leg.geometry}
            material={materials.Jon_Left_Leg}
            position={[1.456, 0.715, -0.388]}
            rotation={baseLeftLegRotation}
            scale={[-92.579, -39.07, -2.379]}
          />
          <mesh
            ref={rightArmRef}
            castShadow
            receiveShadow
            geometry={nodes.Jon_Right_Arm.geometry}
            material={materials.Jon_Right_Arm}
            position={[1.456, 0.69, -2.226]}
            rotation={baseRightArmRotation}
            scale={[-92.579, -39.07, -2.379]}
          />
          <mesh
            ref={rightLegRef}
            castShadow
            receiveShadow
            geometry={nodes.Jon_Right_Leg.geometry}
            material={materials.Jon_Right_Leg}
            position={[1.456, 0.703, -1.679]}
            rotation={baseRightLegRotation}
            scale={[-92.579, -39.07, -2.379]}
          />
        </mesh>
      </group>
    </group>
  )
}
