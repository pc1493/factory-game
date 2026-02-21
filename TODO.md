# Factory Game — TODO

> Track ongoing development. Update this file as tasks are completed, discovered, or reprioritized.
> Format: `- [ ]` pending · `- [x]` done · `- [~]` in progress

---

## Milestone 1 — Playtest & Core Gameplay Polish
*Current focus. UI is placeholder-quality; mechanics need validation.*

- [ ] **Playtest the full production chain** — iron_ore → iron_plate → gear; copper_ore → copper_plate → wire → science → lab
- [ ] **Verify cross-lane pulling works correctly** — buildings should consume from either belt lane, not just their own
- [ ] **Fix any stall/deadlock bugs** — identify cases where the belt gets congested and items can't move
- [ ] **Balance processing tick times** — miner (2), furnace (4), assembler (3), lab (5): does throughput make sense?
- [ ] **Tune belt speed** — 40 slots at 1 item/tick: does it feel fast enough? too slow?
- [ ] **Verify miners stall correctly** — miner should freeze (not reset progress) when belt slot is full
- [ ] **Verify science assembler collects both inputs** — gear and wire must both arrive before crafting begins
- [ ] **Test speed multipliers** — 0.5×, 2×, 4× should all feel correct, no drift or dropped ticks
- [ ] **Confirm Lost to Space counter works** — items falling off right edge should be counted
- [ ] **Confirm SPM calculation** — rolling 60s window; check against manual count
- [ ] **Test save/load cycle** — pause, reload page, verify game state restores correctly
- [ ] **Test reset** — should clear localStorage and start a completely fresh game

---

## Milestone 2 — Gameplay Features
*Planned additions to deepen the game loop.*

- [ ] **Item tooltips** — hover over a belt item to see what it is (text label, not just emoji)
- [ ] **Building throughput display** — show items/minute rate on each building card
- [ ] **Bottleneck highlighting** — visually flag stalled buildings so player can diagnose congestion
- [ ] **Ore patch labels** — show ore type clearly in the resource slots (not just color tint)
- [ ] **Belt direction indicator** — show the flow direction (left → right arrow) more clearly
- [ ] **Slot numbers** — optional slot index labels for precision placement
- [ ] **Undo last placement** — Ctrl+Z to remove the most recently placed building
- [ ] **Building count limit or cost** — add scarcity/resource to building placement decisions
- [ ] **Multiple ore patch layouts** — randomize or allow choosing map layouts at game start

---

## Milestone 3 — New Mechanics
*Extends the production graph.*

- [ ] **Inserters / belt splitters** — route items from one lane to another
- [ ] **Additional recipe tiers** — e.g., advanced science requiring multiple science packs, red/green/blue science progression
- [ ] **Research tree** — spend science packs to unlock new building types or belt upgrades
- [ ] **Belt speed upgrades** — research to increase items/tick or belt length
- [ ] **Storage / buffer chests** — hold items to smooth out production spikes
- [ ] **Overflow valves** — auto-void excess items of a chosen type to prevent belt jams
- [ ] **Power system** — buildings consume power; add power generators as a constraint

---

## Milestone 4 — UI / UX Improvements
*Polish the interface beyond playtest quality.*

- [ ] **Responsive layout** — support smaller screens and mobile touch
- [ ] **Animated belt items** — items should visually slide along the belt each tick
- [ ] **Production graph** — chart SPM over time (sparkline or mini-chart in StatsPanel)
- [ ] **Sound effects** — tick sounds, placement sounds, stall alerts
- [ ] **Color-blind mode** — replace emoji-only identification with text labels as fallback
- [ ] **Dark/light theme toggle**
- [ ] **Keyboard shortcuts** — e.g., number keys to select building type from palette
- [ ] **Tutorial / hint overlay** — first-time player guidance

---

## Milestone 5 — Infrastructure
*Code quality, testing, and deployment.*

- [ ] **Unit tests for engine.ts** — pure function is ideal for testing; cover all building types and edge cases
- [ ] **Integration tests** — simulate full production chains for N ticks and assert expected output
- [ ] **CI pipeline** — GitHub Actions: lint + build on every PR
- [ ] **Deploy to GitHub Pages** — `npm run build` + push `dist/` to `gh-pages` branch
- [ ] **Performance profiling** — check re-render counts at 4× speed with 40+ buildings
- [ ] **Engine benchmark** — measure tick() execution time; target < 1ms

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
- [x] localStorage persistence with save versioning
- [x] React ErrorBoundary — auto-clears bad saves on crash
- [x] Speed multiplier controls (0.5×, 1×, 2×, 4×)
- [x] SPM calculation (rolling 60s window)
- [x] Stats panel (lifetime produced, lost to space, ticks)
- [x] Belt extended from 20 to 40 slots
- [x] Resources fixed at 5 ore patches (slots 0–4)
- [x] README.md and SPECS.md written
