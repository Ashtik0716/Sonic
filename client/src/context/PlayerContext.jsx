import { createContext, useContext, useEffect, useRef, useState } from 'react'

const PlayerContext = createContext(null)

export function PlayerProvider({ children }) {
  const [queue, setQueue] = useState([])
  const [currentIndex, setCurrentIndex] = useState(-1)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isShuffle, setIsShuffle] = useState(false)
  const [repeatMode, setRepeatMode] = useState('off')

  // NEW: a handle to the real <audio> element, plus time info copied from it
  const audioRef = useRef(null)
  const [progress, setProgress] = useState(0) // seconds played
  const [duration, setDuration] = useState(0) // total seconds

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

  function playNext() {
    if (queue.length === 0) return

    if (isShuffle && queue.length > 1) {
      let random = currentIndex
      while (random === currentIndex) {
        random = Math.floor(Math.random() * queue.length)
      }
      setCurrentIndex(random)
    } else {
      const isLast = currentIndex === queue.length - 1
      if (isLast && repeatMode === 'off') {
        setIsPlaying(false)
        return
      }
      setCurrentIndex((currentIndex + 1) % queue.length)
    }
    setIsPlaying(true)
  }

  function playPrevious() {
    if (queue.length === 0) return
    setCurrentIndex((currentIndex - 1 + queue.length) % queue.length)
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

  const value = {
    queue,
    currentTrack,
    isPlaying,
    isShuffle,
    repeatMode,
    progress,
    duration,
    playTrack,
    togglePlay,
    playNext,
    playPrevious,
    toggleShuffle,
    cycleRepeat,
    seek,
  }

  return (
    <PlayerContext.Provider value={value}>
      {children}
      {/* NEW: the one real audio element, invisible. React updates src when the track changes. */}
      <audio
        ref={audioRef}
        src={currentTrack?.audioUrl}
        onTimeUpdate={(e) => setProgress(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onEnded={handleEnded}
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