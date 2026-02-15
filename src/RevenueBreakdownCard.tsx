import { useId, useMemo, useState } from 'react'

type Datum = { label: string; value: number; color: string }

type DonutProps = {
  data: Datum[]
  activeIndex: number
  onActivate: (index: number) => void
  onDeactivate: () => void
  cx: number
  cy: number
  outerR: number
  innerR: number
  gapDeg?: number
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n))
}

function polarToCartesian(cx: number, cy: number, r: number, angleDegFrom12: number) {
  const a = ((angleDegFrom12 - 90) * Math.PI) / 180
  return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) }
}

function describeDonutSlice(
  cx: number,
  cy: number,
  outerR: number,
  innerR: number,
  startAngleDegFrom12: number,
  endAngleDegFrom12: number,
) {
  const a0 = ((startAngleDegFrom12 % 360) + 360) % 360
  const a1 = ((endAngleDegFrom12 % 360) + 360) % 360
  let delta = a1 - a0
  if (delta <= 0) delta += 360

  const largeArc = delta > 180 ? 1 : 0

  const p0 = polarToCartesian(cx, cy, outerR, startAngleDegFrom12)
  const p1 = polarToCartesian(cx, cy, outerR, endAngleDegFrom12)
  const p2 = polarToCartesian(cx, cy, innerR, endAngleDegFrom12)
  const p3 = polarToCartesian(cx, cy, innerR, startAngleDegFrom12)

  // Sweep flag 1 draws clockwise in SVG coordinate system.
  return [
    `M ${p0.x.toFixed(3)} ${p0.y.toFixed(3)}`,
    `A ${outerR} ${outerR} 0 ${largeArc} 1 ${p1.x.toFixed(3)} ${p1.y.toFixed(3)}`,
    `L ${p2.x.toFixed(3)} ${p2.y.toFixed(3)}`,
    `A ${innerR} ${innerR} 0 ${largeArc} 0 ${p3.x.toFixed(3)} ${p3.y.toFixed(3)}`,
    'Z',
  ].join(' ')
}

function mix(a: number, b: number, t: number) {
  return a + (b - a) * t
}

function parseHexColor(hex: string) {
  const h = hex.replace('#', '').trim()
  if (h.length !== 6) return { r: 255, g: 255, b: 255 }
  const r = Number.parseInt(h.slice(0, 2), 16)
  const g = Number.parseInt(h.slice(2, 4), 16)
  const b = Number.parseInt(h.slice(4, 6), 16)
  return { r, g, b }
}

function lighten(hex: string, t: number) {
  const { r, g, b } = parseHexColor(hex)
  const rr = Math.round(mix(r, 255, t))
  const gg = Math.round(mix(g, 255, t))
  const bb = Math.round(mix(b, 255, t))
  return `rgb(${rr} ${gg} ${bb})`
}

function DonutChart({
  data,
  activeIndex,
  onActivate,
  onDeactivate,
  cx,
  cy,
  outerR,
  innerR,
  gapDeg = 3,
}: DonutProps) {
  const total = data.reduce((acc, d) => acc + Math.max(0, d.value), 0) || 1
  const slices = useMemo(() => {
    const spans = data.map((d) => (Math.max(0, d.value) / total) * 360)
    return data.map((_, i) => {
      const span = spans[i] ?? 0
      const start = spans.slice(0, i).reduce((s, v) => s + v, 0)
      const end = start + span

      const shrink = clamp(gapDeg, 0, 12)
      const a0 = start + shrink / 2
      const a1 = end - shrink / 2
      const mid = (a0 + a1) / 2
      return { a0, a1, mid }
    })
  }, [data, total, gapDeg])

  return (
    <g onPointerLeave={onDeactivate}>
      {data.map((d, i) => {
        const sl = slices[i]
        if (!sl || sl.a1 <= sl.a0) return null

        const isActive = i === activeIndex
        const lift = isActive ? 3.5 : 0
        const mid = sl.mid
        const v = polarToCartesian(0, 0, 1, mid)
        const dx = v.x * lift
        const dy = v.y * lift

        const base = d.color
        const hi = lighten(base, 0.18)
        const gradId = `segGrad_${i}`

        return (
          <g key={d.label} transform={`translate(${dx.toFixed(3)} ${dy.toFixed(3)})`}>
            <defs>
              <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor={hi} stopOpacity={0.92} />
                <stop offset="0.6" stopColor={base} stopOpacity={0.84} />
                <stop offset="1" stopColor={base} stopOpacity={0.66} />
              </linearGradient>
            </defs>

            <path
              className={`rbc_seg${isActive ? ' rbc_segActive' : ''}`}
              d={describeDonutSlice(cx, cy, outerR, innerR, sl.a0, sl.a1)}
              fill={`url(#${gradId})`}
              filter="url(#rbc_softShadow)"
              role="button"
              tabIndex={0}
              aria-label={`${d.label}: ${d.value}`}
              onPointerEnter={() => onActivate(i)}
              onFocus={() => onActivate(i)}
              onBlur={onDeactivate}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  onActivate(i)
                }
              }}
            />
          </g>
        )
      })}

      {/* Ring highlights */}
      <circle
        cx={cx}
        cy={cy}
        r={outerR - 1}
        fill="none"
        stroke="rgba(255,255,255,0.07)"
        strokeWidth={1}
        opacity={0.55}
        pointerEvents="none"
      />
      <circle
        cx={cx}
        cy={cy}
        r={innerR + 1}
        fill="none"
        stroke="rgba(0,0,0,0.35)"
        strokeWidth={1}
        opacity={0.9}
        pointerEvents="none"
      />
    </g>
  )
}

function TooltipPill({ x, y, label, value }: { x: number; y: number; label: string; value: string }) {
  const padX = 10
  const padY = 7
  const gap = 8
  const chipPadX = 10

  // Approximate text measurement to keep deterministic without DOM measurement.
  const w1 = 7.2 * label.length + chipPadX * 2
  const w2 = 7.2 * value.length + chipPadX * 2
  const h = 24
  const w = w1 + w2 + gap + padX * 2

  const x0 = x - w / 2
  const y0 = y - h / 2

  return (
    <g className="rbc_tooltip" transform={`translate(${x0.toFixed(2)} ${y0.toFixed(2)})`} pointerEvents="none">
      <rect
        x={0}
        y={0}
        width={w}
        height={h}
        rx={12}
        fill="rgba(34,34,34,0.88)"
        stroke="rgba(255,255,255,0.08)"
      />
      <rect x={padX} y={padY - 1} width={w1} height={h - padY * 2 + 2} rx={999} fill="rgba(0,0,0,0.28)" />
      <rect
        x={padX + w1 + gap}
        y={padY - 1}
        width={w2}
        height={h - padY * 2 + 2}
        rx={999}
        fill="rgba(0,0,0,0.28)"
      />
      <text x={padX + w1 / 2} y={h / 2 + 4} textAnchor="middle" fill="rgba(255,255,255,0.78)" fontSize={10}>
        {label}
      </text>
      <text
        x={padX + w1 + gap + w2 / 2}
        y={h / 2 + 4}
        textAnchor="middle"
        fill="rgba(255,255,255,0.78)"
        fontSize={10}
      >
        {value}
      </text>
    </g>
  )
}

export default function RevenueBreakdownCard() {
  const titleId = useId()
  const data: Datum[] = [
    { label: 'Sales', value: 126, color: '#8b8b8b' },
    { label: 'Fees', value: 58, color: '#6f6f6f' },
    { label: 'Subscriptions', value: 44, color: '#5b5b5b' },
    { label: 'Other', value: 32, color: '#4e4e4e' },
  ]

  const [activeIndex, setActiveIndex] = useState(0)
  const active = data[clamp(activeIndex, 0, data.length - 1)]

  return (
    <section className="rbc_card" aria-labelledby={titleId}>
      <style>{css}</style>

      <div className="rbc_title" id={titleId}>
        Revenue Breakdown
      </div>

      <div className="rbc_plot">
        <svg
          className="rbc_svg"
          viewBox="0 0 240 200"
          width="100%"
          height="100%"
          preserveAspectRatio="xMidYMid meet"
          role="img"
          aria-label="Revenue breakdown donut chart"
        >
          <defs>
            <filter id="rbc_softShadow" x="-40%" y="-40%" width="180%" height="180%">
              <feDropShadow dx="0" dy="10" stdDeviation="10" floodColor="rgba(0,0,0,0.55)" />
            </filter>
            <radialGradient id="rbc_backGlow" cx="0.25" cy="0.25" r="0.9">
              <stop offset="0" stopColor="rgba(255,255,255,0.08)" />
              <stop offset="0.7" stopColor="rgba(255,255,255,0.03)" />
              <stop offset="1" stopColor="rgba(255,255,255,0.00)" />
            </radialGradient>
          </defs>

          <rect x={10} y={14} width={220} height={172} rx={14} fill="rgba(0,0,0,0.12)" stroke="rgba(255,255,255,0.05)" />
          <rect x={10} y={14} width={220} height={172} rx={14} fill="url(#rbc_backGlow)" />

          <DonutChart
            data={data}
            activeIndex={activeIndex}
            onActivate={setActiveIndex}
            onDeactivate={() => setActiveIndex(0)}
            cx={90}
            cy={112}
            outerR={80}
            innerR={50}
            gapDeg={3.2}
          />

          <TooltipPill x={132} y={58} label={active.label} value={`$${active.value}`} />
        </svg>
      </div>
    </section>
  )
}

const css = String.raw`
.rbc_card{
  width: 100%;
  max-width: 420px;
  border-radius: 16px;
  padding: 14px 14px 16px;
  background: linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.03));
  border: 1px solid rgba(255,255,255,0.08);
  box-shadow: 0 18px 55px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.06);
}
.rbc_title{
  font-size: 12px;
  color: rgba(255,255,255,0.62);
  letter-spacing: 0.1px;
  margin-bottom: 10px;
}
.rbc_plot{
  width: 100%;
  aspect-ratio: 240 / 200;
}
.rbc_svg{
  display: block;
}
.rbc_seg{
  cursor: pointer;
  transition: filter 160ms ease, opacity 160ms ease;
  outline: none;
}
.rbc_seg:hover,
.rbc_seg:focus-visible{
  filter: brightness(1.12);
}
.rbc_segActive{
  opacity: 1;
}
.rbc_tooltip{
  filter: drop-shadow(0 10px 18px rgba(0,0,0,0.55));
}
@media (max-width: 420px){
  .rbc_card{ padding: 12px; }
}
`
