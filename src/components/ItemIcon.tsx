import { ITEM_COLORS, ITEM_EMOJI } from '../game/constants'
import type { Item } from '../game/types'

interface Props {
  item: Item
  size?: number
}

export function ItemIcon({ item, size = 32 }: Props) {
  return (
    <div
      style={{
        width: size,
        height: size,
        backgroundColor: ITEM_COLORS[item],
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: size * 0.45,
        flexShrink: 0,
        boxShadow: '0 1px 3px rgba(0,0,0,0.4)',
      }}
      title={item}
    >
      {ITEM_EMOJI[item]}
    </div>
  )
}
