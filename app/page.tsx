'use client'

import { Environment, OrbitControls } from '@react-three/drei'
import { Canvas, ThreeElements, useFrame } from '@react-three/fiber'
import { useRef, useState } from 'react'
import * as THREE from 'three'

const Box = (props: ThreeElements['mesh']) => {
  const ref = useRef<THREE.Mesh>(null!)
  const [clicked, setClicked] = useState(false)
  const [hovered, setHovered] = useState(false)

  useFrame((_state, delta) => {
    const targetScale = clicked ? 2.0 : hovered ? 1.2 : 1
    const damping = 5

    const currentScale = ref.current.scale.x
    const newScale = THREE.MathUtils.damp(currentScale, targetScale, damping, delta)
    ref.current.scale.set(newScale, newScale, newScale)

    ref.current.rotation.x += delta
    ref.current.rotation.y += delta
  })

  return (
    <mesh
      {...props}
      ref={ref}
      scale={1}
      onClick={() => setClicked(!clicked)}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <boxGeometry />
      <meshStandardMaterial color={hovered ? 'red' : 'cyan'} />
    </mesh>
  )
}

export default function Page() {
  return (
    <Canvas>
      <OrbitControls />
      <Environment preset='city' />
      <Box />
    </Canvas>
  )
}
