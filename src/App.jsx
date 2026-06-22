import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Suspense, useEffect, useRef } from 'react'
import * as THREE from 'three'
import { Hud } from './app/Hud'
import { ARENA_CENTER, getCharacterPosition } from './components/Character.jsx'
import { Model } from './components/Model.jsx'
import { LoadingScreen } from './components/ui/LoadingScreen'
import { useTimer } from './features/timer/hooks/useTimer'
import {
  getSmoothWalkProgress,
  nudgeManualWalkProgress,
} from './features/timer/state/timerMotion'
import {
  PRESENTATION_SEGMENT_COUNT,
  PRESENTATION_SEGMENT_MINUTES,
} from './features/timer/config'
import { playCompletionChime } from './features/timer/utils/playChime'
import './app/Hud.css'
import './features/timer/components/TimerDisplay.css'
import './components/ui/PaperButton.css'

const CAMERA_HEIGHT = 2.5
const CAMERA_FOV = 34
// Tune this Y value to pan the camera target up/down on the character.
const CHARACTER_LOOK_OFFSET = new THREE.Vector3(0, 1.05, 0)
const SCROLL_PROGRESS_PER_PIXEL = 0.00035
const lookTargetScratch = new THREE.Vector3()

function ScrollCharacterControls() {
  const lastTouchYRef = useRef(null)

  useEffect(() => {
    const moveCharacter = (deltaY) => {
      nudgeManualWalkProgress(deltaY * SCROLL_PROGRESS_PER_PIXEL)
    }

    const handleWheel = (event) => {
      event.preventDefault()
      moveCharacter(event.deltaY)
    }

    const handleTouchStart = (event) => {
      lastTouchYRef.current = event.touches[0]?.clientY ?? null
    }

    const handleTouchMove = (event) => {
      const currentY = event.touches[0]?.clientY
      if (currentY === undefined || lastTouchYRef.current === null) return

      event.preventDefault()
      moveCharacter(lastTouchYRef.current - currentY)
      lastTouchYRef.current = currentY
    }

    window.addEventListener('wheel', handleWheel, { passive: false })
    window.addEventListener('touchstart', handleTouchStart, { passive: true })
    window.addEventListener('touchmove', handleTouchMove, { passive: false })

    return () => {
      window.removeEventListener('wheel', handleWheel)
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchmove', handleTouchMove)
    }
  }, [])

  return null
}

function CameraRig() {
  const { camera } = useThree()
  const controlsRef = useRef()

  useFrame(() => {
    const characterPosition = getCharacterPosition(getSmoothWalkProgress())

    camera.position.set(ARENA_CENTER.x, CAMERA_HEIGHT, ARENA_CENTER.z)
    lookTargetScratch.copy(characterPosition).add(CHARACTER_LOOK_OFFSET)
    camera.lookAt(lookTargetScratch)

    if (controlsRef.current) {
      controlsRef.current.target.copy(lookTargetScratch)
      controlsRef.current.update()
    }
  })

  return (
    <OrbitControls
      ref={controlsRef}
      enableRotate={false}
      enablePan={false}
      enableZoom={false}
    />
  )
}

function TimerWorld() {
  return (
    <>
      <PerspectiveCamera
        makeDefault
        position={[ARENA_CENTER.x, CAMERA_HEIGHT, ARENA_CENTER.z]}
        fov={CAMERA_FOV}
        near={0.1}
        far={100}
      />
      <color attach="background" args={['#f4ead8']} />
      <ambientLight intensity={0.8} />
      <directionalLight
        castShadow
        position={[4, 8, 6]}
        intensity={2.2}
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-16}
        shadow-camera-right={16}
        shadow-camera-top={16}
        shadow-camera-bottom={-16}
      />
      <hemisphereLight args={['#fff7df', '#9f8065', 1.1]} />
      <Suspense fallback={null}>
        <Model />
      </Suspense>
      <CameraRig />
    </>
  )
}

export default function App() {
  const timer = useTimer()
  const previousCompletedSegmentsRef = useRef(timer.completedSegments)

  useEffect(() => {
    if (
      timer.completedSegments > previousCompletedSegmentsRef.current &&
      timer.status !== 'idle'
    ) {
      playCompletionChime()
    }

    previousCompletedSegmentsRef.current = timer.completedSegments
  }, [timer.completedSegments, timer.status])

  return (
    <main className="app-shell">
      <ScrollCharacterControls />
      <div className="canvas-layer">
        <Canvas shadows dpr={[1, 2]} gl={{ antialias: true }}>
          <TimerWorld />
        </Canvas>
      </div>
      <Hud
        timer={timer}
        focusMinutes={PRESENTATION_SEGMENT_MINUTES}
        totalSegments={PRESENTATION_SEGMENT_COUNT}
        startLabel="Start Timer"
      />
      <LoadingScreen />
    </main>
  )
}
