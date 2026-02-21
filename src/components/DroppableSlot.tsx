import { useDroppable } from '@dnd-kit/core'
import type { ReactNode } from 'react'
import type { Side } from '../game/types'

interface Props {
  slotIndex: number
  side: Side
  children?: ReactNode
  hasBuilding: boolean
}

export function DroppableSlot({ slotIndex, side, children, hasBuilding }: Props) {
  const id = `${side}-${slotIndex}`
  const { isOver, setNodeRef } = useDroppable({ id, data: { slotIndex, side } })

  return (
    <div
      ref={setNodeRef}
      className={[
        'flex items-center justify-center border-x border-white/10 transition-all',
        isOver && !hasBuilding ? 'ring-2 ring-inset ring-yellow-400 bg-yellow-400/10' : '',
      ].join(' ')}
      style={{ width: 52, height: 52, flexShrink: 0 }}
    >
      {children}
    </div>
  )
}
