import { useDraggable } from '@dnd-kit/core'
import { useState } from 'react'
import { BUILDING_DESCRIPTIONS, BUILDING_EMOJI, BUILDING_LABELS, ITEM_COLORS } from '../game/constants'
import { useGameStore } from '../game/store'
import type { Building, BuildingType, Resource, Side } from '../game/types'
import { BuildingIcon } from './BuildingIcon'
import { DroppableSlot } from './DroppableSlot'

const ALL_BUILDING_TYPES: BuildingType[] = [
  'miner',
  'furnace',
  'assembler_gear',
  'assembler_wire',
  'assembler_science',
  'lab',
]

interface PickerProps {
  slotIndex: number
  side: Side
  resource: Resource | undefined
  onClose: () => void
}

function BuildingPicker({ slotIndex, side, resource, onClose }: PickerProps) {
  const placeBuilding = useGameStore((s) => s.placeBuilding)

  function handlePick(type: BuildingType) {
    if (type === 'miner' && !resource) return  // can't place miner on empty tile
    placeBuilding({ type, side, slotIndex })
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      onClick={onClose}
    >
      <div
        className="bg-gray-900 border border-white/20 rounded-xl shadow-2xl p-4 w-64"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-white/60 uppercase tracking-widest">
            Place Building — slot {slotIndex} {side === 'left' ? '(UP)' : '(DOWN)'}
          </span>
          <button
            onClick={onClose}
            className="text-white/30 hover:text-white/70 text-lg leading-none"
          >×</button>
        </div>
        <div className="flex flex-col gap-1">
          {ALL_BUILDING_TYPES.map((type) => {
            const disabled = type === 'miner' && !resource
            return (
              <button
                key={type}
                onClick={() => handlePick(type)}
                disabled={disabled}
                className={[
                  'flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-all',
                  disabled
                    ? 'opacity-30 cursor-not-allowed'
                    : 'hover:bg-white/10 cursor-pointer',
                ].join(' ')}
              >
                <span className="text-xl w-7 text-center">{BUILDING_EMOJI[type]}</span>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-white/90">{BUILDING_LABELS[type]}</span>
                  <span className="text-[10px] text-white/40 leading-tight">{BUILDING_DESCRIPTIONS[type]}</span>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
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

interface Props {
  slotIndex: number
  side: Side
  building: Building | undefined
  resource: Resource | undefined
}

export function BuildingSlot({ slotIndex, side, building, resource }: Props) {
  const [pickerOpen, setPickerOpen] = useState(false)

  const bgStyle = resource
    ? { backgroundColor: `${ITEM_COLORS[resource.type]}22`, boxShadow: `inset 0 0 0 1px ${ITEM_COLORS[resource.type]}44` }
    : {}

  return (
    <>
      <DroppableSlot slotIndex={slotIndex} side={side} hasBuilding={!!building}>
        <div
          className="relative w-full h-full flex items-center justify-center"
          style={bgStyle}
          onClick={() => { if (!building) setPickerOpen(true) }}
        >
          {/* Resource ore dot indicator */}
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
            <div className="w-7 h-7 rounded border border-dashed border-white/10 hover:border-white/30 hover:bg-white/5 transition-all cursor-pointer" />
          )}
        </div>
      </DroppableSlot>

      {pickerOpen && (
        <BuildingPicker
          slotIndex={slotIndex}
          side={side}
          resource={resource}
          onClose={() => setPickerOpen(false)}
        />
      )}
    </>
  )
}
