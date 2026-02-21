import { useDraggable } from '@dnd-kit/core'
import { ITEM_COLORS } from '../game/constants'
import { useGameStore } from '../game/store'
import type { Building, Resource, Side } from '../game/types'
import { BuildingIcon } from './BuildingIcon'
import { DroppableSlot } from './DroppableSlot'

interface Props {
  slotIndex: number
  side: Side
  building: Building | undefined
  resource: Resource | undefined
}

function DraggablePlacedBuilding({ building }: { building: Building }) {
  const removeBuilding = useGameStore((s) => s.removeBuilding)
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `placed-${building.id}`,
    data: { buildingId: building.id, isPlaced: true, type: building.type },
  })

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className="group cursor-grab active:cursor-grabbing"
      style={{ opacity: isDragging ? 0.3 : 1 }}
    >
      <BuildingIcon
        building={building}
        onRemove={() => removeBuilding(building.id)}
      />
    </div>
  )
}

export function BuildingSlot({ slotIndex, side, building, resource }: Props) {
  // Resource tint on the slot background
  const bgStyle = resource
    ? { backgroundColor: `${ITEM_COLORS[resource.type]}22`, boxShadow: `inset 0 0 0 1px ${ITEM_COLORS[resource.type]}44` }
    : {}

  return (
    <DroppableSlot slotIndex={slotIndex} side={side} hasBuilding={!!building}>
      <div className="relative w-full h-full flex items-center justify-center" style={bgStyle}>
        {/* Resource ore dot indicator (bottom corner) */}
        {resource && !building && (
          <div
            className="absolute bottom-1 right-1 w-2 h-2 rounded-full"
            style={{ backgroundColor: ITEM_COLORS[resource.type], opacity: 0.7 }}
            title={resource.type}
          />
        )}

        {building ? (
          <DraggablePlacedBuilding building={building} />
        ) : (
          <div className="w-7 h-7 rounded border border-dashed border-white/10" />
        )}
      </div>
    </DroppableSlot>
  )
}
