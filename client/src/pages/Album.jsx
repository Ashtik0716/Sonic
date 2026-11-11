import { useParams } from 'react-router-dom'
import { Play, Pause } from 'lucide-react'
import { useAlbum } from '../hooks/useAlbum'
import { usePlayer } from '../context/PlayerContext'
import { formatTime } from '../utils/formatTime'

function Album() {
  const { id } = useParams() // the :id from the URL
  const { album, loading, error } = useAlbum(id)
  const { currentTrack, isPlaying, playTrack, togglePlay } = usePlayer()

  if (loading) return <p className="mt-6 text-ink-300">Loading album...</p>
  if (error) return <p className="mt-6 text-ink-300">Could not load album: {error}</p>
  if (!album) return null

  // Is a track from THIS album the one loaded in the player?
  const albumIsCurrent = album.tracks.some((t) => t.id === currentTrack?.id)
  const albumIsPlaying = albumIsCurrent && isPlaying

  function handlePlayAlbum() {
    if (albumIsCurrent) togglePlay()
    else if (album.tracks.length > 0) playTrack(album.tracks[0], album.tracks)
  }

  return (
    <div>
      {/* Header: cover + details (stacked on phones, side by side from md) */}
      <div className="mt-4 flex flex-col gap-6 md:flex-row md:items-end">
        <img
          src={album.cover}
          alt={`${album.title} cover`}
          className="h-48 w-48 shrink-0 rounded-xl object-cover shadow-2xl md:h-56 md:w-56"
        />
        <div className="min-w-0">
          <p className="text-sm font-semibold uppercase tracking-wider text-ink-300">Album</p>
          <h1 className="mt-1 text-3xl font-extrabold tracking-tight md:text-5xl">{album.title}</h1>
          <p className="mt-3 text-ink-300">
            {album.artist} · {album.year} · {album.tracks.length} songs
          </p>
        </div>
      </div>

      {/* Big play button */}
      <button
        onClick={handlePlayAlbum}
        aria-label={albumIsPlaying ? 'Pause album' : 'Play album'}
        className="mt-6 flex h-14 w-14 items-center justify-center rounded-full bg-brand-500 transition hover:scale-105 hover:bg-brand-600"
      >
        {albumIsPlaying ? (
          <Pause size={26} className="fill-current" />
        ) : (
          <Play size={26} className="ml-1 fill-current" />
        )}
      </button>

      {/* Track list */}
      <ol className="mt-6">
        {album.tracks.map((track, index) => {
          const isCurrent = currentTrack?.id === track.id
          return (
            <li key={track.id}>
              <button
                // The whole album becomes the queue
                onClick={() => (isCurrent ? togglePlay() : playTrack(track, album.tracks))}
                className="flex w-full items-center gap-4 rounded-lg px-3 py-3 text-left transition hover:bg-surface-700"
              >
                <span className={`w-6 text-right text-sm ${isCurrent ? 'text-brand-400' : 'text-ink-300'}`}>
                  {isCurrent && isPlaying ? '▶' : index + 1}
                </span>
                <span className="min-w-0 flex-1">
                  <span className={`block truncate font-medium ${isCurrent ? 'text-brand-400' : ''}`}>
                    {track.title}
                  </span>
                  <span className="block truncate text-sm text-ink-300">{track.artist}</span>
                </span>
                <span className="text-sm text-ink-300">{formatTime(track.duration)}</span>
              </button>
            </li>
          )
        })}
      </ol>
    </div>
  )
}

export default Album