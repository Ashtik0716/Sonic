import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Navbar from './Navbar'

function AppLayout() {
  return (
    // Full-screen column: top area grows, player stays at the bottom
    <div className="flex h-full flex-col bg-surface-950">
      {/* min-h-0 lets this row shrink so the main area can scroll */}
      <div className="flex min-h-0 flex-1 gap-2 p-2 pb-0">
        <Sidebar />

        {/* No padding here, so the sticky Navbar sits flush at the top */}
        <main className="flex-1 overflow-y-auto rounded-xl bg-surface-900">
          <Navbar />

          {/* Padding lives here instead, around the page content */}
          <div className="px-6 pb-6">
            <Outlet />
          </div>
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