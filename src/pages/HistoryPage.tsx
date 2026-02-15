import { historyTransactions } from '../data/mock'
import { Icon } from '../components/Icon'
import type { Transaction } from '../types'

function fmtMoney(n: number) {
  return n.toLocaleString(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
}

function statusClass(t: Transaction['status']) {
  if (t === 'Success') return 'status status--ok'
  if (t === 'Failed') return 'status status--bad'
  return 'status status--warn'
}

export function HistoryPage() {
  return (
    <div className="card" style={{ overflow: 'hidden' }}>
      <div className="historyHeader">
        <div>Sender</div>
        <div>Recipient</div>
        <div>Value</div>
        <div>Transaction Status</div>
        <div>Edit</div>
      </div>

      {historyTransactions.map((tx) => (
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

      <div style={{ padding: 14, display: 'flex', justifyContent: 'center' }}>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <span className="iconBtn" style={{ width: 28, height: 28, opacity: 0.7 }}>
            {'<<'}
          </span>
          {Array.from({ length: 6 }).map((_, i) => (
            <span
              key={i}
              className="iconBtn"
              style={{
                width: 28,
                height: 28,
                fontSize: 11,
                opacity: i === 0 ? 1 : 0.55,
                background: i === 0 ? 'rgba(255,255,255,0.10)' : 'rgba(255,255,255,0.06)',
              }}
            >
              {i + 1}
            </span>
          ))}
          <span className="iconBtn" style={{ width: 28, height: 28, opacity: 0.7 }}>
            {'>>'}
          </span>
        </div>
      </div>
    </div>
  )
}
