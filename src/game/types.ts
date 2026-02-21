export type OreType = 'iron_ore' | 'copper_ore'

export type Item =
  | 'iron_ore'
  | 'copper_ore'
  | 'iron_plate'
  | 'copper_plate'
  | 'gear'
  | 'wire'
  | 'science'

export type BuildingType =
  | 'miner'
  | 'furnace'
  | 'assembler_gear'
  | 'assembler_wire'
  | 'assembler_science'
  | 'lab'

export type Side = 'left' | 'right'  // left = UP lane, right = DOWN lane

export interface Resource {
  slotIndex: number
  type: OreType
}

export interface Building {
  id: string
  type: BuildingType
  side: Side
  slotIndex: number
  progress: number
  cycleTime: number       // randomized each cycle; ticks to complete one production run
  heldItems: Partial<Record<Item, number>>
  totalProduced: number
}

export interface Stats {
  produced: Record<Item, number>
  history: number[]
  lostToSpace: number
}

export interface Belts {
  up: (Item | null)[]    // UP lane — left buildings read/write here
  down: (Item | null)[]  // DOWN lane — right buildings read/write here
}

export interface GameState {
  belts: Belts
  buildings: Building[]
  resources: Resource[]
  ticks: number
  stats: Stats
  running: boolean
  speed: number
}
