import type { BuildingType } from '../game/types'
import { DraggableBuilding } from './DraggableBuilding'

const BUILDING_TYPES: BuildingType[] = [
  'miner',
  'furnace',
  'assembler_gear',
  'assembler_wire',
  'assembler_science',
  'lab',
]

export function BuildingPalette() {
  return (
    <div className="flex flex-col gap-3 h-full">
      <h2 className="text-xs font-bold text-white/40 uppercase tracking-widest px-1 pt-1">
        Buildings
      </h2>
      <div className="flex flex-col gap-2">
        {BUILDING_TYPES.map((type) => (
          <DraggableBuilding key={type} type={type} />
        ))}
      </div>
      <div className="mt-auto pt-3 border-t border-white/10">
        <p className="text-[10px] text-white/25 leading-snug">
          Drag onto UP or DOWN row to place. Right-click to remove.
        </p>
      </div>
    </div>
  )
}
