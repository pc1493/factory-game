# Factory Game — TODO

> Track ongoing development. Update this file as tasks are completed, discovered, or reprioritized.
> Format: `- [ ]` pending · `- [x]` done · `- [~]` in progress

---

## Milestone 1 — Playtest & Core Gameplay Polish
*Current focus. Basic mechanics are in. Balancing and feel under active iteration.*

- [ ] **Playtest the full production chain** — iron_ore → iron_plate → gear; copper_ore → copper_plate → wire → science → lab
- [x] **Verify cross-lane pulling works** — buildings consume from either belt lane
- [ ] **Fix any stall/deadlock bugs** — identify cases where belt gets congested and nothing moves
- [x] **Balance processing tick times** — slowed miner (6 ticks base), added ±35% jitter to all buildings
- [ ] **Tune belt speed** — 40 slots at 1 item/tick: does it feel right at 1× speed?
- [x] **Verify miners stall correctly** — miner freezes (does not reset) when belt slot is full
- [ ] **Verify science assembler collects both inputs** — gear + wire both must arrive before crafting starts
- [ ] **Test speed multipliers** — 0.5×, 2×, 4× should all feel correct, no drift or dropped ticks
- [ ] **Confirm Lost to Space counter works** — items falling off right edge should increment
- [ ] **Confirm SPM calculation** — rolling 60s window; check against manual count
- [ ] **Test save/load cycle** — pause, reload page, verify game state restores correctly
- [ ] **Test reset** — should clear localStorage and start a completely fresh game
- [ ] **Further balance pass** — with randomness in place, are ratios still learnable? is 4× still needed to "feel fast"?

---

## Milestone 2 — Gameplay Features
*Planned additions to deepen the game loop.*

- [x] **Click-to-place building picker** — click any empty slot to open building chooser modal (in addition to drag-drop)
- [ ] **Item tooltips** — hover over a belt item to see what it is (text label, not just emoji)
- [ ] **Building throughput display** — show items/minute on each building card
- [ ] **Bottleneck highlighting** — visually flag stalled buildings so player can diagnose congestion
- [ ] **Ore patch labels** — show ore type text clearly in the resource slots, not just color tint
- [ ] **Belt direction indicator** — show flow direction (left → right) more clearly in UI
- [ ] **Slot numbers** — optional slot index labels for precision placement
- [ ] **Undo last placement** — Ctrl+Z to remove most recently placed building
- [ ] **Building count limit or cost** — add scarcity/friction to building placement decisions
- [ ] **Multiple ore patch layouts** — randomize or allow choosing map layouts at game start

---

## Milestone 3 — New Mechanics
*Extends the production graph and adds strategic depth.*

- [ ] **Inserters / belt splitters** — route items from one lane to the other
- [ ] **Additional recipe tiers** — red/green/blue science progression, each requiring more complex inputs
- [ ] **Research tree** — spend science packs to unlock new building types or belt upgrades
- [ ] **Belt speed upgrades** — research to increase items/tick or extend belt length
- [ ] **Storage / buffer chests** — hold items internally to smooth production spikes
- [ ] **Overflow valves** — auto-void excess items of a chosen type to prevent belt jams
- [ ] **Power system** — buildings consume power; add generators as a capacity constraint

---

## Milestone 4 — UI / UX Improvements
*Polish the interface beyond playtest quality.*

- [ ] **Responsive layout** — support smaller screens and mobile touch
- [ ] **Animated belt items** — items visually slide along the belt each tick
- [ ] **Production graph** — SPM sparkline chart in StatsPanel
- [ ] **Sound effects** — tick sounds, placement sounds, stall alerts
- [ ] **Color-blind mode** — text label fallbacks alongside emoji
- [ ] **Dark/light theme toggle**
- [ ] **Keyboard shortcuts** — number keys to select building type from palette
- [ ] **Tutorial / hint overlay** — first-time player guidance

---

## Milestone 5 — Infrastructure
*Code quality, testing, and deployment.*

- [ ] **Unit tests for engine.ts** — pure function is ideal; cover all building types, stall/unstall, randomness seeding
- [ ] **Integration tests** — simulate full chains for N ticks and assert expected output ranges
- [ ] **CI pipeline** — GitHub Actions: lint + build on every PR
- [ ] **Deploy to GitHub Pages** — `npm run build` + push `dist/` to `gh-pages` branch
- [ ] **Performance profiling** — re-render counts at 4× speed with 40+ buildings
- [ ] **Engine benchmark** — measure tick() execution time; target < 1ms

---

## Design Notes & Ideas
*Rough thoughts for future consideration.*

- **Randomness rationale:** ±35% jitter rolled once at placement means each machine has a fixed "personality" — a slow furnace is always slow until you move it. You can't compute a perfect ratio, but you can learn your specific factory's quirks. Moving a building re-rolls its speed and drops held items, so relocation is a meaningful decision.
- **Ratio design target:** With randomness, the "feel" should be: place a few miners, see what's short, add a building, repeat. Never fully optimal.
- **Interesting ratio tensions:**
  - Furnaces are slower than miners by default (6 ticks each, but miner is supply-limited by ore count)
  - Science assembler needs BOTH gear AND wire; if either is short, it idles — encourages balanced chains
  - Lab (6 ticks) is slower than science assembler (5 ticks base); a single lab can't consume science fast enough from multiple assemblers — encourages building multiple labs
- **Possible future ratio twist:** Make science assembler require 2× wire per science pack (vs 1×), forcing more copper investment
- **Belt as pressure valve:** Items falling off the end ("lost to space") is a natural overflow mechanism — it's a cost signal, not instant failure

---

## Bugs & Known Issues

- [ ] *(Add bugs here as discovered during playtesting)*

---

## Completed

- [x] Initial project scaffold (Vite + React 19 + Zustand + Tailwind + dnd-kit)
- [x] Dual-lane belt system (UP and DOWN independent lanes)
- [x] All 6 building types implemented in engine
- [x] Cross-lane input pulling (buildings consume from either belt lane)
- [x] Drag-and-drop building placement and repositioning
- [x] Click-to-place modal (click empty slot → building picker)
- [x] localStorage persistence with save versioning (v5)
- [x] React ErrorBoundary — auto-clears bad saves on crash
- [x] Speed multiplier controls (0.5×, 1×, 2×, 4×)
- [x] SPM calculation (rolling 60s window)
- [x] Stats panel (lifetime produced, lost to space, ticks)
- [x] Belt extended from 20 to 40 slots
- [x] Resources fixed at 5 ore patches (slots 0–4)
- [x] Randomized cycleTime per building — ±35% jitter, rolled once on placement/move (fixed per slot)
- [x] Moving a building re-rolls its cycleTime and resets progress/heldItems
- [x] Miner slowed to base 6 ticks (was 2) to prevent belt overflow
- [x] README.md, SPECS.md, TODO.md written
