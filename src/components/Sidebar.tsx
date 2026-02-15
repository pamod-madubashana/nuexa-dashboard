import { Icon } from './Icon'
import type { NavItem, NavItemId } from '../types'

type Props = {
  items: NavItem[]
  active: NavItemId
  onChange: (id: NavItemId) => void
}

const iconById: Record<NavItemId, Parameters<typeof Icon>[0]['name']> = {
  dashboard: 'grid',
  revenue: 'revenue',
  history: 'history',
  profits: 'profits',
  transactions: 'transactions',
}

export function Sidebar({ items, active, onChange }: Props) {
  return (
    <aside className="sidebar">
      <div className="sidebarTop">
        <div className="brand">
          <span className="brandMark" aria-hidden>
            <Icon name="spark" size={28} />
          </span>
          <span className="brandText">NUEXA</span>
        </div>
      </div>

      <nav className="nav">
        {items.map((it) => {
          const isActive = it.id === active
          return (
            <button
              key={it.id}
              className={`navItem${isActive ? ' navItem--active' : ''}`}
              onClick={() => onChange(it.id)}
              type="button"
            >
              <span className="navIcon" aria-hidden>
                <Icon name={iconById[it.id]} size={18} />
              </span>
              <span className="navLabel">{it.label}</span>
            </button>
          )
        })}
      </nav>

      <div className="sidebarBottom">
        <button className="logout" type="button">
          <Icon name="logout" size={18} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  )
}
