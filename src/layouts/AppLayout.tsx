import type { ReactNode } from 'react'
import type { View } from '../types/inventory'
import { viewTitle } from '../utils/format'
import { StatusMessage } from '../components/StatusMessage'

type AppLayoutProps = {
  activeView: View
  children: ReactNode
  error: string
  message: string
  onLogout: () => void
  onRefresh: () => void
  onViewChange: (view: View) => void
}

export function AppLayout({
  activeView,
  children,
  error,
  message,
  onLogout,
  onRefresh,
  onViewChange,
}: AppLayoutProps) {
  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div>
          <p className="eyebrow">StockFlow</p>
          <h1>Inventory</h1>
        </div>
        <nav>
          <button
            className={activeView === 'dashboard' ? 'active' : ''}
            onClick={() => onViewChange('dashboard')}
            type="button"
          >
            Dashboard
          </button>
          <button
            className={activeView === 'products' ? 'active' : ''}
            onClick={() => onViewChange('products')}
            type="button"
          >
            Products
          </button>
          <button
            className={activeView === 'settings' ? 'active' : ''}
            onClick={() => onViewChange('settings')}
            type="button"
          >
            Settings
          </button>
        </nav>
        <button className="ghost-action" onClick={onLogout} type="button">
          Log out
        </button>
      </aside>

      <section className="workspace">
        <header className="workspace-header">
          <div>
            <p className="eyebrow">{activeView}</p>
            <h2>{viewTitle(activeView)}</h2>
          </div>
          <button className="secondary-action" onClick={onRefresh} type="button">
            Refresh
          </button>
        </header>

        <StatusMessage error={error} message={message} />
        {children}
      </section>
    </main>
  )
}
