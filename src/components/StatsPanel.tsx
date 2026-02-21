import { useState } from 'react'
import { useGameStore } from '../game/store'
import { calcSPM } from '../game/utils'
import type { Item } from '../game/types'

const ITEMS: Item[] = ['iron_ore', 'copper_ore', 'iron_plate', 'copper_plate', 'gear', 'wire', 'science']

function fmt(n: number): string {
  return n.toLocaleString()
}

export function StatsPanel() {
  const [expanded, setExpanded] = useState(false)
  const stats = useGameStore((s) => s.stats)
  const ticks = useGameStore((s) => s.ticks)
  const spm = calcSPM(stats.history)

  return (
    <div className="bg-white/5 border border-white/10 rounded-lg overflow-hidden min-w-[180px]">
      {/* Always visible */}
      <button
        className="w-full flex items-center justify-between px-3 py-2 hover:bg-white/5 transition-all"
        onClick={() => setExpanded((e) => !e)}
      >
        <div className="flex items-center gap-2">
          <span className="text-indigo-400 font-bold text-sm">
            {spm.toFixed(1)}
          </span>
          <span className="text-white/50 text-xs">SPM</span>
        </div>
        <span className="text-white/30 text-xs">{expanded ? '▲' : '▼'} Stats</span>
      </button>

      {/* Expanded view */}
      {expanded && (
        <div className="border-t border-white/10 px-3 py-2 text-xs space-y-1">
          <div className="flex justify-between text-white/70 mb-2">
            <span>Science / min</span>
            <span className="text-indigo-400 font-bold">{spm.toFixed(1)}</span>
          </div>
          <div className="text-white/30 uppercase tracking-widest text-[9px] mb-1">Lifetime</div>
          {ITEMS.map((item) => (
            <div key={item} className="flex justify-between">
              <span className="text-white/50">{item.replace(/_/g, ' ')}</span>
              <span className="text-white/80 font-mono">{fmt(stats.produced[item])}</span>
            </div>
          ))}
          <div className="border-t border-white/10 pt-1 mt-1 space-y-1">
            <div className="flex justify-between">
              <span className="text-white/40">Lost to space</span>
              <span className="text-red-400/80 font-mono">{fmt(stats.lostToSpace)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/40">Ticks elapsed</span>
              <span className="text-white/60 font-mono">{fmt(ticks)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
