import { type DragEndEvent, DndContext, DragOverlay, useSensor, useSensors, PointerSensor } from '@dnd-kit/core'
import { useState } from 'react'
import { BUILDING_EMOJI } from '../game/constants'
import { useGameStore } from '../game/store'
import type { BuildingType, Side } from '../game/types'
import { Belt } from './Belt'
import { BuildingPalette } from './BuildingPalette'
import { QuickGuide } from './QuickGuide'
import { StatsPanel } from './StatsPanel'

export function GameBoard() {
  const { running, speed, startGame, pauseGame, resumeGame, resetGame, setSpeed, placeBuilding, moveBuilding, buildings } = useGameStore()
  const [activeDragType, setActiveDragType] = useState<BuildingType | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  )

  function handleDragStart(event: import('@dnd-kit/core').DragStartEvent) {
    const data = event.active.data.current
    if (data) setActiveDragType(data.type as BuildingType)
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveDragType(null)
    const { active, over } = event
    if (!over) return

    const activeData = active.data.current
    const overData = over.data.current
    if (!activeData || !overData) return

    const { slotIndex, side } = overData as { slotIndex: number; side: Side }
    const occupied = buildings.some((b) => b.slotIndex === slotIndex && b.side === side)

    if (activeData.isPlaced) {
      if (occupied && buildings.find((b) => b.slotIndex === slotIndex && b.side === side)?.id !== activeData.buildingId) return
      moveBuilding(activeData.buildingId as string, slotIndex, side)
    } else {
      if (occupied) return
      placeBuilding({ type: activeData.type as BuildingType, side, slotIndex })
    }
  }

  const toggleRunning = () => {
    if (!running) {
      if (useGameStore.getState().ticks === 0) startGame()
      else resumeGame()
    } else {
      pauseGame()
    }
  }

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="h-screen bg-gray-950 text-white flex flex-col overflow-hidden" style={{
        backgroundImage: 'radial-gradient(ellipse at 50% 0%, #1a1a2e 0%, #060610 60%)',
      }}>
        {/* Header */}
        <header className="flex items-center justify-between px-5 py-2.5 border-b border-white/10 bg-black/40 shrink-0 z-10">
          <div className="flex items-center gap-3">
            <span className="text-xl">🚀</span>
            <h1 className="text-sm font-bold text-white/90 tracking-wide">Factory Automation</h1>
          </div>
          <div className="flex items-center gap-3">
            <StatsPanel />
            {/* Speed controls */}
            <div className="flex items-center gap-0.5 bg-white/5 rounded-lg border border-white/10 px-1.5 py-1">
              {[0.5, 1, 2, 4].map((s) => (
                <button
                  key={s}
                  onClick={() => setSpeed(s)}
                  className={[
                    'text-xs px-2 py-0.5 rounded transition-all font-medium',
                    speed === s
                      ? 'bg-indigo-600 text-white'
                      : 'text-white/40 hover:text-white/70',
                  ].join(' ')}
                >
                  {s}×
                </button>
              ))}
            </div>
            <button
              onClick={toggleRunning}
              className={[
                'px-4 py-1.5 rounded-lg text-sm font-semibold border transition-all',
                running
                  ? 'bg-orange-600/30 border-orange-500/50 text-orange-300 hover:bg-orange-600/50'
                  : 'bg-green-600/30 border-green-500/50 text-green-300 hover:bg-green-600/50',
              ].join(' ')}
            >
              {running ? '⏸ Pause' : '▶ Start'}
            </button>
            <button
              onClick={resetGame}
              className="px-3 py-1.5 rounded-lg text-sm border border-white/10 text-white/40 hover:text-white/70 hover:border-white/20 transition-all"
              title="New game (reset)"
            >
              ↺ Reset
            </button>
          </div>
        </header>

        {/* Main content */}
        <div className="flex flex-1 min-h-0">
          {/* Sidebar — wider */}
          <aside className="w-48 shrink-0 border-r border-white/10 bg-black/30 p-4 overflow-y-auto flex flex-col">
            <BuildingPalette />
          </aside>

          {/* Game area */}
          <main className="flex-1 p-8 overflow-auto flex flex-col gap-6">
            {/* Belt section */}
            <div>
              <div className="flex items-center gap-4 mb-4">
                <span className="text-xs font-semibold text-white/30 uppercase tracking-widest">Conveyor Belt</span>
                <div className="flex items-center gap-2 text-[11px] text-white/20">
                  <span>start →</span>
                  <div className="flex-1 h-px bg-white/10 min-w-8" />
                  <span>→ space 🚀</span>
                </div>
              </div>
              <Belt />
            </div>

            {/* Legend (compact) */}
            <div className="text-[11px] text-white/25 flex flex-wrap gap-x-5 gap-y-1">
              <span className="text-yellow-500/40"><strong>⚠️</strong> red pulse = stalled (belt full)</span>
              <span>Colored slots = ore patches (miners only)</span>
              <span>🎲 each machine gets a random speed on placement</span>
            </div>

            {/* Quick Guide */}
            <QuickGuide />
          </main>
        </div>
      </div>

      {/* Drag overlay */}
      <DragOverlay dropAnimation={null}>
        {activeDragType && (
          <div className="text-4xl select-none pointer-events-none filter drop-shadow-lg">
            {BUILDING_EMOJI[activeDragType]}
          </div>
        )}
      </DragOverlay>
    </DndContext>
  )
}
