import { useMemo, useState } from 'react'
import { Sidebar } from './components/Sidebar'
import { TopBar } from './components/TopBar'
import { DashboardPage } from './pages/DashboardPage'
import { HistoryPage } from './pages/HistoryPage'
import { ProfitsPage } from './pages/ProfitsPage'
import { RevenuePage } from './pages/RevenuePage'
import { TransactionsPage } from './pages/TransactionsPage'
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
            <div className="appContentInner">
              {active === 'dashboard' && <DashboardPage />}
              {active === 'revenue' && <RevenuePage />}
              {active === 'history' && <HistoryPage />}
              {active === 'profits' && <ProfitsPage />}
              {active === 'transactions' && <TransactionsPage />}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
