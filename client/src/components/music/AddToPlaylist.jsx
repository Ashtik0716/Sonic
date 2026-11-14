import { useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { ListPlus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { usePlaylists } from '../../context/PlaylistContext'
import { addToPlaylist } from '../../services/api'
import { useToast } from '../../context/ToastContext'

const MENU_WIDTH = 224 // matches w-56

function AddToPlaylist({ trackId, className = '', direction = 'up' }) {
  const { user } = useAuth()
  const { playlists, updateLocal } = usePlaylists()
  const navigate = useNavigate()
  const { toast } = useToast()
  const buttonRef = useRef(null)
  // null = closed; otherwise the screen position of the menu
  const [pos, setPos] = useState(null)

  function toggle(e) {
    e.stopPropagation()
    if (!user) return navigate('/login')
    if (pos) return setPos(null)

    // Measure where the button is on screen
    const rect = buttonRef.current.getBoundingClientRect()
    // Keep the menu inside the screen horizontally
    const left = Math.min(Math.max(8, rect.left), window.innerWidth - MENU_WIDTH - 8)
    setPos(
      direction === 'up'
        ? { left, bottom: window.innerHeight - rect.top + 8 }
        : { left, top: rect.bottom + 8 }
    )
  }

  async function handlePick(playlist) {
    try {
      await addToPlaylist(playlist.id, trackId)
      toast(`Added to ${playlist.name}`)
      updateLocal(playlist.id, { trackCount: playlist.trackCount + 1 })
    } catch (err) {
      toast(err.message, 'error')
    }
    setPos(null)
  }

  return (
    <div className={className}>
      <button
        ref={buttonRef}
        onClick={toggle}
        aria-label="Add to playlist"
        className="flex h-11 w-11 items-center justify-center text-ink-300 transition hover:scale-110 hover:text-ink-100 md:h-9 md:w-9"
      >
        <ListPlus size={20} />
      </button>

      {pos &&
        // Portal: render into document.body so no parent can clip the menu
        createPortal(
          <>
            {/* Invisible backdrop: clicking anywhere else closes the menu */}
            <div
              className="fixed inset-0 z-40"
              onClick={(e) => {
                e.stopPropagation()
                setPos(null)
              }}
            />
            <div
              style={{ left: pos.left, top: pos.top, bottom: pos.bottom }}
              className="fixed z-50 max-h-64 w-56 overflow-y-auto rounded-lg bg-surface-700 p-2 shadow-xl"
            >
              {playlists.length === 0 ? (
                <p className="px-2 py-2 text-sm text-ink-300">
                  Create a playlist from the sidebar first.
                </p>
              ) : (
                playlists.map((p) => (
                  <button
                    key={p.id}
                    onClick={(e) => {
                      e.stopPropagation()
                      handlePick(p)
                    }}
                    className="block w-full truncate rounded px-2 py-2 text-left text-sm hover:bg-surface-600"
                  >
                    {p.name}
                  </button>
                ))
              )}
            </div>
          </>,
          document.body
        )}
    </div>
  )
}

export default AddToPlaylist