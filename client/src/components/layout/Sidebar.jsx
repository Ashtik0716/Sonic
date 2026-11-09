import { Home, Search, Library, Heart, ListMusic, Clock } from 'lucide-react'
import SidebarLink from './SidebarLink'

// Data-driven navigation: to add a link later, add one line here
const mainLinks = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/search', icon: Search, label: 'Search' },
]

// Library shortcuts: real pages come in later phases
const libraryLinks = [
  { to: '/library', icon: Library, label: 'Your Library' },
  { to: '/library/liked', icon: Heart, label: 'Liked Songs' },
  { to: '/library/playlists', icon: ListMusic, label: 'Playlists' },
  { to: '/library/recent', icon: Clock, label: 'Recently Played' },
]

function Sidebar() {
  return (
    // Hidden on mobile, shown from md up. Step 7 adds mobile navigation.
    <aside className="hidden w-64 shrink-0 flex-col gap-2 md:flex">
      {/* Top panel: logo + main navigation */}
      <div className="rounded-xl bg-surface-900 p-4">
        <div className="mb-4 flex items-center gap-2 px-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500 font-extrabold">
            S
          </div>
          <span className="text-xl font-extrabold tracking-tight">Sonic</span>
        </div>

        <nav className="flex flex-col">
          {/* .map() turns each object in the array into a component */}
          {mainLinks.map((link) => (
            // key helps React track which item is which when the list changes
            <SidebarLink key={link.to} {...link} />
          ))}
        </nav>
      </div>

      {/* Bottom panel: library, fills the remaining height and scrolls */}
      <div className="min-h-0 flex-1 overflow-y-auto rounded-xl bg-surface-900 p-4">
        <p className="mb-2 px-3 text-sm font-semibold uppercase tracking-wider text-ink-500">
          Library
        </p>
        <nav className="flex flex-col">
          {libraryLinks.map((link) => (
            <SidebarLink key={link.to} {...link} />
          ))}
        </nav>
      </div>
    </aside>
  )
}

export default Sidebar