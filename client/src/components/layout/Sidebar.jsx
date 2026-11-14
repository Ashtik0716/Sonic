import { Home, Search, Library, Heart, ListMusic, Clock, Plus } from 'lucide-react'
import { NavLink, useNavigate } from 'react-router-dom'
import SidebarLink from './SidebarLink'
import { useAuth } from '../../context/AuthContext'
import { usePlaylists } from '../../context/PlaylistContext'
import { useState } from 'react'
import NameModal from '../ui/NameModal'

const mainLinks = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/search', icon: Search, label: 'Search' },
]

const libraryLinks = [
  { to: '/library', icon: Library, label: 'Your Library' },
  { to: '/library/liked', icon: Heart, label: 'Liked Songs' },
  { to: '/library/playlists', icon: ListMusic, label: 'Playlists' },
  { to: '/library/recent', icon: Clock, label: 'Recently Played' },
]

function Sidebar() {
  const { user } = useAuth()
  const { playlists, create } = usePlaylists()
  const navigate = useNavigate()
  const [creating, setCreating] = useState(false)

  // Ask for a name, create the playlist, then open it
  function handleCreateClick() {
    if (!user) return navigate('/login')
    setCreating(true)
  }

  return (
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
          {mainLinks.map((link) => (
            <SidebarLink key={link.to} {...link} />
          ))}
        </nav>
      </div>

      {/* Bottom panel: library, scrolls when it gets long */}
      <div className="min-h-0 flex-1 overflow-y-auto rounded-xl bg-surface-900 p-4">
        {/* Header with the create-playlist button */}
        <div className="mb-2 flex items-center justify-between px-3">
          <p className="text-sm font-semibold uppercase tracking-wider text-ink-500">Library</p>
          <button
            onClick={handleCreateClick}
            aria-label="Create playlist"
            className="rounded-full p-1 text-ink-300 transition hover:bg-surface-700 hover:text-ink-100"
          >
            <Plus size={18} />
          </button>
        </div>

        <nav className="flex flex-col">
          {libraryLinks.map((link) => (
            <SidebarLink key={link.to} {...link} />
          ))}
        </nav>

        {/* User playlists, only shown once there is at least one */}
        {playlists.length > 0 && (
          <div className="mt-4 border-t border-surface-700 pt-4">
            <p className="mb-2 px-3 text-sm font-semibold uppercase tracking-wider text-ink-500">
              Playlists
            </p>
            {playlists.map((p) => (
              <NavLink
                key={p.id}
                to={`/playlist/${p.id}`}
                className={({ isActive }) =>
                  `block truncate rounded-lg px-3 py-2 text-sm font-medium transition-colors ${isActive ? 'text-brand-400' : 'text-ink-300 hover:text-ink-100'
                  }`
                }
              >
                {p.name}
              </NavLink>
            ))}
          </div>
        )}
      </div>
      {creating && (
        <NameModal
          title="Create playlist"
          submitLabel="Create"
          onClose={() => setCreating(false)}
          onSubmit={async (name) => {
            const playlist = await create(name)
            navigate(`/playlist/${playlist.id}`)
          }}
        />
      )}
    </aside>
  )
}

export default Sidebar