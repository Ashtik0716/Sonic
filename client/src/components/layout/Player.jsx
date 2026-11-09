import { useState } from 'react'
import { Shuffle, SkipBack, SkipForward, Play, Pause, Repeat, Repeat1, Heart, Volume2, ListMusic } from 'lucide-react'
import { usePlayer } from '../../context/PlayerContext'
import { formatTime } from '../../utils/formatTime'

// Small reusable button so we don't repeat these classes 7 times
function IconButton({ icon: Icon, label, active = false, size = 20, onClick }) {
    return (
        <button
            onClick={onClick}
            aria-label={label}
            className={`flex h-11 w-11 items-center justify-center rounded-full transition hover:scale-110 md:h-9 md:w-9 ${active ? 'text-brand-400' : 'text-ink-300 hover:text-ink-100'
                }`}
        >
            <Icon size={size} />
        </button>
    )
}

function Player() {
    // Read shared state from context instead of keeping our own
    const {
        currentTrack,
        isPlaying,
        isShuffle,
        repeatMode,
        progress,
        duration,
        togglePlay,
        playNext,
        playPrevious,
        toggleShuffle,
        cycleRepeat,
        seek,
    } = usePlayer()
    // Liking stays local for now; it moves to the backend in Phase 10
    const [isLiked, setIsLiked] = useState(false)
    // How far through the song we are, as a percentage (guard against dividing by 0)
    const percent = duration ? (progress / duration) * 100 : 0

    // Nothing chosen yet: show a quiet empty state
    if (!currentTrack) {
        return (
            <div className="flex h-full items-center justify-center rounded-xl bg-surface-800 px-4 text-sm text-ink-300">
                Pick a song to start listening
            </div>
        )
    }

    return (
        <div className="relative grid h-full grid-cols-[1fr_auto] items-center gap-4 overflow-hidden rounded-xl bg-surface-800 px-4 md:grid-cols-[1fr_2fr_1fr]">
            {/* LEFT: artwork + track info */}
            <div className="flex min-w-0 items-center gap-3">
                <img
                    src={currentTrack.cover}
                    alt={`${currentTrack.title} cover`}
                    className="h-14 w-14 shrink-0 rounded-md object-cover"
                />
                {/* min-w-0 + truncate: long titles get "..." instead of breaking layout */}
                <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{currentTrack.title}</p>
                    <p className="truncate text-xs text-ink-300">{currentTrack.artist}</p>
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
                        <IconButton icon={Shuffle} label="Shuffle" active={isShuffle} onClick={toggleShuffle} />
                    </div>
                    <IconButton icon={SkipBack} label="Previous" size={22} onClick={playPrevious} />

                    {/* Main play/pause button: icon depends on isPlaying */}
                    <button
                        onClick={togglePlay}
                        aria-label={isPlaying ? 'Pause' : 'Play'}
                        className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-surface-950 transition hover:scale-105"
                    >
                        {isPlaying ? (
                            <Pause size={22} className="fill-current" />
                        ) : (
                            <Play size={22} className="ml-0.5 fill-current" />
                        )}
                    </button>

                    <IconButton icon={SkipForward} label="Next" size={22} onClick={playNext} />
                    <div className="hidden sm:block">
                        <IconButton
                            icon={repeatMode === 'one' ? Repeat1 : Repeat}
                            label="Repeat"
                            active={repeatMode !== 'off'}
                            onClick={cycleRepeat}
                        />
                    </div>
                </div>

                {/* Progress bar: hidden on the smallest screens; static for now */}
                {/* Progress bar: a range input, so click and drag work for free */}
                <div className="hidden w-full max-w-xl items-center gap-2 text-xs text-ink-300 md:flex">
                    <span className="w-10 text-right">{formatTime(progress)}</span>
                    <input
                        type="range"
                        min={0}
                        max={duration || 0}
                        step={0.1}
                        value={progress}
                        onChange={(e) => seek(Number(e.target.value))}
                        aria-label="Seek"
                        className="h-1 flex-1 cursor-pointer accent-brand-400"
                    />
                    <span className="w-10">{formatTime(duration)}</span>
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

            {/* Thin progress line: phones only (desktop has the full bar) */}
            <div className="absolute inset-x-0 bottom-0 h-0.5 bg-surface-600 md:hidden">
                <div className="h-full bg-brand-400" style={{ width: `${percent}%` }} />
            </div>
        </div>
    )
}

export default Player