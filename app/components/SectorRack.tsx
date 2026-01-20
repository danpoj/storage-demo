'use client'

import { Html } from '@react-three/drei'
import { useEffect, useState } from 'react'
import type { ThreeEvent } from '@react-three/fiber'
import { SectorConfig, InventoryRecord } from '@components/types'

const rackPostPositions: [number, number, number][] = [
  [-2.2, 0, -1.3],
  [2.2, 0, -1.3],
  [-2.2, 0, 1.3],
  [2.2, 0, 1.3],
]

const tiers = 4

const tirePositions = (count: number) => {
  const rows = 3
  const columns = 4
  const grid: [number, number, number][] = []

  for (let i = 0; i < Math.min(count, rows * columns); i += 1) {
    const row = Math.floor(i / columns)
    const column = i % columns
    const x = column * 0.9 - (columns / 2 - 0.4)
    const z = Math.sin(column + row) * 0.4
    grid.push([x, 0, z])
  }

  return grid
}

type SectorRackProps = {
  sector: SectorConfig
  record: InventoryRecord
  selected: boolean
  onSelect: (id: number) => void
}

export const SectorRack = ({ sector, record, selected, onSelect }: SectorRackProps) => {
  const [hovered, setHovered] = useState(false)

  useEffect(() => {
    return () => {
      if (typeof document !== 'undefined') {
        document.body.style.cursor = 'auto'
      }
    }
  }, [])

  const setCursor = (value: string) => {
    if (typeof document !== 'undefined') {
      document.body.style.cursor = value
    }
  }

  const handlePointerOver = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation()
    setHovered(true)
    setCursor('grab')
  }

  const handlePointerOut = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation()
    setHovered(false)
    setCursor('auto')
  }

  const handlePointerDown = () => setCursor('grabbing')
  const handlePointerUp = () => setCursor(hovered ? 'grab' : 'auto')

  const activeStack = Math.round((record.stock / sector.capacity) * tiers)
  const highlightColor = selected ? '#fde047' : hovered ? '#facc15' : '#94a3b8'

  return (
    <group
      position={sector.position}
      onClick={() => onSelect(sector.id)}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
    >
      {rackPostPositions.map((position, index) => (
        <mesh key={`post-${sector.id}-${index}`} position={[position[0], 1.4, position[2]]}>
          <cylinderGeometry args={[0.08, 0.08, 2.8, 16]} />
          <meshStandardMaterial color={highlightColor} metalness={0.9} roughness={0.2} />
        </mesh>
      ))}

      {Array.from({ length: tiers }).map((_, tier) => {
        const y = tier * 1.1 + 0.12
        const filled = tier < activeStack
        const positions = tirePositions(6)
        const opacity = filled ? 1 : 0.2
        const scale = filled ? 1 : 0.6

        return (
          <group key={`tier-${sector.id}-${tier}`}>
            <mesh position={[0, y, 0]}>
              <boxGeometry args={[4.6, 0.1, 2.8]} />
              <meshStandardMaterial color='#111827' metalness={0.4} roughness={0.6} />
            </mesh>
            <group position={[0, y + 0.35, 0]}>
              {positions.map((position, index) => (
                <mesh
                  key={`tire-${sector.id}-${tier}-${index}`}
                  position={[position[0], 0, position[2]]}
                  scale={scale}
                >
                  <torusGeometry args={[0.35, 0.12, 16, 100]} />
                  <meshStandardMaterial
                    color={filled ? '#0f172a' : '#1c1f2e'}
                    metalness={0.8}
                    roughness={0.25}
                    opacity={opacity}
                    transparent
                  />
                </mesh>
              ))}
            </group>
          </group>
        )
      })}

      <group position={[0, tiers * 1.1 - 0.5, 0]} rotation-x={-Math.PI / 2}>
        <mesh>
          <planeGeometry args={[2.6, 1]} />
          <meshStandardMaterial color='#020617' opacity={0.95} transparent />
        </mesh>
        <Html position={[0, 0, 0.02]} transform className='pointer-events-none select-none'>
          <div className='w-[180px] rounded-lg border border-white/20 bg-slate-900/90 px-3 py-1 text-center font-semibold uppercase text-white aspect-video flex items-center justify-center flex-col'>
            Sector {sector.id}
            <div className='mt-1 text-lg font-semibold leading-snug text-emerald-300'>
              재고 {record.stock}
            </div>
          </div>
        </Html>
      </group>
    </group>
  )
}
