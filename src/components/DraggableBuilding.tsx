import { useDraggable } from '@dnd-kit/core'
import { BUILDING_DESCRIPTIONS, BUILDING_EMOJI, BUILDING_LABELS } from '../game/constants'
import type { BuildingType } from '../game/types'

interface Props {
  type: BuildingType
}

export function DraggableBuilding({ type }: Props) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `palette-${type}`,
    data: { type, isPlaced: false },
  })

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={[
        'flex flex-col items-center gap-1.5 p-3 rounded-xl border cursor-grab active:cursor-grabbing select-none',
        'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/25 transition-all',
        isDragging ? 'opacity-30' : 'opacity-100',
      ].join(' ')}
      title={BUILDING_DESCRIPTIONS[type]}
    >
      <span className="text-3xl">{BUILDING_EMOJI[type]}</span>
      <span className="text-[12px] text-white/70 leading-tight text-center font-medium">
        {BUILDING_LABELS[type]}
      </span>
      <span className="text-[10px] text-white/30 leading-tight text-center hidden group-hover:block">
        {BUILDING_DESCRIPTIONS[type]}
      </span>
    </div>
  )
}
