'use client'

export type SectorConfig = {
  id: number
  label: string
  capacity: number
  position: [number, number, number]
  color: string
}

export type InventoryRecord = {
  sectorId: number
  stock: number
  lastMovement: string
}

export type MovementType = 'in' | 'out'
