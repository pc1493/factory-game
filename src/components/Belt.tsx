import { ITEM_COLORS } from '../game/constants'
import { useGameStore } from '../game/store'
import { BeltSlot } from './BeltSlot'
import { BuildingSlot } from './BuildingSlot'

export function Belt() {
  const belts = useGameStore((s) => s.belts)
  const buildings = useGameStore((s) => s.buildings)
  const resources = useGameStore((s) => s.resources)

  const labelCell = (text: string) => (
    <div className="flex items-center justify-end w-14 pr-2 shrink-0 border-r border-white/10">
      <span className="text-[10px] font-semibold text-white/30 uppercase tracking-widest select-none">
        {text}
      </span>
    </div>
  )

  const endCell = (content: React.ReactNode) => (
    <div className="w-10 shrink-0 flex items-center justify-center border-l border-white/10">
      {content}
    </div>
  )

  return (
    <div className="flex flex-col rounded-lg overflow-hidden border border-white/10">
      {/* UP buildings row */}
      <div className="flex items-stretch bg-black/20">
        {labelCell('UP')}
        {belts.up.map((_, i) => {
          const b = buildings.find((b) => b.slotIndex === i && b.side === 'left')
          const resource = resources.find((r) => r.slotIndex === i)
          return <BuildingSlot key={i} slotIndex={i} side="left" building={b} resource={resource} />
        })}
        {endCell(null)}
      </div>

      {/* UP belt strip */}
      <div className="flex items-stretch bg-black/50 border-t border-white/10">
        {labelCell('')}
        {belts.up.map((item, i) => {
          const resource = resources.find((r) => r.slotIndex === i)
          const bg = resource ? `${ITEM_COLORS[resource.type]}18` : undefined
          return (
            <div key={i} style={{ backgroundColor: bg, flexShrink: 0 }}>
              <BeltSlot index={i} item={item} />
            </div>
          )
        })}
        {endCell(<span className="text-xs opacity-50">🚀</span>)}
      </div>

      {/* DOWN belt strip */}
      <div className="flex items-stretch bg-black/50 border-t border-white/[0.06]">
        {labelCell('')}
        {belts.down.map((item, i) => {
          const resource = resources.find((r) => r.slotIndex === i)
          const bg = resource ? `${ITEM_COLORS[resource.type]}18` : undefined
          return (
            <div key={i} style={{ backgroundColor: bg, flexShrink: 0 }}>
              <BeltSlot index={i} item={item} />
            </div>
          )
        })}
        {endCell(<span className="text-xs opacity-50">🚀</span>)}
      </div>

      {/* DOWN buildings row */}
      <div className="flex items-stretch bg-black/20 border-t border-white/10">
        {labelCell('DOWN')}
        {belts.down.map((_, i) => {
          const b = buildings.find((b) => b.slotIndex === i && b.side === 'right')
          const resource = resources.find((r) => r.slotIndex === i)
          return <BuildingSlot key={i} slotIndex={i} side="right" building={b} resource={resource} />
        })}
        {endCell(null)}
      </div>
    </div>
  )
}
