import { useState } from 'react'
import {
  Shuffle,
  SkipBack,
  SkipForward,
  Play,
  Pause,
  Repeat,
  Heart,
  Volume2,
  ListMusic,
} from 'lucide-react'
import { nowPlaying } from '../../data/mockTracks'

// Small reusable button so we don't repeat these classes 7 times
function IconButton({ icon: Icon, label, active = false, size = 20, onClick }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className={`flex h-9 w-9 items-center justify-center rounded-full transition hover:scale-110 ${
        active ? 'text-brand-400' : 'text-ink-300 hover:text-ink-100'
      }`}
    >
      <Icon size={size} />
    </button>
  )
}

function Player() {
  // Local state for now; becomes global state in Phase 4
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLiked, setIsLiked] = useState(false)

  return (
    <div className="grid h-full grid-cols-[1fr_auto] items-center gap-4 rounded-xl bg-surface-800 px-4 md:grid-cols-[1fr_2fr_1fr]">
      {/* LEFT: artwork + track info */}
      <div className="flex min-w-0 items-center gap-3">
        <img
          src={nowPlaying.cover}
          alt={`${nowPlaying.title} cover`}
          className="h-14 w-14 shrink-0 rounded-md object-cover"
        />
        {/* min-w-0 + truncate: long titles get "..." instead of breaking layout */}
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{nowPlaying.title}</p>
          <p className="truncate text-xs text-ink-300">{nowPlaying.artist}</p>
        </div>
        <button
          onClick={() => setIsLiked(!isLiked)}
          aria-label={isLiked ? 'Unlike' : 'Like'}
          className="ml-1 hidden transition hover:scale-110 sm:block"
        >
          <Heart
            size={18}
            className={isLiked ? 'fill-brand-400 text-brand-400' : 'text-ink-300'}
          />
        </button>
      </div>

      {/* CENTRE: controls + progress bar */}
      <div className="flex flex-col items-center gap-2">
        <div className="flex items-center gap-2">
          {/* Shuffle and repeat are hidden on small screens to save space */}
          <div className="hidden sm:block">
            <IconButton icon={Shuffle} label="Shuffle" />
          </div>
          <IconButton icon={SkipBack} label="Previous" size={22} />

          {/* Main play/pause button: icon depends on isPlaying */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            aria-label={isPlaying ? 'Pause' : 'Play'}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-surface-950 transition hover:scale-105"
          >
            {isPlaying ? (
              <Pause size={22} className="fill-current" />
            ) : (
              <Play size={22} className="ml-0.5 fill-current" />
            )}
          </button>

          <IconButton icon={SkipForward} label="Next" size={22} />
          <div className="hidden sm:block">
            <IconButton icon={Repeat} label="Repeat" />
          </div>
        </div>

        {/* Progress bar: hidden on the smallest screens; static for now */}
        <div className="hidden w-full max-w-xl items-center gap-2 text-xs text-ink-300 md:flex">
          <span>1:05</span>
          <div className="group h-1 flex-1 rounded-full bg-surface-600">
            {/* The filled part: width is a percentage of the track */}
            <div className="h-full w-1/3 rounded-full bg-ink-100 transition-colors group-hover:bg-brand-400" />
          </div>
          <span>{nowPlaying.duration}</span>
        </div>
      </div>

      {/* RIGHT: queue + volume (hidden on mobile) */}
      <div className="hidden items-center justify-end gap-2 md:flex">
        <IconButton icon={ListMusic} label="Queue" />
        <Volume2 size={20} className="text-ink-300" />
        <div className="group h-1 w-24 rounded-full bg-surface-600">
          <div className="h-full w-2/3 rounded-full bg-ink-100 transition-colors group-hover:bg-brand-400" />
        </div>
      </div>
    </div>
  )
}

export default Player