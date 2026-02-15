import { useState } from 'react'
import { dailyVolumes, donutBreakdown, kpis } from '../data/mock'

function fmtMoney(n: number) {
  return n.toLocaleString(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
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

  return [
    `M ${p0.x.toFixed(3)} ${p0.y.toFixed(3)}`,
    `A ${outerR} ${outerR} 0 ${largeArc} 1 ${p1.x.toFixed(3)} ${p1.y.toFixed(3)}`,
    `L ${p2.x.toFixed(3)} ${p2.y.toFixed(3)}`,
    `A ${innerR} ${innerR} 0 ${largeArc} 0 ${p3.x.toFixed(3)} ${p3.y.toFixed(3)}`,
    'Z',
  ].join(' ')
}

function RevenueDonut({ size = 190 }: { size?: number }) {
  const [activeLabel, setActiveLabel] = useState<string | null>(null)
  const [activeAmount, setActiveAmount] = useState(0)
  const [tipX, setTipX] = useState(0)

  const cx = size / 2
  const cy = size / 2
  const outerR = 86
  const innerR = 56
  const gapDeg = 6
  const startAt = 220

  const total = donutBreakdown.reduce((s, d) => s + Math.max(0, d.value), 0) || 1
  const spans = donutBreakdown.map((d) => (Math.max(0, d.value) / total) * 360)
  const fills = ['rgba(255,255,255,0.22)', 'rgba(255,255,255,0.16)', 'rgba(255,255,255,0.11)'] as const

  type Seg = {
    key: string
    label: string
    path: string
    fill: string
    x: number
    amount: number
  }

  const maybeSegs: Array<Seg | null> = donutBreakdown
    .map((d, i) => {
      const span = spans[i] ?? 0
      const start = startAt + spans.slice(0, i).reduce((s, v) => s + v, 0)
      const end = start + span
      const a0 = start + gapDeg / 2
      const a1 = end - gapDeg / 2
      if (a1 <= a0) return null

      const mid = (a0 + a1) / 2
      const p = polarToCartesian(cx, cy, outerR, mid)
      return {
        key: d.label,
        label: d.label,
        path: describeDonutSlice(cx, cy, outerR, innerR, a0, a1),
        fill: fills[i % fills.length],
        x: p.x,
        amount: kpis.totalRevenue.value * d.value,
      }
    })

  const segs = maybeSegs.filter((s): s is Seg => s !== null)

  return (
    <div style={{ position: 'relative', width: size, height: size }} onPointerLeave={() => setActiveLabel(null)}>
      {activeLabel !== null ? (
        <div
          style={{
            position: 'absolute',
            left: tipX,
            top: 10,
            transform: 'translateX(-50%)',
            width: 170,
            borderRadius: 12,
            padding: '8px 10px',
            background: 'rgba(0,0,0,0.35)',
            border: '1px solid rgba(255,255,255,0.10)',
            boxShadow: '0 18px 40px rgba(0,0,0,0.45)',
            backdropFilter: 'blur(6px)',
            color: 'var(--text2)',
            fontSize: 10,
            pointerEvents: 'none',
            zIndex: 2,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}>
            <span>Category</span>
            <span>{activeLabel}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, marginTop: 4 }}>
            <span>Revenue</span>
            <span>{fmtMoney(activeAmount)}</span>
          </div>
        </div>
      ) : null}

      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="revDonutSvg" role="img">
        <defs>
          <filter id="revPageDonutShadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="16" stdDeviation="16" floodColor="rgba(0,0,0,0.65)" />
          </filter>
          <linearGradient id="revPageDonutHi" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="rgba(255,255,255,0.10)" />
            <stop offset="0.55" stopColor="rgba(255,255,255,0.04)" />
            <stop offset="1" stopColor="rgba(255,255,255,0.00)" />
          </linearGradient>
          <radialGradient id="revPageHole" cx="0.28" cy="0.22" r="0.95">
            <stop offset="0" stopColor="rgba(255,255,255,0.06)" />
            <stop offset="0.55" stopColor="rgba(255,255,255,0.02)" />
            <stop offset="1" stopColor="rgba(255,255,255,0.00)" />
          </radialGradient>
        </defs>

        <g filter="url(#revPageDonutShadow)">
          {segs.map((s) => (
            <g key={s.key}>
              <path
                d={s.path}
                fill={s.fill}
                opacity={0.92}
                role="button"
                tabIndex={0}
                aria-label={`${s.label}. Revenue ${fmtMoney(s.amount)}`}
                onPointerEnter={() => {
                  setActiveLabel(s.label)
                  setActiveAmount(s.amount)
                  setTipX(s.x)
                }}
                onPointerMove={() => {
                  setActiveLabel(s.label)
                  setActiveAmount(s.amount)
                  setTipX(s.x)
                }}
                onFocus={() => {
                  setActiveLabel(s.label)
                  setActiveAmount(s.amount)
                  setTipX(s.x)
                }}
                onBlur={() => setActiveLabel(null)}
              />
              <path d={s.path} fill="url(#revPageDonutHi)" opacity={0.65} pointerEvents="none" />
            </g>
          ))}
        </g>

        <circle cx={cx} cy={cy} r={innerR - 2} fill="transparent" />
        <circle cx={cx} cy={cy} r={innerR - 2} fill="url(#revPageHole)" opacity={0.55} />
      </svg>
    </div>
  )
}

function BarChart({ values }: { values: readonly number[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [tipX, setTipX] = useState(0)
  const max = Math.max(...values)

  const baseDate = new Date(2007, 10, 9)

  function dateLabel(i: number) {
    const d = new Date(baseDate)
    d.setDate(baseDate.getDate() + i)
    const mm = String(d.getMonth() + 1).padStart(2, '0')
    const dd = String(d.getDate()).padStart(2, '0')
    const yyyy = String(d.getFullYear())
    return `${mm}/${dd}/${yyyy}`
  }

  function showTip(i: number, el: HTMLElement) {
    setActiveIndex(i)
    setTipX(el.offsetLeft + el.offsetWidth / 2)
  }

  return (
    <div style={{ height: 240, position: 'relative' }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${values.length}, 1fr)`,
          gap: 12,
          alignItems: 'end',
          height: 210,
          padding: '14px 14px 16px',
        }}
        aria-hidden
      >
        {values.map((v, i) => {
          const h = (v / max) * 190
          return (
            <div
              key={i}
              style={{
                height: h,
                borderRadius: 12,
                background: 'linear-gradient(180deg, rgba(255,255,255,0.18), rgba(255,255,255,0.05))',
                border: '1px solid rgba(255,255,255,0.07)',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06), 0 12px 30px rgba(0,0,0,0.30)',
              }}
              title={`Day ${i + 1}: ${v}`}
              role="img"
              tabIndex={0}
              aria-label={`Date ${dateLabel(i)}. Revenue ${fmtMoney(v)}`}
              onPointerEnter={(e) => showTip(i, e.currentTarget)}
              onPointerMove={(e) => showTip(i, e.currentTarget)}
              onPointerLeave={() => setActiveIndex(null)}
              onFocus={(e) => showTip(i, e.currentTarget)}
              onBlur={() => setActiveIndex(null)}
            />
          )
        })}
      </div>

      {activeIndex !== null ? (
        <div
          style={{
            position: 'absolute',
            left: tipX,
            top: 18,
            transform: 'translateX(-50%)',
            width: 170,
            borderRadius: 12,
            padding: '8px 10px',
            background: 'rgba(0,0,0,0.35)',
            border: '1px solid rgba(255,255,255,0.10)',
            boxShadow: '0 18px 40px rgba(0,0,0,0.45)',
            backdropFilter: 'blur(6px)',
            color: 'var(--text2)',
            fontSize: 10,
            pointerEvents: 'none',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}>
            <span>Date</span>
            <span>{dateLabel(activeIndex)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, marginTop: 4 }}>
            <span>Revenue</span>
            <span>{fmtMoney(values[activeIndex] ?? 0)}</span>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export function RevenuePage() {
  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 12 }}>
        <div className="card kpi">
          <div className="kpiLabel">{kpis.totalRevenue.label}</div>
          <div className="kpiValueRow">
            <div className="kpiValue">{fmtMoney(kpis.totalRevenue.value)}</div>
            <div className="delta delta--pos">+{kpis.totalRevenue.deltaPct.toFixed(1)}%</div>
          </div>
        </div>
        <div className="card kpi">
          <div className="kpiLabel">Daily Volume</div>
          <div className="kpiValueRow">
            <div className="kpiValue">{dailyVolumes[dailyVolumes.length - 1]}</div>
            <div className="muted" style={{ fontSize: 11 }}>
              last day
            </div>
          </div>
        </div>
      </div>

      <div className="grid" style={{ marginTop: 14 }}>
        <section className="card card--pad" style={{ minHeight: 340 }}>
          <div className="panelTitle">Revenue Breakdown</div>
          <div className="revBody">
            <div className="revCenter">
              <RevenueDonut />
            </div>
          </div>
          <div className="muted" style={{ marginTop: 10, fontSize: 11 }}>
            Category split using the app's neutral glass theme.
          </div>
        </section>

        <section className="card card--pad" style={{ minHeight: 340 }}>
          <div className="panelTitle">Daily Revenue</div>
          <div className="kpiValue" style={{ marginTop: 2 }}>
            {fmtMoney(kpis.totalRevenue.value)}
          </div>
          <div className="muted" style={{ marginTop: 6, fontSize: 11 }}>
            bars are scaled to the series maximum
          </div>
          <div style={{ marginTop: 12 }}>
            <BarChart values={dailyVolumes} />
          </div>
        </section>
      </div>
    </div>
  )
}
