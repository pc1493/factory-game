import { create } from 'zustand'
import { tick as engineTick } from './engine'
import { PROCESSING_JITTER, PROCESSING_TICKS, TICK_MS } from './constants'
import { generateResources, makeInitialBelts, makeInitialStats } from './utils'
import type { Building, BuildingType, GameState, Side } from './types'

/**
 * Roll a fixed cycle time for a building on placement or move.
 * Each machine has a unique speed — re-rolled only when placed/moved, not each cycle.
 */
function rollCycleTime(type: BuildingType): number {
  const base = PROCESSING_TICKS[type]
  const lo = base * (1 - PROCESSING_JITTER)
  const hi = base * (1 + PROCESSING_JITTER)
  return Math.max(1, Math.round(lo + Math.random() * (hi - lo)))
}

interface GameStore extends GameState {
  startGame: () => void
  pauseGame: () => void
  resumeGame: () => void
  resetGame: () => void
  setSpeed: (speed: number) => void
  placeBuilding: (building: Omit<Building, 'id' | 'progress' | 'cycleTime' | 'heldItems' | 'totalProduced'>) => void
  removeBuilding: (id: string) => void
  moveBuilding: (id: string, newSlotIndex: number, newSide: Side) => void
  tick: () => void
}

let intervalId: ReturnType<typeof setInterval> | null = null

const SAVE_VERSION = 5

function saveToStorage(state: GameState) {
  try {
    localStorage.setItem('factory-automation-save', JSON.stringify({
      version: SAVE_VERSION,
      belts: state.belts,
      buildings: state.buildings,
      resources: state.resources,
      ticks: state.ticks,
      stats: state.stats,
      speed: state.speed,
    }))
  } catch (_) { /* ignore */ }
}

function loadFromStorage(): GameState | null {
  try {
    const raw = localStorage.getItem('factory-automation-save')
    if (!raw) return null
    const p = JSON.parse(raw)
    if (p.version !== SAVE_VERSION) return null
    if (!Array.isArray(p.belts?.up) || p.belts.up.length !== 40) return null
    if (!Array.isArray(p.belts?.down) || p.belts.down.length !== 40) return null
    if (!Array.isArray(p.resources)) return null
    if (!Array.isArray(p.buildings)) return null
    if (typeof p.stats?.lostToSpace !== 'number') return null
    if (!Array.isArray(p.stats?.history)) return null
    return {
      belts: { up: p.belts.up, down: p.belts.down },
      buildings: p.buildings,
      resources: p.resources,
      ticks: p.ticks ?? 0,
      stats: {
        produced: { ...makeInitialStats().produced, ...p.stats.produced },
        history: p.stats.history,
        lostToSpace: p.stats.lostToSpace,
      },
      running: false,
      speed: p.speed ?? 1,
    }
  } catch (_) {
    return null
  }
}

function makeDefaultState(): GameState {
  return {
    belts: makeInitialBelts(),
    buildings: [],
    resources: generateResources(),
    ticks: 0,
    stats: makeInitialStats(),
    running: false,
    speed: 1,
  }
}

function startLoop(get: () => GameStore, set: (fn: (s: GameStore) => Partial<GameStore>) => void, speed: number) {
  if (intervalId !== null) clearInterval(intervalId)
  intervalId = setInterval(() => {
    const state = get()
    if (!state.running) return
    const next = engineTick(state)
    if (next.ticks % 5 === 0) saveToStorage(next)
    set(() => next)
  }, TICK_MS / speed)
}

const initialState: GameState = loadFromStorage() ?? makeDefaultState()

export const useGameStore = create<GameStore>((set, get) => ({
  ...initialState,

  startGame: () => {
    const state = get()
    if (!state.running) {
      set(() => ({ running: true }))
      startLoop(get, set, get().speed)
    }
  },

  pauseGame: () => {
    if (intervalId !== null) { clearInterval(intervalId); intervalId = null }
    set(() => ({ running: false }))
  },

  resumeGame: () => {
    set(() => ({ running: true }))
    startLoop(get, set, get().speed)
  },

  resetGame: () => {
    if (intervalId !== null) { clearInterval(intervalId); intervalId = null }
    const fresh = makeDefaultState()
    localStorage.removeItem('factory-automation-save')
    set(() => ({ ...fresh }))
  },

  setSpeed: (speed) => {
    set(() => ({ speed }))
    if (get().running) startLoop(get, set, speed)
  },

  placeBuilding: (building) => {
    const newBuilding: Building = {
      ...building,
      id: crypto.randomUUID(),
      progress: 0,
      cycleTime: rollCycleTime(building.type),  // fixed speed assigned at placement
      heldItems: {},
      totalProduced: 0,
    }
    set((s) => ({ buildings: [...s.buildings, newBuilding] }))
  },

  removeBuilding: (id) => {
    set((s) => ({ buildings: s.buildings.filter((b) => b.id !== id) }))
  },

  moveBuilding: (id, newSlotIndex, newSide) => {
    set((s) => ({
      buildings: s.buildings.map((b) =>
        b.id === id
          ? { ...b, slotIndex: newSlotIndex, side: newSide, cycleTime: rollCycleTime(b.type), progress: 0, heldItems: {} }
          : b
      ),
    }))
  },

  tick: () => {
    const state = get()
    const next = engineTick(state)
    if (next.ticks % 5 === 0) saveToStorage(next)
    set(() => next)
  },
}))
