import { Play, Pause } from 'lucide-react'
import { usePlayer } from '../../context/PlayerContext'
import LikeButton from './LikeButton'
import AddToPlaylist from './AddToPlaylist'

function TrackCard({ track, list }) {
  const { currentTrack, isPlaying, playTrack, togglePlay } = usePlayer()

  // Is THIS card's track the one loaded, and is it playing right now?
  const isCurrent = currentTrack?.id === track.id
  const isThisPlaying = isCurrent && isPlaying

  function handleClick(event) {
    // Stop the click bubbling up to the card (useful later when the card links to a page)
    event.stopPropagation()
    // Same track: toggle. Different track: load it.
    if (isCurrent) togglePlay()
    else playTrack(track, list)
  }
  

  return (
    <div className="group w-36 shrink-0 cursor-pointer rounded-xl bg-surface-800 p-3 transition hover:bg-surface-700 md:w-44">
      <div className="relative">
        <img
          src={track.cover}
          alt={`${track.title} cover`}
          className="aspect-square w-full rounded-lg object-cover"
        />
        <LikeButton
          trackId={track.id}
          size={20}
          className="absolute left-2 top-2 flex h-9 w-9 items-center justify-center rounded-full bg-surface-950/60 backdrop-blur"
        />
        <div className="absolute right-2 top-2 rounded-full bg-surface-950/60 backdrop-blur">
          <AddToPlaylist trackId={track.id} direction = "down"/>
        </div>
        <button
          onClick={handleClick}
          aria-label={isThisPlaying ? `Pause ${track.title}` : `Play ${track.title}`}
          // Stays visible while this track is playing, otherwise appears on hover
          className={`absolute bottom-2 right-2 flex h-11 w-11 items-center justify-center rounded-full bg-brand-500 text-white shadow-lg transition hover:scale-105 ${
  isThisPlaying
    ? 'translate-y-0 opacity-100'
    : 'opacity-100 md:translate-y-2 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100'
}`}
        >
          {isThisPlaying ? (
            <Pause size={20} className="fill-current" />
          ) : (
            <Play size={20} className="ml-0.5 fill-current" />
          )}
        </button>
      </div>
      {/* Currently loaded track gets a violet title */}
      <p className={`mt-3 truncate font-semibold ${isCurrent ? 'text-brand-400' : ''}`}>
        {track.title}
      </p>
      <p className="truncate text-sm text-ink-300">{track.artist}</p>
    </div>
  )
}

export default TrackCard