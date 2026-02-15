import { useMemo, useState } from 'react'
import { Sidebar } from './components/Sidebar'
import { TopBar } from './components/TopBar'
import { DashboardPage } from './pages/DashboardPage'
import { HistoryPage } from './pages/HistoryPage'
import type { NavItemId } from './types'

export default function App() {
  const nav = useMemo(
    () =>
      [
        { id: 'dashboard' as const, label: 'Dashboard' },
        { id: 'revenue' as const, label: 'Revenue' },
        { id: 'history' as const, label: 'History' },
        { id: 'profits' as const, label: 'Profits' },
        { id: 'transactions' as const, label: 'Transactions' },
      ],
    [],
  )

  const [active, setActive] = useState<NavItemId>('dashboard')

  return (
    <div className="appBg">
      <div className="appFrame">
        <Sidebar items={nav} active={active} onChange={setActive} />

        <main className="appMain">
          <TopBar active={active} />

          <div className="appContent">
            {active === 'dashboard' && <DashboardPage />}
            {active === 'history' && <HistoryPage />}
            {active !== 'dashboard' && active !== 'history' && (
              <div className="card card--pad" style={{ minHeight: 360 }}>
                <div className="muted" style={{ marginBottom: 8 }}>
                  {nav.find((n) => n.id === active)?.label}
                </div>
                <div className="h2">Coming soon</div>
                <div className="muted" style={{ marginTop: 10, maxWidth: 72 * 8 }}>
                  This is a UI build to match the provided dashboard screens. The pages above are
                  implemented first.
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
