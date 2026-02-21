import { useState } from 'react'
import { BUILDING_EMOJI, ITEM_COLORS, ITEM_EMOJI } from '../game/constants'

const ORE_COLOR = ITEM_COLORS['iron_ore']
const COPPER_COLOR = ITEM_COLORS['copper_ore']

function Row({ children }: { children: React.ReactNode }) {
  return <div className="flex items-center gap-2 text-sm">{children}</div>
}

function Arrow() {
  return <span className="text-white/30 font-bold">→</span>
}

function ItemBadge({ item, label }: { item: keyof typeof ITEM_EMOJI; label?: string }) {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
      style={{ backgroundColor: `${ITEM_COLORS[item]}33`, border: `1px solid ${ITEM_COLORS[item]}66`, color: '#fff' }}>
      {ITEM_EMOJI[item]} {label ?? item.replace('_', ' ')}
    </span>
  )
}

function Building({ type, label }: { type: keyof typeof BUILDING_EMOJI; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded border border-white/20 bg-white/5 text-xs text-white/80 font-medium">
      {BUILDING_EMOJI[type]} {label}
    </span>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="text-[10px] font-bold uppercase tracking-widest text-white/30">{title}</div>
      {children}
    </div>
  )
}

export function QuickGuide() {
  const [open, setOpen] = useState(false)

  return (
    <div className="mt-4">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 text-xs text-white/30 hover:text-white/60 transition-colors select-none"
      >
        <span>{open ? '▾' : '▸'}</span>
        <span className="font-semibold uppercase tracking-widest">Quick Guide</span>
      </button>

      {open && (
        <div className="mt-3 flex flex-col gap-5 text-white/70">

          {/* Production chain */}
          <Section title="Production Chain">
            <div className="flex flex-col gap-1.5">
              <Row>
                <span className="w-3 h-3 rounded-full inline-block shrink-0" style={{ backgroundColor: ORE_COLOR }} />
                <ItemBadge item="iron_ore" label="iron ore" />
                <Arrow />
                <Building type="furnace" label="Furnace" />
                <Arrow />
                <ItemBadge item="iron_plate" label="iron plate" />
                <Arrow />
                <Building type="assembler_gear" label="Gear Asm." />
                <Arrow />
                <ItemBadge item="gear" label="gear" />
              </Row>
              <Row>
                <span className="w-3 h-3 rounded-full inline-block shrink-0" style={{ backgroundColor: COPPER_COLOR }} />
                <ItemBadge item="copper_ore" label="copper ore" />
                <Arrow />
                <Building type="furnace" label="Furnace" />
                <Arrow />
                <ItemBadge item="copper_plate" label="copper plate" />
                <Arrow />
                <Building type="assembler_wire" label="Wire Asm." />
                <Arrow />
                <ItemBadge item="wire" label="wire" />
              </Row>
              <Row>
                <span className="text-white/20 text-xs pl-4">gear + wire</span>
                <Arrow />
                <Building type="assembler_science" label="Sci. Asm." />
                <Arrow />
                <ItemBadge item="science" label="science" />
                <Arrow />
                <Building type="lab" label="Lab" />
                <Arrow />
                <span className="text-indigo-400 text-xs font-bold">SPM ↑</span>
              </Row>
            </div>
          </Section>

          {/* Buildings */}
          <Section title="Buildings">
            <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-xs">
              <div className="flex items-start gap-2">
                <span>{BUILDING_EMOJI['miner']}</span>
                <div><span className="text-white/80 font-medium">Miner</span> — place on a colored ore tile only. Mines onto belt.</div>
              </div>
              <div className="flex items-start gap-2">
                <span>{BUILDING_EMOJI['furnace']}</span>
                <div><span className="text-white/80 font-medium">Furnace</span> — smelts ore → plate. Accepts iron or copper.</div>
              </div>
              <div className="flex items-start gap-2">
                <span>{BUILDING_EMOJI['assembler_gear']}</span>
                <div><span className="text-white/80 font-medium">Gear Asm.</span> — iron plate → gear.</div>
              </div>
              <div className="flex items-start gap-2">
                <span>{BUILDING_EMOJI['assembler_wire']}</span>
                <div><span className="text-white/80 font-medium">Wire Asm.</span> — copper plate → wire.</div>
              </div>
              <div className="flex items-start gap-2">
                <span>{BUILDING_EMOJI['assembler_science']}</span>
                <div><span className="text-white/80 font-medium">Sci. Asm.</span> — needs 1 gear + 1 wire → science pack.</div>
              </div>
              <div className="flex items-start gap-2">
                <span>{BUILDING_EMOJI['lab']}</span>
                <div><span className="text-white/80 font-medium">Lab</span> — consumes science. Increases your SPM score.</div>
              </div>
            </div>
          </Section>

          {/* Belt & lane rules */}
          <Section title="Belt Rules">
            <div className="flex flex-col gap-1 text-xs">
              <Row>
                <span className="text-white/50">📦</span>
                <span>Items flow <strong className="text-white/80">left → right</strong>. Items that fall off the end are lost to space 🚀.</span>
              </Row>
              <Row>
                <span className="text-white/50">↕️</span>
                <span>Two lanes: <strong className="text-white/80">UP</strong> (top row of buildings) and <strong className="text-white/80">DOWN</strong> (bottom row).</span>
              </Row>
              <Row>
                <span className="text-white/50">🔀</span>
                <span>Buildings output to <strong className="text-white/80">their own lane</strong>, but can pull inputs from <strong className="text-white/80">either lane</strong>.</span>
              </Row>
              <Row>
                <span className="text-yellow-400">⚠️</span>
                <span>Red pulse = stalled. The building has a finished item it can't place because the belt slot is full.</span>
              </Row>
            </div>
          </Section>

          {/* Placement & tips */}
          <Section title="Placement">
            <div className="flex flex-col gap-1 text-xs">
              <Row>
                <span className="text-white/50">🖱️</span>
                <span><strong className="text-white/80">Drag</strong> a building from the sidebar onto any empty slot, or <strong className="text-white/80">click</strong> an empty slot to pick.</span>
              </Row>
              <Row>
                <span className="text-white/50">✕</span>
                <span>Hover a placed building and click the red <strong className="text-white/80">×</strong> button to remove it.</span>
              </Row>
              <Row>
                <span className="text-white/50">🎲</span>
                <span>Every machine gets a <strong className="text-white/80">random speed</strong> (±35%) when placed. Moving it re-rolls the speed.</span>
              </Row>
            </div>
          </Section>

          {/* Strategy tips */}
          <Section title="Strategy Tips">
            <div className="flex flex-col gap-1 text-xs text-white/50">
              <Row><span>•</span><span>Colored tiles (slots 0–4) are ore patches — miners only work there.</span></Row>
              <Row><span>•</span><span>Science assemblers need both gear AND wire to arrive at the same slot before crafting starts.</span></Row>
              <Row><span>•</span><span>If the belt is congested, add more Labs downstream to consume items faster.</span></Row>
              <Row><span>•</span><span>A fast miner paired with a slow furnace will stall — watch the progress bars.</span></Row>
              <Row><span>•</span><span>Items lost to space are a sign of overproduction, not failure — use them as a flow signal.</span></Row>
            </div>
          </Section>

        </div>
      )}
    </div>
  )
}
