import { useNavigate, useParams } from 'react-router-dom'
import { Play, Pencil, Trash2, X } from 'lucide-react'
import { usePlaylist } from '../hooks/usePlaylist'
import { usePlayer } from '../context/PlayerContext'
import { usePlaylists } from '../context/PlaylistContext'
import { renamePlaylist, deletePlaylist, removeFromPlaylist } from '../services/api'
import { formatTime } from '../utils/formatTime'
import { useState } from 'react'
import NameModal from '../components/ui/NameModal'
import ConfirmModal from '../components/ui/ConfirmModal'


function Playlist() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { playlist, loading, error, setTracks, setName } = usePlaylist(id)
  const { currentTrack, playTrack, togglePlay } = usePlayer()
  const { updateLocal, removeLocal } = usePlaylists()
  const [modal, setModal] = useState(null) // 'rename' | 'delete' | null

  if (loading) return <p className="mt-6 text-ink-300">Loading...</p>
  if (error) return <p className="mt-6 text-ink-300">Could not load playlist: {error}</p>
  if (!playlist) return null

  async function handleRename(name) {
    await renamePlaylist(id, name)
    setName(name)
    updateLocal(id, { name })
  }

  async function handleDelete() {
    await deletePlaylist(id)
    removeLocal(id)
    navigate('/library')
  }

  async function handleRemoveTrack(trackId) {
    try {
      await removeFromPlaylist(id, trackId)
      setTracks((tracks) => tracks.filter((t) => t.id !== trackId))
      updateLocal(id, { trackCount: playlist.tracks.length - 1 })
    } catch (err) {
      window.alert(err.message)
    }
  }

  return (
    <div>
      <p className="mt-4 text-sm font-semibold uppercase tracking-wider text-ink-300">Playlist</p>
      <h1 className="mt-1 text-3xl font-extrabold tracking-tight md:text-5xl">{playlist.name}</h1>
      <p className="mt-2 text-ink-300">{playlist.tracks.length} songs</p>

      <div className="mt-6 flex items-center gap-3">
        {playlist.tracks.length > 0 && (
          <button
            onClick={() => playTrack(playlist.tracks[0], playlist.tracks)}
            aria-label="Play playlist"
            className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-500 transition hover:scale-105 hover:bg-brand-600"
          >
            <Play size={26} className="ml-1 fill-current" />
          </button>
        )}
        <button onClick={() => setModal('rename')} aria-label="Rename" className="p-3 text-ink-300 hover:text-ink-100">
  <Pencil size={20} />
</button>
<button onClick={() => setModal('delete')} aria-label="Delete playlist" className="p-3 text-ink-300 hover:text-red-400">
  <Trash2 size={20} />
</button>
        {modal === 'rename' && (
          <NameModal
            title="Rename playlist"
            initialValue={playlist.name}
            onSubmit={handleRename}
            onClose={() => setModal(null)}
          />
        )}
        {modal === 'delete' && (
          <ConfirmModal
            title="Delete playlist?"
            message={`"${playlist.name}" will be permanently deleted.`}
            onConfirm={handleDelete}
            onClose={() => setModal(null)}
          />
        )}
      </div>

      {playlist.tracks.length === 0 ? (
        <p className="mt-6 text-ink-300">Empty for now. Use "Add to playlist" in the player to add songs.</p>
      ) : (
        <ol className="mt-6">
          {playlist.tracks.map((track, i) => {
            const isCurrent = currentTrack?.id === track.id
            return (
              <li key={track.id} className="flex items-center gap-2 rounded-lg px-3 transition hover:bg-surface-700">
                <button
                  onClick={() => (isCurrent ? togglePlay() : playTrack(track, playlist.tracks))}
                  className="flex min-w-0 flex-1 items-center gap-4 py-2 text-left"
                >
                  <span className="w-6 text-right text-sm text-ink-300">{i + 1}</span>
                  <img src={track.cover} alt="" className="h-10 w-10 rounded object-cover" />
                  <span className="min-w-0 flex-1">
                    <span className={`block truncate font-medium ${isCurrent ? 'text-brand-400' : ''}`}>{track.title}</span>
                    <span className="block truncate text-sm text-ink-300">{track.artist}</span>
                  </span>
                  <span className="text-sm text-ink-300">{formatTime(track.duration)}</span>
                </button>
                <button
                  onClick={() => handleRemoveTrack(track.id)}
                  aria-label={`Remove ${track.title}`}
                  className="p-2 text-ink-300 hover:text-red-400"
                >
                  <X size={18} />
                </button>
              </li>
            )
          })}
        </ol>
      )}
    </div>
  )
}

export default Playlist