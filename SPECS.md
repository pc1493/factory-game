# Factory Game — Technical Specifications

> Living document. Update as mechanics evolve.

---

## Overview

A **stochastic**, tick-based factory automation game running entirely in the browser. No server. No external services. All game state lives in a Zustand store, persisted to `localStorage`. The simulation is a pure function: `tick(state) → state`. Each building has a randomized cycle time that re-rolls every production run, making ratios non-deterministic and encouraging adaptive play.

---

## Engine Architecture

### Tick Loop

- **Interval:** `TICK_MS / speed` milliseconds (default 500ms)
- **Speed multipliers:** 0.5×, 1×, 2×, 4×
- **Persistence:** state saved to localStorage every 5 ticks
- **Save versioning:** `SAVE_VERSION = 6` — mismatched saves are silently discarded and a fresh game starts

### tick() Function (engine.ts)

Pure function. Takes `GameState`, returns new `GameState`. No side effects.

**Execution order per tick:**

1. **Advance both belt lanes** — each lane shifts all items one slot to the right; items at slot 39 are lost to space
2. **Sort buildings** — by `slotIndex` ascending, then `side === 'left'` before `'right'` at same index
3. **Process each building** — in sorted order (see Building Logic below)
4. **Record science history** — append `scienceThisTick` to `stats.history`, trim to 240 entries

### Cross-Lane Input (pullFromEitherLane)

```
pullFromEitherLane(up, down, slot, wanted[]) → Item | null
```

Checks UP lane first, then DOWN. If a wanted item is at `slot` in either lane, removes it and returns it. Miners are the only exception — they never pull from the belt.

### Randomized Cycle Times

Each building stores a `cycleTime` field (integer ticks) that is fixed for the lifetime of its placement.

```
rollCycleTime(type) → integer
  base = PROCESSING_TICKS[type]
  lo   = base * (1 - PROCESSING_JITTER)   // PROCESSING_JITTER = 0.35
  hi   = base * (1 + PROCESSING_JITTER)
  return max(1, round(lo + random() * (hi - lo)))
```

- Rolled **once** when a building is placed or moved — never changes while it sits in a slot
- Moving a building re-rolls its cycleTime (and resets progress/heldItems)
- Each machine has a fixed "personality" — a slow furnace stays slow until relocated
- Affects progress bar rendering — the bar fills `progress / cycleTime`
- Makes it impossible to compute a perfectly balanced ratio; players must observe and adapt

---

## Belt System

| Property | Value |
|---|---|
| Lane count | 2 (UP, DOWN) |
| Slots per lane | 40 |
| Item advance | 1 slot per tick, rightward |
| Overflow behavior | Item is lost, `stats.lostToSpace++` |
| Ore patch slots | 0–4 (fixed, 5 patches) |

**Side mapping:**
- `side = 'left'` → reads/writes UP lane
- `side = 'right'` → reads/writes DOWN lane

Buildings always **output** to their own lane. Buildings can **input** from either lane.

---

## Resource Generation

- 5 ore patches, always at `slotIndex` 0–4
- Each patch randomly assigned `iron_ore` or `copper_ore` (50/50) on new game
- Resources are immutable during gameplay — same reference passed through all ticks

---

## Building Logic

All buildings follow a priority order within their tick: **output first, then process, then input**.

### Miner ⛏️
- Requires a `Resource` at matching `slotIndex`
- Increments `progress` each tick
- At `progress >= PROCESSING_TICKS.miner (2)`: if own lane slot is free, places ore; else stalls (`progress` stays at max)
- Outputs to own lane only

### Furnace 🔥
- **Output phase:** if `heldItems` contains a finished plate and own lane slot is free → place plate, clear held item
- **Process phase:** if holding ore → increment `progress`; at `>= PROCESSING_TICKS.furnace (4)` → convert ore to plate
- **Input phase:** pull any ore from either lane via `pullFromEitherLane`

### Gear Assembler ⚙️
- **Output:** if `heldItems['gear']` and own lane free → place gear
- **Process:** if `heldItems['iron_plate']` → increment progress; at `>= PROCESSING_TICKS.assembler_gear (3)` → produce gear
- **Input:** pull `iron_plate` from either lane

### Wire Assembler 🔌
- Same pattern as Gear Assembler but `copper_plate → wire`
- `PROCESSING_TICKS.assembler_wire = 3`

### Science Assembler 🔬
- **Output:** if `heldItems['science']` and own lane free → place science
- **Crafting:** if `progress > 0` → increment; at `>= PROCESSING_TICKS.assembler_science (3)` → produce science
- **Input collection (one item per tick):**
  - If no gear held → try to pull gear from either lane
  - Else if no wire held → try to pull wire from either lane
- **Start crafting:** if both gear and wire held → delete both, set `progress = 1`

### Lab 🧪
- **Processing:** if `progress > 0` → increment; at `>= PROCESSING_TICKS.lab (5)` → reset progress, `totalProduced++`, `scienceThisTick++`
- **Input:** pull `science` from either lane, set `progress = 1`
- No output to belt

---

## Processing Times

Base values (actual cycleTime varies ±35% each cycle):

| Building | Base Ticks | Range (ticks) | Base Time at 1× | Range at 1× |
|---|---|---|---|---|
| Miner | 6 | 4–8 | 3.0s | 2.0–4.0s |
| Furnace | 6 | 4–8 | 3.0s | 2.0–4.0s |
| Gear Assembler | 4 | 3–5 | 2.0s | 1.5–2.5s |
| Wire Assembler | 4 | 3–5 | 2.0s | 1.5–2.5s |
| Science Assembler | 5 | 3–7 | 2.5s | 1.5–3.5s |
| Lab | 6 | 4–8 | 3.0s | 2.0–4.0s |

---

## Recipes

| Building | Input(s) | Output |
|---|---|---|
| Miner | — | ore (type from ground) |
| Furnace | 1× iron_ore | 1× iron_plate |
| Furnace | 1× copper_ore | 1× copper_plate |
| Gear Assembler | 1× iron_plate | 1× gear |
| Wire Assembler | 1× copper_plate | 1× wire |
| Science Assembler | 1× gear + 1× wire | 1× science |
| Lab | 1× science | +1 SPM count |

---

## SPM Calculation

```
windowTicks = 120  (last 60 seconds at 2 ticks/s)
recent = history.slice(-120)
coveredSeconds = recent.length / 2
SPM = (sum(recent) / coveredSeconds) * 60
```

`stats.history` is a per-tick append (0 or 1 science per tick). Capped at 240 entries.

---

## Building Placement

Two methods to place buildings:
1. **Drag & drop** — drag from sidebar palette, drop onto any empty slot
2. **Click to place** — click any empty slot to open a modal picker showing all 6 building types with descriptions; Miner is disabled if the slot has no ore patch

Both methods call `placeBuilding()` in the store, which rolls a randomized `cycleTime` for the new machine.

---

## State Shape (GameState)

```typescript
interface GameState {
  belts: {
    up:   (Item | null)[]   // length 40
    down: (Item | null)[]   // length 40
  }
  buildings: Building[]
  resources:  Resource[]    // immutable after generation
  ticks:      number
  stats: {
    produced:    Record<Item, number>
    history:     number[]   // science per tick, max 240 entries
    lostToSpace: number
  }
  running: boolean
  speed:   number           // 0.5 | 1 | 2 | 4
}

interface Building {
  id:           string      // UUID
  type:         BuildingType
  side:         'left' | 'right'
  slotIndex:    number      // 0–39
  progress:     number
  cycleTime:    number      // randomized each cycle; ticks to complete one production run
  heldItems:    Partial<Record<Item, number>>
  totalProduced: number
}

interface Resource {
  slotIndex: number         // 0–4
  type:      OreType
}
```

---

## Item Types

```
OreType  = 'iron_ore' | 'copper_ore'
Item     = 'iron_ore' | 'copper_ore' | 'iron_plate' | 'copper_plate'
         | 'gear' | 'wire' | 'science'
```

---

## UI Architecture

| Component | Role |
|---|---|
| `App` | React ErrorBoundary wrapper; auto-clears bad saves on crash |
| `GameBoard` | DndContext, header, sidebar, main game area |
| `Belt` | Renders 4 rows: UP buildings / UP belt / DOWN belt / DOWN buildings |
| `BuildingSlot` | 40× per row; shows resource tint, hosts `DroppableSlot` + `BuildingIcon` |
| `BeltSlot` | Single belt cell; shows `ItemIcon` if occupied |
| `BuildingIcon` | Emoji + progress bar + stall warning (⚠️) + remove button |
| `BuildingPalette` | Sidebar list of 6 `DraggableBuilding` cards |
| `StatsPanel` | SPM display + collapsible lifetime stats |

### Drag & Drop (dnd-kit)
- Palette buildings are **sources** (`useDraggable`)
- Placed buildings are also draggable (for repositioning)
- Belt slots are **targets** (`useDroppable`)
- Drop handler: place new building or move existing one
- `DragOverlay` shows building emoji while dragging

---

## Persistence

| Property | Value |
|---|---|
| Storage key | `factory-automation-save` |
| Format | JSON |
| Save version | 6 |
| Save frequency | Every 5 ticks |
| Validation | Version match, belt array lengths, array types, stat fields; building fields backfilled defensively |
| On mismatch | Silent discard → fresh game |
| On crash | ErrorBoundary auto-removes save before showing error UI |

---

## Constants (constants.ts)

```typescript
BELT_LENGTH        = 40
TICK_MS            = 500
RESOURCE_COUNT     = 5
PROCESSING_JITTER  = 0.35   // ±35% variation on all cycle times
```

---

## Known Constraints & Design Decisions

- **Belt flows one direction only** (left → right). No reverse, no splitters, no mergers yet.
- **One building per slot per side.** Two buildings can share a slot index (one UP, one DOWN).
- **Miners must be placed on ore patches** (slots 0–4). If placed elsewhere they do nothing.
- **No item queuing** — buildings hold at most 1 item internally (except Science Assembler which holds 2).
- **No inserters** — buildings pull directly from the belt; side of belt doesn't restrict input.
- **Ore patches are random per new game** and not persisted separately (saved in `resources` array).
