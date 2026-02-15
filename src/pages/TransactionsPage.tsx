import { useState } from 'react'
import { historyTransactions } from '../data/mock'
import { Icon } from '../components/Icon'
import type { Transaction, TxStatus } from '../types'

type Filter = 'All' | TxStatus

function fmtMoney(n: number) {
  return n.toLocaleString(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
}

function statusClass(t: Transaction['status']) {
  if (t === 'Success') return 'status status--ok'
  if (t === 'Failed') return 'status status--bad'
  return 'status status--warn'
}

function countByStatus(items: readonly Transaction[]) {
  const out: Record<TxStatus, number> = {
    Success: 0,
    Failed: 0,
    Processing: 0,
  }
  for (const it of items) out[it.status]++
  return out
}

export function TransactionsPage() {
  const [filter, setFilter] = useState<Filter>('All')

  const counts = countByStatus(historyTransactions)
  const filtered =
    filter === 'All' ? historyTransactions : historyTransactions.filter((t) => t.status === filter)

  const filters: readonly Filter[] = ['All', 'Success', 'Processing', 'Failed']

  return (
    <div>
      <div className="kpiRow">
        <div className="card kpi">
          <div className="kpiLabel">Total Transactions</div>
          <div className="kpiValueRow">
            <div className="kpiValue">{historyTransactions.length}</div>
            <div className="muted" style={{ fontSize: 11 }}>
              in table
            </div>
          </div>
        </div>
        <div className="card kpi">
          <div className="kpiLabel">Success</div>
          <div className="kpiValueRow">
            <div className="kpiValue">{counts.Success}</div>
            <span className={statusClass('Success')}>Success</span>
          </div>
        </div>
        <div className="card kpi">
          <div className="kpiLabel">Processing</div>
          <div className="kpiValueRow">
            <div className="kpiValue">{counts.Processing}</div>
            <span className={statusClass('Processing')}>Processing</span>
          </div>
        </div>
        <div className="card kpi">
          <div className="kpiLabel">Failed</div>
          <div className="kpiValueRow">
            <div className="kpiValue">{counts.Failed}</div>
            <span className={statusClass('Failed')}>Failed</span>
          </div>
        </div>
      </div>

      <div className="grid" style={{ marginTop: 14 }}>
        <aside style={{ display: 'grid', gap: 14, alignContent: 'start' }}>
          <section className="card card--pad">
            <div className="panelTitle">Filter</div>
            <div style={{ display: 'grid', gap: 8, marginTop: 10 }}>
              {filters.map((f) => {
                const isActive = f === filter
                return (
                  <button
                    key={f}
                    className="pillBtn"
                    type="button"
                    onClick={() => setFilter(f)}
                    aria-pressed={isActive}
                    style={{
                      width: '100%',
                      justifyContent: 'space-between',
                      color: isActive ? 'var(--text0)' : undefined,
                      borderColor: isActive ? 'var(--stroke1)' : undefined,
                      background: isActive ? 'rgba(255,255,255,0.08)' : undefined,
                    }}
                  >
                    <span>{f}</span>
                    <span className="muted" style={{ fontSize: 11 }}>
                      {f === 'All' ? historyTransactions.length : counts[f]}
                    </span>
                  </button>
                )
              })}
            </div>
          </section>

          <section className="card card--pad">
            <div className="panelTitle">Status Breakdown</div>
            <div className="list" style={{ marginTop: 10 }}>
              <div className="row">
                <div className="muted">Success</div>
                <span className={statusClass('Success')}>{counts.Success}</span>
              </div>
              <div className="row">
                <div className="muted">Processing</div>
                <span className={statusClass('Processing')}>{counts.Processing}</span>
              </div>
              <div className="row">
                <div className="muted">Failed</div>
                <span className={statusClass('Failed')}>{counts.Failed}</span>
              </div>
            </div>
          </section>
        </aside>

        <section className="card" style={{ overflow: 'hidden' }} aria-label="Transactions table">
          <div className="historyHeader">
            <div>Sender</div>
            <div>Recipient</div>
            <div>Value</div>
            <div>Transaction Status</div>
            <div>Edit</div>
          </div>

          {filtered.map((tx) => (
            <div className="historyRow" key={tx.id}>
              <div>
                <div className="cellMain">{tx.sender.name}</div>
                <div className="cellSub">{tx.sender.handle}</div>
              </div>
              <div>
                <div className="cellMain">{tx.recipient.name}</div>
                <div className="cellSub">{tx.recipient.handle}</div>
              </div>
              <div>
                <div className="cellMain">{fmtMoney(tx.amount)}</div>
                <div className="cellSub">{tx.cardRef}</div>
              </div>
              <div>
                <span className={statusClass(tx.status)}>{tx.status}</span>
              </div>
              <div>
                <button className="iconBtn" type="button" aria-label="Edit">
                  <Icon name="pencil" size={16} />
                </button>
              </div>
            </div>
          ))}

          {filtered.length === 0 ? (
            <div className="card--pad">
              <div className="muted">No transactions match this filter.</div>
            </div>
          ) : null}
        </section>
      </div>
    </div>
  )
}
