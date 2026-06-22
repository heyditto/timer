/*
 Auto-generated source: custom_gltfjsx_file/Revised_full_timer_world3.jsx
Command: npx gltfjsx@6.5.3 revised_full_timer_world3.glb
*/

import React from 'react'
import { useGraph } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import { SkeletonUtils } from 'three-stdlib'
import * as THREE from 'three'
import { Character } from './Character.jsx'

const MODEL_URL = '/revised_full_timer_world3.glb'
const STATIC_CHARACTER_NODE = 'Jon_Stick'
const CONSTRUCTION_YELLOW = '#f2c14e'
const CONSTRUCTION_BODY_MATERIALS = new Set([
  'PaintedMetal',
  'PaintedMetal.001',
  'Painted Metal White',
  'Painted Metal White.001',
])

const shouldStayHidden = (material) => material?.name?.startsWith('hidden_material')

const prepareWorldMaterial = (material, cache) => {
  if (!material || shouldStayHidden(material)) return material
  if (cache.has(material.uuid)) return cache.get(material.uuid)

  // Blender shows thin card/plane details from both sides; glTF defaults to
  // front-side culling, which can make car details and gas station pillars vanish.
  const yellowMaterial = material.clone()
  yellowMaterial.side = THREE.DoubleSide

  if (CONSTRUCTION_BODY_MATERIALS.has(material.name)) {
    yellowMaterial.color = new THREE.Color(CONSTRUCTION_YELLOW)
    yellowMaterial.map = null
    yellowMaterial.metalness = 0.1
    yellowMaterial.roughness = 0.55
  }

  yellowMaterial.needsUpdate = true
  cache.set(material.uuid, yellowMaterial)

  return yellowMaterial
}

export function Model(props) {
  const { scene } = useGLTF(MODEL_URL)
  const { nodes, materials } = useGraph(scene)
  const world = React.useMemo(() => {
    const clone = SkeletonUtils.clone(scene)
    const staticCharacter = clone.getObjectByName(STATIC_CHARACTER_NODE)

    if (staticCharacter?.parent) {
      staticCharacter.parent.remove(staticCharacter)
    }

    const materialCache = new Map()

    clone.traverse((object) => {
      if (!object.isMesh) return

      object.material = Array.isArray(object.material)
        ? object.material.map((material) => prepareWorldMaterial(material, materialCache))
        : prepareWorldMaterial(object.material, materialCache)
    })

    return clone
  }, [scene])

  return (
    <group {...props} dispose={null}>
      <primitive object={world} />
      <Character nodes={nodes} materials={materials} />
    </group>
  )
}

useGLTF.preload(MODEL_URL)
