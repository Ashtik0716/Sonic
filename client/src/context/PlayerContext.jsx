import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { useAuth } from './AuthContext'
import { recordPlay, getSimilarTracks } from '../services/api'
import { useToast } from './ToastContext'


const PlayerContext = createContext(null)

export function PlayerProvider({ children }) {
    const [queue, setQueue] = useState([])
    const [currentIndex, setCurrentIndex] = useState(-1)
    const [isPlaying, setIsPlaying] = useState(false)
    const [isShuffle, setIsShuffle] = useState(false)
    const [repeatMode, setRepeatMode] = useState('off')
    const { user } = useAuth()
    const { toast } = useToast()
    const [autoplay, setAutoplay] = useState(() => localStorage.getItem('sonic-autoplay') !== 'off')
    const fetchingRef = useRef(false) // prevents duplicate recommendation requests
    const seenRef = useRef(new Set()) // ids heard this session

    // NEW: a handle to the real <audio> element, plus time info copied from it
    const audioRef = useRef(null)
    const [progress, setProgress] = useState(0) // seconds played
    const [duration, setDuration] = useState(0) // total seconds


    // Volume from 0 to 1. The function form reads the saved value once at startup.
    const [volume, setVolumeState] = useState(() => {
        const saved = localStorage.getItem('sonic-volume')
        return saved !== null ? Number(saved) : 0.8
    })

    const [unavailable, setUnavailable] = useState(() => {
        try {
            return new Set(JSON.parse(localStorage.getItem('sonic-unavailable') ?? '[]'))
        } catch {
            return new Set()
        }
    })
    const [isMuted, setIsMuted] = useState(false)

    const currentTrack = currentIndex >= 0 ? queue[currentIndex] : null

    // NEW: keep the audio element in sync with isPlaying.
    // Runs after render whenever isPlaying or the track changes.
    useEffect(() => {
        const audio = audioRef.current
        if (!audio || !currentTrack) return

        if (isPlaying) {
            // play() returns a promise; it can be rejected (blocked, bad URL)
            audio.play().catch(() => setIsPlaying(false))
        } else {
            audio.pause()
        }
    }, [isPlaying, currentTrack])

    // Push volume and mute onto the real audio element whenever they change.
    // currentTrack is a dependency because the element is created fresh on first load.
    useEffect(() => {
        const audio = audioRef.current
        if (!audio) return
        audio.volume = volume
        audio.muted = isMuted
    }, [volume, isMuted, currentTrack])

    // Tell the OS what is playing (title, artist, artwork)
    useEffect(() => {
        if (!('mediaSession' in navigator) || !currentTrack) return

        navigator.mediaSession.metadata = new MediaMetadata({
            title: currentTrack.title,
            artist: currentTrack.artist,
            artwork: [{ src: currentTrack.cover, sizes: '400x400', type: 'image/jpeg' }],
        })
    }, [currentTrack])

    // Tell the OS which buttons work and what they do
    useEffect(() => {
        if (!('mediaSession' in navigator)) return

        const session = navigator.mediaSession
        session.setActionHandler('play', () => setIsPlaying(true))
        session.setActionHandler('pause', () => setIsPlaying(false))
        session.setActionHandler('nexttrack', playNext)
        session.setActionHandler('previoustrack', playPrevious)
        session.setActionHandler('seekto', (details) => seek(details.seekTime))

        // Cleanup: remove handlers if the provider ever unmounts
        return () => {
            ;['play', 'pause', 'nexttrack', 'previoustrack', 'seekto'].forEach((action) =>
                session.setActionHandler(action, null)
            )
        }
    })

    // Report position so the lock-screen scrubber is accurate
    useEffect(() => {
        if (!('mediaSession' in navigator) || !duration) return
        try {
            navigator.mediaSession.setPositionState({
                duration,
                position: Math.min(progress, duration),
                playbackRate: 1,
            })
        } catch {
            // Some browsers throw on invalid values; safe to ignore
        }
    }, [progress, duration])

    // Record a play once the track has been playing for 5 seconds
    useEffect(() => {
        if (!user || !currentTrack || !isPlaying) return
        const timer = setTimeout(() => {
            recordPlay(currentTrack.id).catch(() => { }) // history is nice-to-have; ignore failures
        }, 5000)
        // Skipping or pausing before 5s cancels the timer
        return () => clearTimeout(timer)
    }, [user, currentTrack, isPlaying])

    // When the queue is nearly finished, append similar songs
    useEffect(() => {
        if (!currentTrack) return
        seenRef.current.add(currentTrack.id)

        const remaining = queue.length - currentIndex - 1
        if (!autoplay || remaining > 2 || fetchingRef.current) return

        fetchingRef.current = true
        getSimilarTracks(currentTrack.id)
            .then((list) => {
                const inQueue = new Set(queue.map((t) => t.id))
                const fresh = list
                    .filter((t) => !inQueue.has(t.id) && !unavailable.has(t.id) && !seenRef.current.has(t.id))
                    .sort(() => Math.random() - 0.5) // variety: same seed, different order
                    .slice(0, 10)
                    .map((t) => ({ ...t, recommended: true }))
                if (fresh.length > 0) {
                    setQueue((q) => [...q, ...fresh.filter((t) => !q.some((x) => x.id === t.id))])
                }
            })
            .catch(() => { }) // recommendations are optional
            .finally(() => {
                fetchingRef.current = false
            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [autoplay, currentTrack?.id, queue.length, currentIndex])

    function playTrack(track, list = [track]) {
        const index = list.findIndex((t) => t.id === track.id)
        setQueue(list)
        setCurrentIndex(index >= 0 ? index : 0)
        setIsPlaying(true)
    }

    function togglePlay() {
        if (!currentTrack) return
        setIsPlaying((prev) => !prev)
    }

    async function playNext() {
        if (queue.length === 0) return

        // Shuffle: prefer songs not heard yet, start a fresh round when all are heard
        if (isShuffle && queue.length > 1) {
            let pool = queue.map((_, i) => i).filter((i) => i !== currentIndex && !seenRef.current.has(queue[i].id))
            if (pool.length === 0) {
                seenRef.current = new Set([queue[currentIndex].id])
                pool = queue.map((_, i) => i).filter((i) => i !== currentIndex)
            }
            setCurrentIndex(pool[Math.floor(Math.random() * pool.length)])
            setIsPlaying(true)
            return
        }

        const isLast = currentIndex === queue.length - 1

        // Not the last song: just move forward
        if (!isLast) {
            setCurrentIndex(currentIndex + 1)
            setIsPlaying(true)
            return
        }

        // Last song with repeat on: loop back to the start
        if (repeatMode !== 'off') {
            setCurrentIndex(0)
            setIsPlaying(true)
            return
        }

        // Last song with autoplay on: fetch similar songs and continue with them
        if (autoplay && currentTrack) {
            try {
                const list = await getSimilarTracks(currentTrack.id)
                const inQueue = new Set(queue.map((t) => t.id))
                const fresh = list
                    .filter((t) => !inQueue.has(t.id) && !unavailable.has(t.id))
                    .map((t) => ({ ...t, recommended: true }))
                if (fresh.length > 0) {
                    setQueue([...queue, ...fresh])
                    setCurrentIndex(queue.length) // first new song
                    setIsPlaying(true)
                    return
                }
            } catch {
                // fall through: nothing to play next
            }
        }

        setIsPlaying(false)
    }

    function playPrevious() {
        if (queue.length === 0) return
        setCurrentIndex((currentIndex - 1 + queue.length) % queue.length)
        setIsPlaying(true)
    }

    // Jump to a specific position in the current queue
    function playFromQueue(index) {
        if (index < 0 || index >= queue.length) return
        setCurrentIndex(index)
        setIsPlaying(true)
    }

    function toggleShuffle() {
        setIsShuffle((prev) => !prev)
    }

    function cycleRepeat() {
        setRepeatMode((prev) => (prev === 'off' ? 'all' : prev === 'all' ? 'one' : 'off'))
    }

    // NEW: jump to a time (in seconds) when the user drags the progress bar
    function seek(time) {
        if (!audioRef.current) return
        audioRef.current.currentTime = time
        setProgress(time)
    }

    // Called by the slider. Moving it above 0 also un-mutes.
    function setVolume(value) {
        setVolumeState(value)
        setIsMuted(value === 0)
        localStorage.setItem('sonic-volume', String(value))
    }

    function toggleMute() {
        setIsMuted((prev) => !prev)
    }

    function toggleAutoplay() {
        setAutoplay((prev) => {
            localStorage.setItem('sonic-autoplay', prev ? 'off' : 'on')
            return !prev
        })
    }

    // NEW: called when a song finishes
    function handleEnded() {
        const audio = audioRef.current
        // Repeat one (or repeat all with a single-song queue): restart the same song
        if (repeatMode === 'one' || (repeatMode === 'all' && queue.length === 1)) {
            audio.currentTime = 0
            audio.play()
        } else {
            playNext()
        }
    }

    // A track failed to load: remember it, remove it from the queue, move on
    function handleError() {
        if (!currentTrack) return
        const deadId = currentTrack.id

        // 1. Remember it (and save for next visit)
        setUnavailable((prev) => {
            const next = new Set(prev).add(deadId)
            localStorage.setItem('sonic-unavailable', JSON.stringify([...next]))
            return next
        })
        toast(`"${currentTrack.title}" is unavailable`, 'error')

        // 2. Remove it from the queue
        const newQueue = queue.filter((t) => t.id !== deadId)
        if (newQueue.length === 0) {
            setQueue([])
            setCurrentIndex(-1)
            setIsPlaying(false)
            return
        }
        setQueue(newQueue)
        // After removal, the next song sits at the same index
        if (currentIndex < newQueue.length) {
            setCurrentIndex(currentIndex)
        } else {
            // The dead track was last: stop on the final remaining song
            setCurrentIndex(newQueue.length - 1)
            setIsPlaying(false)
        }
    }

    const value = {
        queue,
        currentTrack,
        isPlaying,
        isShuffle,
        repeatMode,
        progress,
        duration,
        volume,
        isMuted,
        playTrack,
        togglePlay,
        playNext,
        playPrevious,
        toggleShuffle,
        cycleRepeat,
        seek,
        setVolume,
        toggleMute,
        playFromQueue,
        currentIndex,
        unavailable,
        autoplay,
        toggleAutoplay,
    }

    return (
        <PlayerContext.Provider value={value}>
            {children}
            {/* NEW: the one real audio element, invisible. React updates src when the track changes. */}
            <audio
                ref={audioRef}
                src={currentTrack?.audioUrl || undefined}
                onTimeUpdate={(e) => setProgress(e.currentTarget.currentTime)}
                onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
                onEnded={handleEnded}
                onError={handleError}
            />
        </PlayerContext.Provider>
    )
}

export function usePlayer() {
    const context = useContext(PlayerContext)
    if (!context) {
        throw new Error('usePlayer must be used inside <PlayerProvider>')
    }
    return context
}