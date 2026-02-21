import type { BuildingType, Item } from './types'

export const BELT_LENGTH = 40
export const TICK_MS = 500
export const RESOURCE_COUNT = 5  // fixed 5 ore patches, slots 0-4

export const PROCESSING_TICKS: Record<BuildingType, number> = {
  miner: 2,
  furnace: 4,
  assembler_gear: 3,
  assembler_wire: 3,
  assembler_science: 3,
  lab: 5,
}

export const RECIPES: Record<BuildingType, { inputs: Partial<Record<Item, number>>; output: Item | null }> = {
  miner: { inputs: {}, output: null },
  furnace: {
    inputs: { iron_ore: 1 },
    output: null,
  },
  assembler_gear: { inputs: { iron_plate: 1 }, output: 'gear' },
  assembler_wire: { inputs: { copper_plate: 1 }, output: 'wire' },
  assembler_science: { inputs: { gear: 1, wire: 1 }, output: 'science' },
  lab: { inputs: { science: 1 }, output: null },
}

export const ITEM_COLORS: Record<Item, string> = {
  iron_ore:     '#6b7280',
  copper_ore:   '#b45309',
  iron_plate:   '#9ca3af',
  copper_plate: '#d97706',
  gear:         '#4b5563',
  wire:         '#92400e',
  science:      '#4f46e5',
}

export const ITEM_EMOJI: Record<Item, string> = {
  iron_ore:     '🪨',
  copper_ore:   '🟤',
  iron_plate:   '🔲',
  copper_plate: '🟧',
  gear:         '⚙️',
  wire:         '〰️',
  science:      '🔬',
}

export const BUILDING_EMOJI: Record<BuildingType, string> = {
  miner:             '⛏️',
  furnace:           '🔥',
  assembler_gear:    '⚙️',
  assembler_wire:    '🔌',
  assembler_science: '🔬',
  lab:               '🧪',
}

export const BUILDING_LABELS: Record<BuildingType, string> = {
  miner:             'Miner',
  furnace:           'Furnace',
  assembler_gear:    'Gear Asm.',
  assembler_wire:    'Wire Asm.',
  assembler_science: 'Sci. Asm.',
  lab:               'Lab',
}

export const BUILDING_DESCRIPTIONS: Record<BuildingType, string> = {
  miner:             'Place on ore tile. Mines ore onto belt.',
  furnace:           'Smelts iron/copper ore into plates.',
  assembler_gear:    'Crafts iron plates into gears.',
  assembler_wire:    'Crafts copper plates into wire.',
  assembler_science: 'Combines gear + wire into science.',
  lab:               'Consumes science packs. Counts SPM.',
}
