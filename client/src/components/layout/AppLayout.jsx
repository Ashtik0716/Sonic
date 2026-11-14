import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Navbar from './Navbar'
import Player from './Player'
import MobileNav from './MobileNav'
import ErrorBoundary from './ErrorBoundary'
import { useState } from 'react'
import QueuePanel from './QueuePanel'

function AppLayout() {
  const [queueOpen, setQueueOpen] = useState(false)
  return (
    <div className="flex h-full flex-col bg-surface-950">
      <div className="flex min-h-0 flex-1 gap-2 md:p-2 md:pb-0">
        <Sidebar />

        <main className="flex-1 overflow-y-auto bg-linear-to-b from-brand-600/25 via-surface-900 via-40% to-surface-900 md:rounded-xl">
          <Navbar />

          {/* px-4 on phones, px-6 from md up */}
          <div className="px-4 pb-6 md:px-6">
            <ErrorBoundary>
              <Outlet />
            </ErrorBoundary>
          </div>
        </main>
      </div>

      {/* Slimmer player on phones (h-20), taller on desktop (h-24) */}
      <footer className="h-20 shrink-0 p-2 md:h-24">
        <Player onToggleQueue={() => setQueueOpen((o) => !o)} queueOpen={queueOpen} />
      </footer>

      {queueOpen && <QueuePanel onClose={() => setQueueOpen(false)} />}

      {/* Tab bar sits below the player, phones only */}
      <MobileNav />
    </div>
  )
}

export default AppLayout