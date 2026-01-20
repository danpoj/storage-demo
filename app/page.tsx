'use client'

import { Canvas } from '@react-three/fiber'
import { Environment, OrbitControls } from '@react-three/drei'
import { useState } from 'react'
import { InventoryPanel } from '@components/InventoryPanel'
import { SectorRack } from '@components/SectorRack'
import { InventoryRecord, MovementType, SectorConfig } from '@components/types'

const baseSectorPalette: Omit<SectorConfig, 'position'>[] = [
  { id: 5, label: 'Sector 5', capacity: 180, color: '#feb47b' },
  { id: 6, label: 'Sector 6', capacity: 190, color: '#ff7e5f' },
  { id: 7, label: 'Sector 7', capacity: 200, color: '#ffd166' },
  { id: 8, label: 'Sector 8', capacity: 210, color: '#8dd7ff' },
  { id: 9, label: 'Sector 9', capacity: 200, color: '#64c7ff' },
  { id: 10, label: 'Sector 10', capacity: 210, color: '#9d7cff' },
  { id: 11, label: 'Sector 11', capacity: 220, color: '#ec9f05' },
  { id: 12, label: 'Sector 12', capacity: 200, color: '#38c1b9' },
  { id: 13, label: 'Sector 13', capacity: 190, color: '#52b69a' },
  { id: 14, label: 'Sector 14', capacity: 205, color: '#4facfe' },
  { id: 15, label: 'Sector 15', capacity: 215, color: '#4d9dff' },
  { id: 16, label: 'Sector 16', capacity: 230, color: '#f37735' },
]

const sectors: SectorConfig[] = baseSectorPalette.map((sector, index) => {
  const columns = 4
  const row = Math.floor(index / columns)
  const column = index % columns
  const x = column * 5 - 7.5
  const z = row * 4 - 4
  return {
    ...sector,
    position: [x, 0, z],
  }
})

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)

const createInitialInventory = () =>
  sectors.map((sector) => {
    const baseRatio = 0.35 + (Math.abs(Math.sin(sector.id * 12.7 + 3.14)) * 0.35)
    return {
      sectorId: sector.id,
      stock: Math.floor(sector.capacity * clamp(baseRatio, 0.35, 0.7)),
      lastMovement: '기본 배치 완료',
    }
  })

const Floor = () => (
  <mesh rotation-x={-Math.PI / 2} position={[0, -0.01, 0]}>
    <planeGeometry args={[60, 40]} />
    <meshStandardMaterial color='#000' />
  </mesh>
)

export default function Page() {
  const [inventory, setInventory] = useState<InventoryRecord[]>(createInitialInventory())
  const [selectedSectorId, setSelectedSectorId] = useState(sectors[0].id)
  const [movementAmount, setMovementAmount] = useState(8)
  const [activityLog, setActivityLog] = useState<string[]>(['시스템 초기화 완료 · 모든 섹터 온라인'])

  const selectedSector = sectors.find((sector) => sector.id === selectedSectorId)!
  const selectedRecord = inventory.find((record) => record.sectorId === selectedSectorId)!
  const totalStock = inventory.reduce((sum, record) => sum + record.stock, 0)
  const totalCapacity = sectors.reduce((sum, sector) => sum + sector.capacity, 0)
  const utilization = Math.round((totalStock / totalCapacity) * 100)

  const handleMovement = (type: MovementType, amount: number, sectorId: number) => {
    if (amount <= 0) return
    const sector = sectors.find((entry) => entry.id === sectorId)!
    const currentRecord = inventory.find((entry) => entry.sectorId === sectorId)!
    const delta = type === 'in' ? amount : -amount
    const nextStock = clamp(currentRecord.stock + delta, 0, sector.capacity)

    setInventory((prev) =>
      prev.map((record) =>
        record.sectorId !== sectorId
          ? record
          : {
              ...record,
              stock: nextStock,
              lastMovement: `${type === 'in' ? '입고' : '출고'} ${amount}대 · ${sector.label}`,
            },
      ),
    )

    setSelectedSectorId(sectorId)
    setActivityLog((prev) => {
      const verb = type === 'in' ? '입고' : '출고'
      const entry = `${verb} ${amount}대 → ${sector.label} (${nextStock}/${sector.capacity}대)`
      return [entry, ...prev].slice(0, 6)
    })
  }

  return (
    <div className='h-screen overflow-hidden bg-[#030b1b] text-white'>
      <div className='flex h-full flex-col gap-4 px-4 py-4 text-sm lg:flex-row lg:px-6 lg:py-6'>
        <div className='flex h-full w-full flex-col gap-4 overflow-y-auto border border-white/5 bg-[#050b1a] p-4 lg:h-screen lg:w-1/3'>
          <div className='text-xs uppercase tracking-[0.5em] text-slate-400'>금호타이어</div>
          <InventoryPanel
            inventory={inventory}
            selectedSectorId={selectedSectorId}
            selectedSector={selectedSector}
            selectedRecord={selectedRecord}
            movementAmount={movementAmount}
            setMovementAmount={setMovementAmount}
            handleMovement={handleMovement}
            setSelectedSectorId={setSelectedSectorId}
            activityLog={activityLog}
            utilization={utilization}
            sectors={sectors}
            totalStock={totalStock}
          />
        </div>

        <div className='flex flex-1 flex-col border border-white/10 bg-linear-to-b from-[#020617] to-[#03142c]'>
          <section className='relative flex-1 overflow-hidden'>
            <Canvas camera={{ position: [-20,21,21], fov: 35 }}>
            

              <Floor />
              {inventory.map((record) => {
                const sector = sectors.find((entry) => entry.id === record.sectorId)!
                return (
                  <SectorRack
                    key={`sector-${sector.id}`}
                    sector={sector}
                    record={record}
                    selected={selectedSectorId === sector.id}
                    onSelect={setSelectedSectorId}
                  />
                )
              })}
              <OrbitControls
                enableZoom
                enablePan
                enableDamping
                dampingFactor={0.1}
                maxPolarAngle={Math.PI / 2.1}
                minPolarAngle={Math.PI / 4}
              />
              <Environment preset='city' />
            </Canvas>
            <div className='pointer-events-none absolute bottom-4 right-4 text-right text-slate-300'>
              <p className='text-[12px] font-bold'>금호타이어</p>
              <p className='text-[11px] font-semibold'>금호타이어 창고 실시간 재고</p>
              <p className='text-[11px] text-slate-400'>
                5번부터 16번 섹터까지 타이어를 직선으로 늘어선 랙과 층마다 타이어가 실려 있는 구성으로 보여줍니다.
              </p>
              <p className='text-[11px] text-slate-400'>각 섹터를 클릭하면 재고 변화가 실시간으로 반영됩니다.</p>
            </div>

            <div className='absolute top-4 left-4 flex max-h-40 w-[400px] flex-col gap-2 overflow-y-auto p-3 text-[10px] z-50'>
              <p className='text-[11px] uppercase tracking-[0.3em] text-slate-400 pl-1.5'>최근 기록</p>
              <ul className='space-y-1 text-[11px] text-slate-200'>
                {activityLog.map((entry, index) => (
                  <li key={`overlay-log-${index}`} className='px-2 py-1'>
                    {entry}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
