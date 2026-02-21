import { BUILDING_EMOJI } from '../game/constants'
import type { Building } from '../game/types'

interface Props {
  building: Building
  onRemove?: () => void
}

function isStalled(building: Building): boolean {
  const { heldItems, type } = building
  if (type === 'furnace') return !!(heldItems['iron_plate'] || heldItems['copper_plate'])
  if (type === 'assembler_gear') return !!heldItems['gear']
  if (type === 'assembler_wire') return !!heldItems['wire']
  if (type === 'assembler_science') return !!heldItems['science']
  return false
}

function isActive(building: Building): boolean {
  return building.progress > 0 && !isStalled(building)
}

export function BuildingIcon({ building, onRemove }: Props) {
  const stalled = isStalled(building)
  const active = isActive(building)
  const pct = building.cycleTime > 0 ? Math.min(building.progress / building.cycleTime, 1) : 0
  const size = 44

  return (
    <div className="relative select-none" style={{ width: size, height: size }}>
      {/* Building body */}
      <div
        className={[
          'relative flex items-center justify-center rounded border transition-all w-full h-full',
          stalled
            ? 'border-red-400 bg-red-900/60 animate-pulse'
            : active
              ? 'border-yellow-400/70 bg-yellow-900/30'
              : 'border-white/20 bg-white/5',
        ].join(' ')}
        style={{ fontSize: 22 }}
      >
        <span>{BUILDING_EMOJI[building.type]}</span>

        {/* Progress bar */}
        {pct > 0 && !stalled && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 rounded-b overflow-hidden">
            <div
              className="h-full bg-yellow-400 transition-all duration-300"
              style={{ width: `${pct * 100}%` }}
            />
          </div>
        )}

        {/* Stall indicator */}
        {stalled && (
          <div className="absolute -top-1 -right-1 text-[10px] leading-none z-10">⚠️</div>
        )}
      </div>

      {/* Remove button — always rendered, visible on hover via group */}
      {onRemove && (
        <button
          onClick={(e) => { e.stopPropagation(); onRemove() }}
          onContextMenu={(e) => { e.preventDefault(); onRemove() }}
          className="absolute -top-2 -left-2 w-5 h-5 rounded-full bg-red-600 hover:bg-red-500 text-white text-[11px] flex items-center justify-center leading-none z-20 opacity-0 group-hover:opacity-100 shadow-lg"
          title="Remove"
        >
          ×
        </button>
      )}
    </div>
  )
}
