import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Suspense, useEffect, useRef } from 'react'
import * as THREE from 'three'
import { Hud } from './app/Hud'
import { ARENA_CENTER, getCharacterPosition } from './components/Character.jsx'
import { Model } from './components/Model.jsx'
import { useTimer } from './features/timer/hooks/useTimer'
import { getSmoothWalkProgress } from './features/timer/state/timerMotion'
import { playCompletionChime } from './features/timer/utils/playChime'
import './app/Hud.css'
import './features/timer/components/TimerDisplay.css'
import './components/ui/PaperButton.css'

const CAMERA_HEIGHT = 2.5
const CHARACTER_LOOK_OFFSET = new THREE.Vector3(0, 1.5, 0)
const FOCUS_MINUTES = 5
const lookTargetScratch = new THREE.Vector3()

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
        fov={42}
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
  const previousStatusRef = useRef(timer.status)

  useEffect(() => {
    if (timer.status === 'completed' && previousStatusRef.current !== 'completed') {
      playCompletionChime()
    }

    previousStatusRef.current = timer.status
  }, [timer.status])

  return (
    <main className="app-shell">
      <div className="canvas-layer">
        <Canvas shadows dpr={[1, 2]} gl={{ antialias: true }}>
          <TimerWorld />
        </Canvas>
      </div>
      <Hud
        timer={timer}
        focusMinutes={FOCUS_MINUTES}
        startLabel="5min Timer"
      />
    </main>
  )
}
