import { createContext, useContext, useState } from 'react'

const PlayerContext = createContext(null)

export function PlayerProvider({ children }) {
  // The ordered list of tracks and our position in it
  const [queue, setQueue] = useState([])
  const [currentIndex, setCurrentIndex] = useState(-1) // -1 = nothing loaded
  const [isPlaying, setIsPlaying] = useState(false)
  const [isShuffle, setIsShuffle] = useState(false)
  // 'off' | 'all' | 'one'
  const [repeatMode, setRepeatMode] = useState('off')

  // Derived value: no separate state, so it can never go out of sync
  const currentTrack = currentIndex >= 0 ? queue[currentIndex] : null

  // Load a track. "list" is the array it came from; it becomes the queue.
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
      // Pick a random index that is not the current one
      let random = currentIndex
      while (random === currentIndex) {
        random = Math.floor(Math.random() * queue.length)
      }
      setCurrentIndex(random)
    } else {
      const isLast = currentIndex === queue.length - 1
      // At the end with repeat off: stop instead of looping
      if (isLast && repeatMode === 'off') {
        setIsPlaying(false)
        return
      }
      // % wraps back to 0 after the last track
      setCurrentIndex((currentIndex + 1) % queue.length)
    }
    setIsPlaying(true)
  }

  function playPrevious() {
    if (queue.length === 0) return
    // + queue.length avoids a negative index when going back from 0
    setCurrentIndex((currentIndex - 1 + queue.length) % queue.length)
    setIsPlaying(true)
  }

  function toggleShuffle() {
    setIsShuffle((prev) => !prev)
  }

  // Cycle: off -> all -> one -> off
  function cycleRepeat() {
    setRepeatMode((prev) => (prev === 'off' ? 'all' : prev === 'all' ? 'one' : 'off'))
  }

  const value = {
    queue,
    currentTrack,
    isPlaying,
    isShuffle,
    repeatMode,
    playTrack,
    togglePlay,
    playNext,
    playPrevious,
    toggleShuffle,
    cycleRepeat,
  }

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>
}

export function usePlayer() {
  const context = useContext(PlayerContext)
  if (!context) {
    throw new Error('usePlayer must be used inside <PlayerProvider>')
  }
  return context
}