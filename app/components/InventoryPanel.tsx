'use client'

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
}: InventoryPanelProps) => (
  <div className='space-y-5 text-[11px] text-slate-100 pb-20' style={{ fontFamily: 'var(--font-geist-mono)' }}>
    <div className='space-y-1'>
      {/* <div className='flex items-center justify-between border-b border-slate-700 pb-1 text-[10px] uppercase tracking-[0.45em] text-slate-400'>
        <span>현재 선택</span>
        <span>가동률 {utilization}%</span>
      </div> */}
      <div className='space-y-4'>
        <p className='text-[17px] font-semibold'>
          Sector {selectedSector.id} · {selectedRecord.stock}/{selectedSector.capacity}대
        </p>
        <p className='text-[10px] text-slate-500'>최근 작업 · {selectedRecord.lastMovement}</p>
      </div>
      <div className='flex gap-2 text-[9px] text-slate-400 space-y-2'>
        <span>재고율 {Math.round((selectedRecord.stock / selectedSector.capacity) * 100)}%</span>
        <span>수용력 {selectedSector.capacity}대</span>
        <span>총 재고 {totalStock.toLocaleString()}대</span>
      </div>
      <div className='h-[3px] w-full overflow-hidden bg-slate-300'>
        <div
          className='h-full bg-linear-to-r from-emerald-400 to-cyan-500'
          style={{ width: `${Math.round((selectedRecord.stock / selectedSector.capacity) * 100)}%` }}
        />
      </div>
    </div>

      <div className='space-y-2 bg-transparent p-3 text-[10px]'>
      <p className='uppercase tracking-[0.3em] text-slate-600'>조정 수량</p>
      <input
        type='number'
        min={1}
        value={movementAmount}
        onChange={(event) => setMovementAmount(Number(event.target.value))}
        className='w-full border border-slate-600 bg-transparent px-3 py-2 text-[11px] outline-none'
      />
      <div className='flex gap-2'>
        <button
          type='button'
          onClick={() => handleMovement('in', movementAmount, selectedSectorId)}
          className='flex-1 px-3 py-2 text-[11px] font-semibold text-white cursor-pointer transition hover:brightness-110'
          style={{
            background: '#234074',
            boxShadow: '0 2px 8px 0 rgba(50,100,255,0.18), 0 1px 2px 0 rgba(80,160,255,0.18) inset, 0 0.5px 1px 0 #3e5f9b inset',
            border: '1px solid #305088'
          }}
        >
          입고 처리
        </button>
        <button
          type='button'
          onClick={() => handleMovement('out', movementAmount, selectedSectorId)}
          className='flex-1 px-3 py-2 text-[11px] font-semibold text-white cursor-pointer transition hover:brightness-110'
          style={{
            background: '#5d2339',
            boxShadow: '0 2px 8px 0 rgba(182,50,90,0.18), 0 1px 2px 0 rgba(200,40,80,0.16) inset, 0 0.5px 1px 0 #813050 inset',
            border: '1px solid #86234c'
          }}
        >
          출고 처리
        </button>
      </div>
    </div>

    <div className='space-y-2'>
      <p className='text-[10px] uppercase tracking-[0.4em] text-slate-400'>섹터 일람</p>
      <div className='space-y-2 text-[11px]'>
        {inventory.map((record) => {
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
              <div className='flex items-center justify-between text-[11px]'>
                <div className='font-semibold'>{sector.label}</div>
                <span>{record.stock}대</span>
              </div>
              <p className='text-[9px] text-slate-400'>
                {record.stock}/{sector.capacity}대 · {percent}%
              </p>
              <div className='mt-1 h-[3px] w-full bg-slate-900/40'>
                <div className='h-full bg-linear-to-r from-emerald-400 to-cyan-500' style={{ width: `${percent}%` }} />
              </div>
            </button>
          )
        })}
      </div>
    </div>
{/* 
    <div className='space-y-2 text-[10px] text-slate-400'>
      <p className='uppercase tracking-[0.3em]'>최근 기록</p>
      <ul className='space-y-1'>
        {activityLog.map((entry, index) => (
          <li key={`log-${index}`} className='border border-slate-700 px-3 py-2 text-[11px]'>
            {entry}
          </li>
        ))}
      </ul>
    </div> */}
  </div>
)
