import { Icon } from './Icon'
import type { NavItemId } from '../types'

type Props = {
  active: NavItemId
}

const titleById: Record<NavItemId, string> = {
  dashboard: 'Dashboard',
  revenue: 'Revenue',
  history: 'History',
  profits: 'Profits',
  transactions: 'Transactions',
}

export function TopBar({ active }: Props) {
  return (
    <header className="topBar">
      <div className="topBarTitle">{titleById[active]}</div>

      <div className="topBarActions">
        <button className="pillBtn" type="button" aria-label="Filter">
          <Icon name="filter" size={16} />
        </button>

        <button className="pillBtn" type="button">
          <span style={{ fontSize: 11, color: 'var(--text2)' }}>Sort By</span>
          <Icon name="chevDown" size={16} />
        </button>
      </div>
    </header>
  )
}
