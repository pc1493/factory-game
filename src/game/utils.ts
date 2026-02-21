import { BELT_LENGTH, RESOURCE_COUNT } from './constants'
import type { Belts, Item, Resource, Stats } from './types'

export function generateResources(): Resource[] {
  const resources: Resource[] = []
  for (let i = 0; i < RESOURCE_COUNT; i++) {
    resources.push({
      slotIndex: i,
      type: Math.random() < 0.5 ? 'iron_ore' : 'copper_ore',
    })
  }
  return resources
}

export function makeInitialStats(): Stats {
  return {
    produced: {
      iron_ore: 0,
      copper_ore: 0,
      iron_plate: 0,
      copper_plate: 0,
      gear: 0,
      wire: 0,
      science: 0,
    },
    history: [],
    lostToSpace: 0,
  }
}

export function makeEmptyLane(): (Item | null)[] {
  return Array(BELT_LENGTH).fill(null)
}

export function makeInitialBelts(): Belts {
  return { up: makeEmptyLane(), down: makeEmptyLane() }
}

/** Rolling-60s SPM: history is one entry per tick, sum last 120 (60s at 2 ticks/s). */
export function calcSPM(history: number[]): number {
  const windowTicks = 120
  const recent = history.slice(-windowTicks)
  const total = recent.reduce((a, b) => a + b, 0)
  const coveredSeconds = recent.length / 2
  if (coveredSeconds === 0) return 0
  return (total / coveredSeconds) * 60
}
