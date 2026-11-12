import { useState } from 'react'
import { ListPlus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { usePlaylists } from '../../context/PlaylistContext'
import { addToPlaylist } from '../../services/api'

function AddToPlaylist({ trackId, className = '' }) {
  const { user } = useAuth()
  const { playlists, updateLocal } = usePlaylists()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState('')

  function toggle() {
    if (!user) return navigate('/login')
    setMessage('')
    setOpen((o) => !o)
  }

  async function handlePick(playlist) {
    try {
      await addToPlaylist(playlist.id, trackId)
      setMessage(`Added to ${playlist.name}`)
      // The count is approximate if the song was already in the list; it corrects on reload
      updateLocal(playlist.id, { trackCount: playlist.trackCount + 1 })
      setTimeout(() => setOpen(false), 900)
    } catch (err) {
      setMessage(err.message)
    }
  }

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={toggle}
        aria-label="Add to playlist"
        className="flex h-11 w-11 items-center justify-center text-ink-300 transition hover:scale-110 hover:text-ink-100 md:h-9 md:w-9"
      >
        <ListPlus size={20} />
      </button>

      {open && (
        // bottom-full opens the menu upward, since the player is at the screen bottom
        <div className="absolute bottom-full left-0 z-20 mb-2 w-56 rounded-lg bg-surface-700 p-2 shadow-xl">
          {message ? (
            <p className="px-2 py-2 text-sm">{message}</p>
          ) : playlists.length === 0 ? (
            <p className="px-2 py-2 text-sm text-ink-300">Create a playlist from the sidebar first.</p>
          ) : (
            playlists.map((p) => (
              <button
                key={p.id}
                onClick={() => handlePick(p)}
                className="block w-full truncate rounded px-2 py-2 text-left text-sm hover:bg-surface-600"
              >
                {p.name}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  )
}

export default AddToPlaylist