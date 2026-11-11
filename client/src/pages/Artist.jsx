import { useParams } from 'react-router-dom'
import { Play, Pause } from 'lucide-react'
import { useArtist } from '../hooks/useArtist'
import { usePlayer } from '../context/PlayerContext'
import Section from '../components/music/Section'
import AlbumCard from '../components/music/AlbumCard'
import { formatTime } from '../utils/formatTime'

function Artist() {
  const { id } = useParams()
  const { artist, loading, error } = useArtist(id)
  const { currentTrack, isPlaying, playTrack, togglePlay } = usePlayer()

  if (loading) return <p className="mt-6 text-ink-300">Loading artist...</p>
  if (error) return <p className="mt-6 text-ink-300">Could not load artist: {error}</p>
  if (!artist) return null

  const artistIsCurrent = artist.tracks.some((t) => t.id === currentTrack?.id)
  const artistIsPlaying = artistIsCurrent && isPlaying

  function handlePlay() {
    if (artistIsCurrent) togglePlay()
    else if (artist.tracks.length > 0) playTrack(artist.tracks[0], artist.tracks)
  }

  return (
    <div>
      <div className="mt-4 flex flex-col items-center gap-6 md:flex-row md:items-end">
        <img
          src={artist.cover}
          alt={artist.name}
          className="h-44 w-44 shrink-0 rounded-full object-cover shadow-2xl md:h-56 md:w-56"
        />
        <div className="min-w-0 text-center md:text-left">
          <p className="text-sm font-semibold uppercase tracking-wider text-ink-300">Artist</p>
          <h1 className="mt-1 text-3xl font-extrabold tracking-tight md:text-5xl">{artist.name}</h1>
        </div>
      </div>

      {artist.tracks.length > 0 && (
        <>
          <button
            onClick={handlePlay}
            aria-label={artistIsPlaying ? 'Pause' : 'Play'}
            className="mt-6 flex h-14 w-14 items-center justify-center rounded-full bg-brand-500 transition hover:scale-105 hover:bg-brand-600"
          >
            {artistIsPlaying ? (
              <Pause size={26} className="fill-current" />
            ) : (
              <Play size={26} className="ml-1 fill-current" />
            )}
          </button>

          <h2 className="mt-8 text-2xl font-bold tracking-tight">Popular</h2>
          <ol className="mt-3">
            {artist.tracks.map((track, index) => {
              const isCurrent = currentTrack?.id === track.id
              return (
                <li key={track.id}>
                  <button
                    onClick={() => (isCurrent ? togglePlay() : playTrack(track, artist.tracks))}
                    className="flex w-full items-center gap-4 rounded-lg px-3 py-2 text-left transition hover:bg-surface-700"
                  >
                    <span className={`w-6 text-right text-sm ${isCurrent ? 'text-brand-400' : 'text-ink-300'}`}>
                      {isCurrent && isPlaying ? '▶' : index + 1}
                    </span>
                    <img src={track.cover} alt="" className="h-10 w-10 rounded object-cover" />
                    <span className={`min-w-0 flex-1 truncate font-medium ${isCurrent ? 'text-brand-400' : ''}`}>
                      {track.title}
                    </span>
                    <span className="text-sm text-ink-300">{formatTime(track.duration)}</span>
                  </button>
                </li>
              )
            })}
          </ol>
        </>
      )}

      {artist.albums.length > 0 && (
        <Section title="Albums">
          {artist.albums.map((album) => (
            <AlbumCard key={album.id} album={album} />
          ))}
        </Section>
      )}
    </div>
  )
}

export default Artist