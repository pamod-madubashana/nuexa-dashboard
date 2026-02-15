import { kpis, netProfitSeries } from '../data/mock'

function fmtMoney(n: number) {
  return n.toLocaleString(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
}

function LineChart({ values }: { values: readonly number[] }) {
  const w = 520
  const h = 200
  const pad = 22
  const min = Math.min(...values)
  const max = Math.max(...values)
  const span = Math.max(1, max - min)

  const pts = values.map((v, i) => {
    const x = pad + (i * (w - pad * 2)) / Math.max(1, values.length - 1)
    const y = pad + (1 - (v - min) / span) * (h - pad * 2)
    return { x, y }
  })
  const d = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`).join(' ')

  return (
    <svg width="100%" height="100%" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" aria-hidden>
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
      {pts.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={4.2} fill="rgba(255,255,255,0.25)" />
      ))}
      {pts.map((p, i) => (
        <circle key={i + 'b'} cx={p.x} cy={p.y} r={2.2} fill="rgba(255,255,255,0.8)" />
      ))}
    </svg>
  )
}

export function ProfitsPage() {
  return (
    <div className="split">
      <section className="card card--pad" style={{ minHeight: 340 }}>
        <div className="panelTitle">Net Profit</div>
        <div className="kpiValue" style={{ marginTop: 2 }}>
          {fmtMoney(kpis.netProfit.value)}
        </div>
        <div className="muted" style={{ marginTop: 6, fontSize: 11 }}>
          +{kpis.netProfit.deltaPct.toFixed(1)}% vs previous
        </div>

        <div className="chartWrap" style={{ marginTop: 18, height: 240 }}>
          <LineChart values={netProfitSeries} />
          <div className="chartCaption">Charting X</div>
        </div>
      </section>

      <section className="card card--pad" style={{ minHeight: 340 }}>
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
