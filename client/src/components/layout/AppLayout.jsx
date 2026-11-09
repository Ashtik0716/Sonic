import { Link, Outlet } from 'react-router-dom'

function AppLayout() {
  return (
    // Full-screen column: top area grows, player stays at the bottom
    <div className="flex h-full flex-col bg-surface-950">
      {/* min-h-0 is essential: it lets this row shrink so the main area can scroll */}
      <div className="flex min-h-0 flex-1 gap-2 p-2 pb-0">
        {/* Sidebar placeholder: hidden on mobile, visible from md (768px) up */}
        <aside className="hidden w-64 shrink-0 rounded-xl bg-surface-900 p-4 md:block">
          <h2 className="text-xl font-extrabold text-brand-400">Sonic</h2>
          <nav className="mt-6 flex flex-col gap-3 text-ink-300">
            <Link to="/" className="hover:text-ink-100">Home</Link>
            <Link to="/search" className="hover:text-ink-100">Search</Link>
            <Link to="/library" className="hover:text-ink-100">Library</Link>
          </nav>
        </aside>

        {/* Main content: this is the part that scrolls */}
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