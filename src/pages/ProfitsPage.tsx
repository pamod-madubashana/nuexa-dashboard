import { useState } from 'react'
import { kpis, netProfitSeries } from '../data/mock'

function fmtMoney(n: number) {
  return n.toLocaleString(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
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
  onHover: (p: HoverPoint) => void
  onLeave: () => void
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
        const bounds = e.currentTarget.getBoundingClientRect()
        const idx = idxFromClientX(e.clientX, bounds)
        onHover({ index: idx, x: xFromIndex(idx) })
      }}
      onPointerEnter={(e) => {
        const bounds = e.currentTarget.getBoundingClientRect()
        const idx = idxFromClientX(e.clientX, bounds)
        onHover({ index: idx, x: xFromIndex(idx) })
      }}
    >
      <defs>
        <linearGradient id="pp" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="rgba(255,255,255,0.15)" />
          <stop offset="1" stopColor="rgba(255,255,255,0.55)" />
        </linearGradient>
        <linearGradient id="pa" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="rgba(255,255,255,0.12)" />
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

      <path d={`${d} L ${w - pad} ${h - pad} L ${pad} ${h - pad} Z`} fill="url(#pa)" />
      <path d={d} fill="none" stroke="url(#pp)" strokeWidth="2.2" />

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
          role="button"
          tabIndex={0}
          aria-label={`Point ${i + 1}`}
          onPointerEnter={() => onHover({ index: i, x: p.x })}
          onPointerMove={() => onHover({ index: i, x: p.x })}
          onFocus={() => onHover({ index: i, x: p.x })}
          onBlur={onLeave}
        />
      ))}
      {pts.map((p, i) => (
        <circle key={i + 'b'} cx={p.x} cy={p.y} r={2.2} fill="rgba(255,255,255,0.8)" pointerEvents="none" />
      ))}
    </svg>
  )
}

export function ProfitsPage() {
  const [active, setActive] = useState<HoverPoint | null>(null)

  const baseDate = new Date(2007, 10, 9)
  const w = 520

  function dateLabel(i: number) {
    const d = new Date(baseDate)
    d.setDate(baseDate.getDate() + i)
    const mm = String(d.getMonth() + 1).padStart(2, '0')
    const dd = String(d.getDate()).padStart(2, '0')
    const yyyy = String(d.getFullYear())
    return `${mm}/${dd}/${yyyy}`
  }

  const tipLeft = active ? `${(active.x / w) * 100}%` : '50%'
  const tipValue = active ? fmtMoney((netProfitSeries[active.index] ?? 0) * 1000) : fmtMoney(0)

  return (
    <div className="split">
      <section className="card card--pad">
        <div className="panelTitle">Net Profit</div>
        <div className="kpiValue" style={{ marginTop: 2 }}>
          {fmtMoney(kpis.netProfit.value)}
        </div>
        <div className="muted" style={{ marginTop: 6, fontSize: 11 }}>
          +{kpis.netProfit.deltaPct.toFixed(1)}% vs previous
        </div>

        <div className="chartWrap" style={{ marginTop: 14, height: 220 }}>
          {active !== null ? (
            <div
              style={{
                position: 'absolute',
                left: tipLeft,
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
                <span>{dateLabel(active.index)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, marginTop: 4 }}>
                <span>Net Profit</span>
                <span>{tipValue}</span>
              </div>
            </div>
          ) : null}

          <LineChart
            values={netProfitSeries}
            onHover={(p) => setActive(p)}
            onLeave={() => setActive(null)}
          />
          <div className="chartCaption">Charting X</div>
        </div>
      </section>

      <section className="card card--pad">
        <div className="panelTitle">Profit Notes</div>
        <div className="list" style={{ marginTop: 8 }}>
          <div className="row">
            <div>
              <div className="whoName">Higher conversion</div>
              <div className="whoHandle">improved checkout and fewer drop-offs</div>
            </div>
            <span className="tag">+2.1%</span>
          </div>
          <div className="row">
            <div>
              <div className="whoName">Lower fees</div>
              <div className="whoHandle">routing optimization</div>
            </div>
            <span className="tag">+0.6%</span>
          </div>
          <div className="row">
            <div>
              <div className="whoName">Returns</div>
              <div className="whoHandle">slightly elevated this period</div>
            </div>
            <span className="tag">-0.2%</span>
          </div>
        </div>

        <div className="muted" style={{ marginTop: 12, fontSize: 11 }}>
          These are UI placeholders; wire to real analytics when available.
        </div>
      </section>
    </div>
  )
}
