'use client'

import { useMemo, useState } from 'react'
import { SectorConfig, InventoryRecord, MovementType } from '@components/types'

type InventoryPanelProps = {
  inventory: InventoryRecord[]
  selectedSectorId: number
  selectedSector: SectorConfig
  selectedRecord: InventoryRecord
  movementAmount: number
  setMovementAmount: (value: number) => void
  handleMovement: (type: MovementType, amount: number, sectorId: number) => void
  setSelectedSectorId: (id: number) => void
  activityLog: string[]
  totalStock: number
  utilization: number
  sectors: SectorConfig[]
}

export const InventoryPanel = ({
  inventory,
  selectedSector,
  selectedRecord,
  movementAmount,
  setMovementAmount,
  handleMovement,
  setSelectedSectorId,
  totalStock,
  selectedSectorId,
  sectors,
}: InventoryPanelProps) => {
  const [sortKey, setSortKey] = useState<'id' | 'percentLow'>('id')

  const sortedInventory = useMemo(() => {
    if (sortKey === 'id') return inventory
    return [...inventory].sort((left, right) => {
      const leftSector = sectors.find((entry) => entry.id === left.sectorId)!
      const rightSector = sectors.find((entry) => entry.id === right.sectorId)!
      const leftRatio = left.stock / leftSector.capacity
      const rightRatio = right.stock / rightSector.capacity
      return leftRatio - rightRatio
    })
  }, [inventory, sectors, sortKey])

  const stats = useMemo(
    () => [
      {
        label: '재고율',
        value: `${Math.round((selectedRecord.stock / selectedSector.capacity) * 100)}%`,
      },
      { label: '수용력', value: `${selectedSector.capacity}대` },
      { label: '총 재고', value: `${totalStock.toLocaleString()}대` },
    ],
    [selectedRecord, selectedSector, totalStock],
  )

  return (
    <div className='space-y-5 text-[13px] text-slate-100 pb-20'>
      <p className='text-[12px] text-slate-500'>최근 작업 · {selectedRecord.lastMovement}</p>
      <div className='space-y-1 px-3'>
        <p className='text-[17px] font-semibold'>
          Sector {selectedSector.id} · {selectedRecord.stock}/{selectedSector.capacity}대
        </p>
        <div className='flex flex-wrap gap-2 text-[11px] text-slate-400 mt-2'>
          {stats.map((item) => (
            <span key={item.label}>
              {item.label} {item.value}
            </span>
          ))}
        </div>
        <div className='h-[10px] w-full overflow-hidden bg-slate-600/40 mt-4'>
          <div
            className='h-full bg-linear-to-r from-gray-600 to-cyan-600'
            style={{
              width: `${Math.round((selectedRecord.stock / selectedSector.capacity) * 100)}%`,
            }}
          />
        </div>
      </div>

      <div className='space-y-2 bg-transparent p-3 pt-0 text-[12px]'>
        <p className='uppercase tracking-[0.3em] text-slate-600'>조정 수량</p>
        <input
          type='number'
          min={1}
          value={movementAmount}
          onChange={(event) => setMovementAmount(Number(event.target.value))}
          className='w-full border border-slate-600 bg-transparent px-3 py-2 text-[12px] outline-none'
        />
        <div className='flex gap-2'>
          <button
            type='button'
            onClick={() => handleMovement('in', movementAmount, selectedSectorId)}
            className='flex-1 px-3 py-2 text-[13px] font-semibold text-white cursor-pointer transition hover:brightness-110'
            style={{
              background: '#234074',
              boxShadow:
                '0 2px 8px 0 rgba(50,100,255,0.18), 0 1px 2px 0 rgba(80,160,255,0.18) inset, 0 0.5px 1px 0 #3e5f9b inset',
              border: '1px solid #305088',
            }}
          >
            입고 처리
          </button>
          <button
            type='button'
            onClick={() => handleMovement('out', movementAmount, selectedSectorId)}
            className='flex-1 px-3 py-2 text-[13px] font-semibold text-white cursor-pointer transition hover:brightness-110'
            style={{
              background: '#5d2339',
              boxShadow:
                '0 2px 8px 0 rgba(182,50,90,0.18), 0 1px 2px 0 rgba(200,40,80,0.16) inset, 0 0.5px 1px 0 #813050 inset',
              border: '1px solid #86234c',
            }}
          >
            출고 처리
          </button>
        </div>
      </div>

      <div className='space-y-2'>
        <div className='flex flex-wrap items-center justify-between gap-2'>
          <p className='text-[12px] uppercase tracking-[0.4em] text-slate-400'>섹터 일람</p>
          <div className='flex gap-2'>
            <button
              type='button'
              onClick={() => setSortKey('id')}
              className={`rounded-full border px-3 py-1 text-[11px] transition ${
                sortKey === 'id'
                  ? 'border-amber-400 bg-amber-500/10 text-amber-200'
                  : 'border-white/5'
              }`}
            >
              번호순
            </button>
            <button
              type='button'
              onClick={() => setSortKey('percentLow')}
              className={`rounded-full border px-3 py-1 text-[11px] transition ${
                sortKey === 'percentLow'
                  ? 'border-emerald-400 bg-emerald-500/10 text-emerald-200'
                  : 'border-white/5'
              }`}
            >
              재고율 낮은 순
            </button>
          </div>
        </div>
        <div className='space-y-2 text-[13px]'>
          {sortedInventory.map((record) => {
            const sector = sectors.find((entry) => entry.id === record.sectorId)!
            const percent = Math.round((record.stock / sector.capacity) * 100)
            return (
              <button
                key={`sidebar-${sector.id}`}
                type='button'
                onClick={() => setSelectedSectorId(sector.id)}
                className={`flex w-full flex-col px-3 py-2 text-left cursor-pointer hover:bg-slate-800/40 ${
                  selectedSectorId === sector.id ? 'bg-slate-800/40' : 'bg-transparent'
                }`}
              >
                <div className='flex items-center justify-between text-[13px]'>
                  <div className='font-semibold'>{sector.label}</div>
                  <span>{record.stock}대</span>
                </div>
                <p className='text-[11px] text-slate-400'>
                  {record.stock}/{sector.capacity}대 · {percent}%
                </p>
                <div className='mt-1 h-[8px] w-full bg-slate-600/40'>
                  <div
                    className='h-full bg-linear-to-r from-gray-600 to-cyan-600'
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
