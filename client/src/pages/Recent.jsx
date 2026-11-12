import { Play } from 'lucide-react'
import { useHistory } from '../hooks/useHistory'
import { usePlayer } from '../context/PlayerContext'
import LikeButton from '../components/music/LikeButton'
import { formatTime } from '../utils/formatTime'

function Recent() {
  const { tracks, loading } = useHistory()
  const { currentTrack, playTrack, togglePlay } = usePlayer()

  if (loading) return <p className="mt-6 text-ink-300">Loading...</p>

  return (
    <div>
      <h1 className="mt-4 text-3xl font-extrabold tracking-tight md:text-5xl">Recently Played</h1>
      <p className="mt-2 text-ink-300">{tracks.length} songs</p>

      {tracks.length === 0 ? (
        <p className="mt-6 text-ink-300">Songs you play will show up here.</p>
      ) : (
        <>
          <button
            onClick={() => playTrack(tracks[0], tracks)}
            aria-label="Play recently played"
            className="mt-6 flex h-14 w-14 items-center justify-center rounded-full bg-brand-500 transition hover:scale-105 hover:bg-brand-600"
          >
            <Play size={26} className="ml-1 fill-current" />
          </button>

          <ol className="mt-6">
            {tracks.map((track, i) => {
              const isCurrent = currentTrack?.id === track.id
              return (
                <li key={track.id} className="flex items-center gap-2 rounded-lg px-3 transition hover:bg-surface-700">
                  <button
                    onClick={() => (isCurrent ? togglePlay() : playTrack(track, tracks))}
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
                  <LikeButton trackId={track.id} />
                </li>
              )
            })}
          </ol>
        </>
      )}
    </div>
  )
}

export default Recent