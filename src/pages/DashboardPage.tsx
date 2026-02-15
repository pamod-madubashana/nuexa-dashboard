import { useState } from 'react'
import { dailyVolumes, donutBreakdown, kpis, netProfitSeries, recentTransactions, topSpender } from '../data/mock'

function fmtMoney(n: number) {
  return n.toLocaleString(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
}

function avatarBg(seed: string) {
  let h = 0
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0
  const a = h % 360
  const b = (h * 7) % 360
  return `linear-gradient(140deg, hsla(${a}, 75%, 65%, 0.95), hsla(${b}, 75%, 55%, 0.95))`
}

type HoverPoint = {
  index: number
  x: number
}

function LineChart({
  values,
  onHover,
  onLeave,
}: {
  values: readonly number[]
  onHover?: (p: HoverPoint) => void
  onLeave?: () => void
}) {
  const w = 520
  const h = 200
  const pad = 22
  const min = Math.min(...values)
  const max = Math.max(...values)
  const span = Math.max(1, max - min)

  function idxFromClientX(clientX: number, bounds: DOMRect) {
    const t = (clientX - bounds.left) / Math.max(1, bounds.width)
    const clamped = Math.max(0, Math.min(1, t))
    const last = Math.max(1, values.length - 1)
    return Math.round(clamped * last)
  }

  function xFromIndex(i: number) {
    const last = Math.max(1, values.length - 1)
    return pad + (i * (w - pad * 2)) / last
  }

  const pts = values.map((v, i) => {
    const x = pad + (i * (w - pad * 2)) / Math.max(1, values.length - 1)
    const y = pad + (1 - (v - min) / span) * (h - pad * 2)
    return { x, y }
  })
  const d = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`).join(' ')

  return (
    <svg
      width="100%"
      height="100%"
      viewBox={`0 0 ${w} ${h}`}
      preserveAspectRatio="none"
      onPointerLeave={onLeave}
      onPointerMove={(e) => {
        if (!onHover) return
        const bounds = e.currentTarget.getBoundingClientRect()
        const idx = idxFromClientX(e.clientX, bounds)
        onHover({ index: idx, x: xFromIndex(idx) })
      }}
      onPointerEnter={(e) => {
        if (!onHover) return
        const bounds = e.currentTarget.getBoundingClientRect()
        const idx = idxFromClientX(e.clientX, bounds)
        onHover({ index: idx, x: xFromIndex(idx) })
      }}
    >
      <defs>
        <linearGradient id="lp" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="rgba(255,255,255,0.15)" />
          <stop offset="1" stopColor="rgba(255,255,255,0.55)" />
        </linearGradient>
        <linearGradient id="la" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="rgba(255,255,255,0.15)" />
          <stop offset="1" stopColor="rgba(255,255,255,0.0)" />
        </linearGradient>
      </defs>

      {[0.25, 0.5, 0.75].map((t) => (
        <line
          key={t}
          x1={pad}
          x2={w - pad}
          y1={pad + t * (h - pad * 2)}
          y2={pad + t * (h - pad * 2)}
          stroke="rgba(255,255,255,0.06)"
        />
      ))}

      <path d={`${d} L ${w - pad} ${h - pad} L ${pad} ${h - pad} Z`} fill="url(#la)" />
      <path d={d} fill="none" stroke="url(#lp)" strokeWidth="2.2" />

      <rect
        x={pad}
        y={pad}
        width={w - pad * 2}
        height={h - pad * 2}
        fill="transparent"
        pointerEvents="all"
      />

      {pts.map((p, i) => (
        <circle
          key={i}
          cx={p.x}
          cy={p.y}
          r={4.2}
          fill="rgba(255,255,255,0.25)"
          role={onHover ? 'button' : undefined}
          tabIndex={onHover ? 0 : undefined}
          aria-label={onHover ? `Point ${i + 1}` : undefined}
          onPointerEnter={
            onHover
              ? () => {
                  onHover({ index: i, x: p.x })
                }
              : undefined
          }
          onPointerMove={
            onHover
              ? () => {
                  onHover({ index: i, x: p.x })
                }
              : undefined
          }
          onFocus={
            onHover
              ? () => {
                  onHover({ index: i, x: p.x })
                }
              : undefined
          }
          onBlur={onLeave}
        />
      ))}
      {pts.map((p, i) => (
        <circle key={i + 'b'} cx={p.x} cy={p.y} r={2.2} fill="rgba(255,255,255,0.8)" pointerEvents="none" />
      ))}
    </svg>
  )
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

function RevenueDonut({ data }: { data: ReadonlyArray<{ label: string; value: number }> }) {
  const [activeLabel, setActiveLabel] = useState<string | null>(null)
  const [activeAmount, setActiveAmount] = useState(0)
  const [tipX, setTipX] = useState(0)

  type Seg = {
    key: string
    d: string
    color: string
    dx: number
    dy: number
    isLift: boolean
    x: number
    label: string
    amount: number
  }

  const size = 190
  const cx = size / 2
  const cy = size / 2
  const outerR = 86
  const innerR = 56
  const gapDeg = 6
  const startAt = 220

  const total = data.reduce((s, d) => s + Math.max(0, d.value), 0) || 1
  const spans = data.map((d) => (Math.max(0, d.value) / total) * 360)

  const fills = ['rgba(255,255,255,0.22)', 'rgba(255,255,255,0.16)', 'rgba(255,255,255,0.11)'] as const

  const maybeSegs: Array<Seg | null> = data
    .map((d, i) => {
      const span = spans[i] ?? 0
      const start = startAt + spans.slice(0, i).reduce((s, v) => s + v, 0)
      const end = start + span

      const a0 = start + gapDeg / 2
      const a1 = end - gapDeg / 2
      if (a1 <= a0) return null

      const isLift = false
      const dx = 0
      const dy = 0

       const mid = (a0 + a1) / 2
       const p = polarToCartesian(cx, cy, outerR, mid)
       return {
         key: d.label + i,
         d: describeDonutSlice(cx, cy, outerR, innerR, a0, a1),
         color: fills[i % fills.length],
         dx,
         dy,
         isLift,
         x: p.x,
         label: d.label,
         amount: kpis.totalRevenue.value * d.value,
       }
     })

  const segs = maybeSegs.filter((s): s is Seg => s !== null)

  function fmtMoney(n: number) {
    return n.toLocaleString(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
  }

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

      <svg
        className="revDonutSvg"
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        role="img"
        aria-label="Revenue breakdown"
      >
        <defs>
          <filter id="revDonutShadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="16" stdDeviation="16" floodColor="rgba(0,0,0,0.65)" />
          </filter>
          <linearGradient id="revDonutHi" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="rgba(255,255,255,0.10)" />
            <stop offset="0.55" stopColor="rgba(255,255,255,0.04)" />
            <stop offset="1" stopColor="rgba(255,255,255,0.00)" />
          </linearGradient>
          <radialGradient id="revHole" cx="0.30" cy="0.25" r="0.95">
            <stop offset="0" stopColor="rgba(255,255,255,0.05)" />
            <stop offset="0.62" stopColor="rgba(0,0,0,0.42)" />
            <stop offset="1" stopColor="rgba(0,0,0,0.70)" />
          </radialGradient>
          <radialGradient id="revInnerGlow" cx="0.28" cy="0.22" r="0.95">
            <stop offset="0" stopColor="rgba(255,255,255,0.06)" />
            <stop offset="0.55" stopColor="rgba(255,255,255,0.02)" />
            <stop offset="1" stopColor="rgba(255,255,255,0.00)" />
          </radialGradient>
        </defs>

        <g filter="url(#revDonutShadow)">
          {segs.map((s) => (
            <g key={s.key}>
              <path
                d={s.d}
                fill={s.color}
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
              <path d={s.d} fill="url(#revDonutHi)" opacity={0.65} pointerEvents="none" />
            </g>
          ))}
        </g>

        <circle cx={cx} cy={cy} r={innerR - 2} fill="transparent" />
        <circle cx={cx} cy={cy} r={innerR - 2} fill="url(#revInnerGlow)" opacity={0.55} />
      </svg>
    </div>
  )
}

function BarChart({ values }: { values: readonly number[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [tipX, setTipX] = useState(0)
  const max = Math.max(...values)

  const baseDate = new Date(2007, 10, 9)

  function fmtMoney(n: number) {
    return n.toLocaleString(undefined, {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    })
  }

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
                background:
                  'linear-gradient(180deg, rgba(255,255,255,0.18), rgba(255,255,255,0.05))',
                border: '1px solid rgba(255,255,255,0.07)',
                boxShadow:
                  'inset 0 1px 0 rgba(255,255,255,0.06), 0 12px 30px rgba(0,0,0,0.30)',
              }}
              role="img"
              tabIndex={0}
              aria-label={`Date ${dateLabel(i)}. Transactions ${fmtMoney(v)}`}
              title={`Day ${i + 1}: ${v}`}
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
            <span>Transactions</span>
            <span>{fmtMoney(values[activeIndex] ?? 0)}</span>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export function DashboardPage() {
  const [activeProfit, setActiveProfit] = useState<HoverPoint | null>(null)

  const baseDate = new Date(2007, 10, 9)
  const profitW = 520

  function dateLabel(i: number) {
    const d = new Date(baseDate)
    d.setDate(baseDate.getDate() + i)
    const mm = String(d.getMonth() + 1).padStart(2, '0')
    const dd = String(d.getDate()).padStart(2, '0')
    const yyyy = String(d.getFullYear())
    return `${mm}/${dd}/${yyyy}`
  }

  const profitTipLeft = activeProfit ? `${(activeProfit.x / profitW) * 100}%` : '50%'
  const profitTipValue = activeProfit
    ? fmtMoney((netProfitSeries[activeProfit.index] ?? 0) * 1000)
    : fmtMoney(0)

  return (
    <div>
      <div className="kpiRow">
        <div className="card kpi">
          <div className="kpiLabel">{kpis.totalRevenue.label}</div>
          <div className="kpiValueRow">
            <div className="kpiValue">{fmtMoney(kpis.totalRevenue.value)}</div>
            <div className="delta delta--pos">+{kpis.totalRevenue.deltaPct.toFixed(1)}%</div>
          </div>
        </div>
        <div className="card kpi">
          <div className="kpiLabel">{kpis.netProfit.label}</div>
          <div className="kpiValueRow">
            <div className="kpiValue">{fmtMoney(kpis.netProfit.value)}</div>
            <div className="delta delta--pos">+{kpis.netProfit.deltaPct.toFixed(1)}%</div>
          </div>
        </div>
        <div className="card kpi">
          <div className="kpiLabel">{kpis.totalTransactions.label}</div>
          <div className="kpiValueRow">
            <div className="kpiValue">{kpis.totalTransactions.value}</div>
            <div className="delta delta--neg">{kpis.totalTransactions.deltaPct.toFixed(1)}%</div>
          </div>
        </div>
        <div className="card kpi">
          <div className="kpiLabel">{kpis.activeAccounts.label}</div>
          <div className="kpiValueRow">
            <div className="kpiValue">{kpis.activeAccounts.value}</div>
            <div className="delta delta--neg">{kpis.activeAccounts.deltaPct.toFixed(0)}%</div>
          </div>
        </div>
      </div>

      <div className="dashMid">
        <section className="card txCard">
          <div className="txHeader">
            <div className="txTitle">Transactions</div>
          </div>

          <div className="txLayout">
            <div className="txStack" aria-label="Recent transactions">
              {recentTransactions.map((block) => (
                <div className="txGroup" key={block.date}>
                  <div className="dateChip">{block.date}</div>
                  {block.items.map((it) => (
                    <div className="txRow" key={it.name}>
                      <div className="who">
                        <div className="txAvatar" style={{ background: avatarBg(it.name) }} />
                        <div className="whoMeta">
                          <div className="whoName">{it.name}</div>
                          <div className="whoHandle">{it.handle}</div>
                        </div>
                      </div>
                      <div className="txRight">
                        <div className="txAmount">{fmtMoney(it.amount)}</div>
                        <div className="chipPos">+{it.deltaPct.toFixed(1)}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            <aside className="spenderFloat" aria-label="Top spenders">
              <div className="miniBadge" style={{ display: 'inline-flex' }}>
                Top Spenders
              </div>
              <div className="spenderCube" style={{ background: avatarBg(topSpender.name) }} />
              <div>
                <div className="spenderName">{topSpender.name}</div>
                <div className="spenderHandle">{topSpender.handle}</div>
              </div>
              <div className="spenderMoney">
                <div className="txAmount">{fmtMoney(topSpender.amount)}</div>
                <div className="chipPos">+{topSpender.deltaPct.toFixed(1)}%</div>
              </div>
            </aside>
          </div>
        </section>

        <section className="card chartCard">
          <div className="panelTitle">Net Profit</div>
          <div className="kpiValue" style={{ marginTop: 2 }}>
            {fmtMoney(kpis.netProfit.value)}
          </div>

          <div className="chartWrap netProfitWrap" style={{ marginTop: 18, height: 240 }}>
            {activeProfit !== null ? (
              <div
                style={{
                  position: 'absolute',
                  left: profitTipLeft,
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
                  zIndex: 2,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}>
                  <span>Date</span>
                  <span>{dateLabel(activeProfit.index)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, marginTop: 4 }}>
                  <span>Net Profit</span>
                  <span>{profitTipValue}</span>
                </div>
              </div>
            ) : null}

            <LineChart values={netProfitSeries} onHover={setActiveProfit} onLeave={() => setActiveProfit(null)} />
            <div className="chartCaption">Charting X</div>
          </div>
        </section>
      </div>

      <div className="gridBottom">
        <div className="card card--pad">
          <div className="panelTitle">Revenue Breakdown</div>
          <div className="revBody">
            <div className="revCenter">
              <RevenueDonut data={donutBreakdown} />
            </div>
          </div>
        </div>
        <div className="card card--pad">
          <div className="panelTitle">Daily Transaction Volume</div>
          <BarChart values={dailyVolumes} />
        </div>
      </div>
    </div>
  )
}
