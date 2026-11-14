import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { usePlaylists } from '../context/PlaylistContext'
import NameModal from '../components/ui/NameModal'

function Playlists() {
  const { playlists, create } = usePlaylists()
  const navigate = useNavigate()
  const [creating, setCreating] = useState(false)

  return (
    <div>
      <div className="mt-4 flex items-center justify-between">
        <h1 className="text-3xl font-extrabold tracking-tight md:text-5xl">Playlists</h1>
        <button
          onClick={() => setCreating(true)}
          className="flex items-center gap-2 rounded-full bg-brand-500 px-4 py-2 text-sm font-semibold transition hover:bg-brand-600"
        >
          <Plus size={18} /> New
        </button>
      </div>

      {playlists.length === 0 ? (
        <p className="mt-6 text-ink-300">No playlists yet. Tap New to create one.</p>
      ) : (
        <div className="mt-6 flex flex-col gap-2">
          {playlists.map((p) => (
            <Link
              key={p.id}
              to={`/playlist/${p.id}`}
              className="rounded-lg bg-surface-800 px-4 py-3 transition hover:bg-surface-700"
            >
              <p className="truncate font-semibold">{p.name}</p>
              <p className="text-sm text-ink-300">{p.trackCount} songs</p>
            </Link>
          ))}
        </div>
      )}

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
    </div>
  )
}

export default Playlists