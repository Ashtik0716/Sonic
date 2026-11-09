import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Navbar from './Navbar'
import Player from './Player'
import MobileNav from './MobileNav'

function AppLayout() {
  return (
    <div className="flex h-full flex-col bg-surface-950">
      <div className="flex min-h-0 flex-1 gap-2 md:p-2 md:pb-0">
        <Sidebar />

        <main className="flex-1 overflow-y-auto bg-linear-to-b from-brand-600/25 via-surface-900 via-40% to-surface-900 md:rounded-xl">
          <Navbar />

          {/* px-4 on phones, px-6 from md up */}
          <div className="px-4 pb-6 md:px-6">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Slimmer player on phones (h-20), taller on desktop (h-24) */}
      <footer className="h-20 shrink-0 p-2 md:h-24">
        <Player />
      </footer>

      {/* Tab bar sits below the player, phones only */}
      <MobileNav />
    </div>
  )
}

export default AppLayout