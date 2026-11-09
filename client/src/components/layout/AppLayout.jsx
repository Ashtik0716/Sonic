import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'

function AppLayout() {
  return (
    // Full-screen column: top area grows, player stays at the bottom
    <div className="flex h-full flex-col bg-surface-950">
      {/* min-h-0 lets this row shrink so the main area can scroll */}
      <div className="flex min-h-0 flex-1 gap-2 p-2 pb-0">
        {/* The one and only Sidebar */}
        <Sidebar />

        {/* The one and only main content area */}
        <main className="flex-1 overflow-y-auto rounded-xl bg-surface-900 p-6">
          {/* The current page renders here */}
          <Outlet />
        </main>
      </div>

      {/* Player placeholder: fixed height, always visible */}
      <footer className="h-24 shrink-0 p-2">
        <div className="flex h-full items-center rounded-xl bg-surface-800 px-4 text-ink-300">
          Player goes here
        </div>
      </footer>
    </div>
  )
}

export default AppLayout