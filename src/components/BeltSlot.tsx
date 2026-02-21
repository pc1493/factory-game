import type { Item } from '../game/types'
import { ItemIcon } from './ItemIcon'

interface Props {
  index: number
  item: Item | null
}

export function BeltSlot({ index, item }: Props) {
  return (
    <div
      className="relative flex items-center justify-center border-x border-white/10 transition-all bg-white/[0.03]"
      style={{
        width: 52,
        height: 52,
        flexShrink: 0,
      }}
      title={`Slot ${index + 1}`}
    >
      {/* Slot number */}
      <span className="absolute top-0.5 left-1 text-[9px] text-white/15 select-none leading-none">
        {index + 1}
      </span>

      {/* Belt item */}
      {item && (
        <div className="animate-belt-item">
          <ItemIcon item={item} size={32} />
        </div>
      )}
    </div>
  )
}
