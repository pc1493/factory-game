import { PROCESSING_TICKS } from './constants'
import type { Building, GameState, Item } from './types'

function advanceLane(lane: (Item | null)[]): { lane: (Item | null)[], lost: boolean } {
  const next = [...lane]
  const lost = next[next.length - 1] !== null
  for (let i = next.length - 1; i > 0; i--) {
    next[i] = next[i - 1]
  }
  next[0] = null
  return { lane: next, lost }
}

/**
 * Try to pull one of the wanted items from either belt lane at the given slot.
 * Removes the item from whichever lane has it first (up checked first).
 * Returns the item pulled, or null if neither lane has a wanted item there.
 */
function pullFromEitherLane(
  up: (Item | null)[],
  down: (Item | null)[],
  slot: number,
  wanted: Item[]
): Item | null {
  for (const lane of [up, down]) {
    const item = lane[slot]
    if (item !== null && wanted.includes(item)) {
      lane[slot] = null
      return item
    }
  }
  return null
}

export function tick(state: GameState): GameState {
  const up: (Item | null)[] = [...state.belts.up]
  const down: (Item | null)[] = [...state.belts.down]
  const buildings: Building[] = state.buildings.map((b) => ({
    ...b,
    heldItems: { ...b.heldItems },
  }))
  const resources = state.resources
  const stats = {
    ...state.stats,
    produced: { ...state.stats.produced },
    history: [...state.stats.history],
  }
  const ticks = state.ticks + 1
  let scienceThisTick = 0

  // 1. Advance both belt lanes
  {
    const upAdv = advanceLane(up)
    const downAdv = advanceLane(down)
    up.splice(0, up.length, ...upAdv.lane)
    down.splice(0, down.length, ...downAdv.lane)
    if (upAdv.lost) stats.lostToSpace++
    if (downAdv.lost) stats.lostToSpace++
  }

  // 2. Process buildings sorted: slotIndex asc, left(up) before right(down)
  const sorted = [...buildings].sort((a, b) => {
    if (a.slotIndex !== b.slotIndex) return a.slotIndex - b.slotIndex
    if (a.side === 'left' && b.side === 'right') return -1
    if (a.side === 'right' && b.side === 'left') return 1
    return 0
  })

  const byId = new Map<string, Building>()
  for (const b of buildings) byId.set(b.id, b)

  for (const _b of sorted) {
    const b = byId.get(_b.id)!
    const slot = b.slotIndex
    // Each building outputs only to its own lane
    const outLane = b.side === 'left' ? up : down

    switch (b.type) {
      case 'miner': {
        // Miners produce from the ground — no belt input, output to own lane only
        const resource = resources.find((r) => r.slotIndex === slot)
        if (!resource) break
        b.progress++
        if (b.progress >= PROCESSING_TICKS.miner) {
          if (outLane[slot] === null) {
            outLane[slot] = resource.type
            b.progress = 0
            b.totalProduced++
            stats.produced[resource.type]++
          } else {
            b.progress = PROCESSING_TICKS.miner  // stall
          }
        }
        break
      }

      case 'furnace': {
        // Output ready plate — try to place on own lane
        if (b.heldItems['iron_plate'] || b.heldItems['copper_plate']) {
          const outItem: Item = b.heldItems['iron_plate'] ? 'iron_plate' : 'copper_plate'
          if (outLane[slot] === null) {
            outLane[slot] = outItem
            delete b.heldItems[outItem]
            b.totalProduced++
            stats.produced[outItem]++
          }
          break
        }
        // Processing ore already in hand
        if (b.heldItems['iron_ore'] || b.heldItems['copper_ore']) {
          b.progress++
          if (b.progress >= PROCESSING_TICKS.furnace) {
            const ore: Item = b.heldItems['iron_ore'] ? 'iron_ore' : 'copper_ore'
            const plate: Item = ore === 'iron_ore' ? 'iron_plate' : 'copper_plate'
            delete b.heldItems[ore]
            b.heldItems[plate] = 1
            b.progress = 0
          }
          break
        }
        // Try to grab ore from either lane
        const grabbed = pullFromEitherLane(up, down, slot, ['iron_ore', 'copper_ore'])
        if (grabbed !== null) {
          b.heldItems[grabbed] = 1
          b.progress = 0
        }
        break
      }

      case 'assembler_gear': {
        // Output ready gear
        if (b.heldItems['gear']) {
          if (outLane[slot] === null) {
            outLane[slot] = 'gear'
            delete b.heldItems['gear']
            b.totalProduced++
            stats.produced['gear']++
          }
          break
        }
        // Processing iron plate already in hand
        if (b.heldItems['iron_plate']) {
          b.progress++
          if (b.progress >= PROCESSING_TICKS.assembler_gear) {
            delete b.heldItems['iron_plate']
            b.heldItems['gear'] = 1
            b.progress = 0
          }
          break
        }
        // Try to grab iron plate from either lane
        const grabbed = pullFromEitherLane(up, down, slot, ['iron_plate'])
        if (grabbed !== null) {
          b.heldItems['iron_plate'] = 1
          b.progress = 0
        }
        break
      }

      case 'assembler_wire': {
        // Output ready wire
        if (b.heldItems['wire']) {
          if (outLane[slot] === null) {
            outLane[slot] = 'wire'
            delete b.heldItems['wire']
            b.totalProduced++
            stats.produced['wire']++
          }
          break
        }
        // Processing copper plate already in hand
        if (b.heldItems['copper_plate']) {
          b.progress++
          if (b.progress >= PROCESSING_TICKS.assembler_wire) {
            delete b.heldItems['copper_plate']
            b.heldItems['wire'] = 1
            b.progress = 0
          }
          break
        }
        // Try to grab copper plate from either lane
        const grabbed = pullFromEitherLane(up, down, slot, ['copper_plate'])
        if (grabbed !== null) {
          b.heldItems['copper_plate'] = 1
          b.progress = 0
        }
        break
      }

      case 'assembler_science': {
        // Output ready science pack
        if (b.heldItems['science']) {
          if (outLane[slot] === null) {
            outLane[slot] = 'science'
            delete b.heldItems['science']
            b.totalProduced++
            stats.produced['science']++
          }
          break
        }
        // Currently crafting
        if (b.progress > 0) {
          b.progress++
          if (b.progress >= PROCESSING_TICKS.assembler_science) {
            b.heldItems['science'] = 1
            b.progress = 0
          }
          break
        }
        // Try to collect gear and wire (one per tick, from either lane)
        if (!b.heldItems['gear']) {
          const g = pullFromEitherLane(up, down, slot, ['gear'])
          if (g !== null) b.heldItems['gear'] = 1
        } else if (!b.heldItems['wire']) {
          const w = pullFromEitherLane(up, down, slot, ['wire'])
          if (w !== null) b.heldItems['wire'] = 1
        }
        // Start crafting when both inputs are ready
        if (b.heldItems['gear'] && b.heldItems['wire']) {
          delete b.heldItems['gear']
          delete b.heldItems['wire']
          b.progress = 1
        }
        break
      }

      case 'lab': {
        // Currently processing a science pack
        if (b.progress > 0) {
          b.progress++
          if (b.progress >= PROCESSING_TICKS.lab) {
            b.progress = 0
            b.totalProduced++
            scienceThisTick++
          }
          break
        }
        // Try to grab science from either lane
        const grabbed = pullFromEitherLane(up, down, slot, ['science'])
        if (grabbed !== null) {
          b.heldItems['science'] = 1
          b.progress = 1
        }
        break
      }
    }
  }

  // 3. Record science history
  stats.history.push(scienceThisTick)
  if (stats.history.length > 240) {
    stats.history = stats.history.slice(-240)
  }

  return {
    belts: { up, down },
    buildings,
    resources,
    ticks,
    stats,
    running: state.running,
    speed: state.speed,
  }
}
