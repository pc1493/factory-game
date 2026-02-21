# Factory Game

A browser-based factory automation idle/puzzle game inspired by Factorio. Place miners, furnaces, and assemblers along a dual-lane conveyor belt to build production chains and maximize your **Science Per Minute (SPM)**.

---

## Gameplay

Resources flow along two independent belt lanes (UP and DOWN). Place buildings alongside the belt to process items — mine ore, smelt plates, craft gears and wires, assemble science packs, and feed them into labs. Buildings can pull inputs from **either lane**, so you can mix and cross production chains however you like.

The goal is to produce science packs as efficiently as possible, measured in SPM.

### Production Chain

```
iron_ore   ──► Furnace ──► iron_plate ──► Gear Assembler ──► gear ──►┐
                                                                       Science Assembler ──► science ──► Lab ──► SPM
copper_ore ──► Furnace ──► copper_plate ──► Wire Assembler ──► wire ──►┘
```

---

## Controls

| Action | How |
|---|---|
| Place building | Drag from sidebar → drop on belt slot |
| Move building | Drag placed building → drop on new slot |
| Remove building | Hover building → click ✕ |
| Start / Pause | Button in header |
| Change speed | 0.5× / 1× / 2× / 4× buttons |
| Reset game | Reset button (clears save) |

---

## Buildings

| Building | Input | Output | Ticks |
|---|---|---|---|
| Miner ⛏️ | Ground ore (must be on ore patch) | iron_ore / copper_ore | 2 |
| Furnace 🔥 | iron_ore or copper_ore | iron_plate / copper_plate | 4 |
| Gear Assembler ⚙️ | iron_plate | gear | 3 |
| Wire Assembler 🔌 | copper_plate | wire | 3 |
| Science Assembler 🔬 | gear + wire | science | 3 |
| Lab 🧪 | science | SPM count | 5 |

- One tick = 500ms at 1× speed
- Buildings can pull inputs from **either** belt lane
- Buildings always output to their **own** lane (UP or DOWN)

---

## Belt System

- **40 slots** per lane (UP and DOWN)
- Items advance one slot per tick toward the right (toward space 🚀)
- Items that fall off the end are counted as **Lost to Space**
- Ore patches occupy slots 0–4 (leftmost 5 tiles), assigned randomly as iron or copper

---

## Stats

- **SPM** — Science Per Minute, rolling 60-second window
- **Lifetime produced** — total of each item ever made
- **Lost to Space** — items that fell off the belt end
- **Ticks** — total game ticks elapsed

---

## Tech Stack

| Layer | Technology |
|---|---|
| UI Framework | React 19 |
| State Management | Zustand 5 |
| Drag & Drop | @dnd-kit/core 6 |
| Styling | Tailwind CSS 4 |
| Build Tool | Vite 7 |
| Language | TypeScript 5 |

---

## Development

```bash
npm install
npm run dev      # Dev server (http://localhost:5173)
npm run build    # Production build
npm run lint     # ESLint
```

Save data is stored in `localStorage` under the key `factory-automation-save`. The save format is versioned — old saves are automatically discarded when the format changes (currently `SAVE_VERSION = 4`).

---

## Project Structure

```
src/
├── game/
│   ├── types.ts        # Core type definitions
│   ├── constants.ts    # Game config (belt length, tick speed, recipes, visuals)
│   ├── engine.ts       # Pure tick() function — all game simulation logic
│   ├── store.ts        # Zustand store + localStorage persistence
│   └── utils.ts        # SPM calc, resource generation, belt helpers
└── components/
    ├── GameBoard.tsx       # Main layout + drag-drop context
    ├── Belt.tsx            # Dual-lane belt with building rows
    ├── BuildingSlot.tsx    # Placeable building slot (droppable)
    ├── BeltSlot.tsx        # Individual belt item cell
    ├── BuildingIcon.tsx    # Building emoji, progress bar, stall indicator
    ├── BuildingPalette.tsx # Sidebar building picker
    ├── DraggableBuilding.tsx
    ├── DroppableSlot.tsx
    ├── ItemIcon.tsx
    └── StatsPanel.tsx
```
