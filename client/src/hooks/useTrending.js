import { useCallback, useEffect, useState } from 'react'
import { getTrendingTracks } from '../services/api'

// Custom hook: fetch trending tracks and report loading / error state
export function useTrending(limit = 20) {
  const [tracks, setTracks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  // Changing this number re-runs the effect: that is how "Retry" works
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let cancelled = false // set to true if the component goes away first

    async function load() {
      setLoading(true)
      setError(null)
      try {
        const data = await getTrendingTracks(limit)
        if (!cancelled) setTracks(data)
      } catch (err) {
        if (!cancelled) setError(err.message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    // Cleanup runs when the component unmounts or the effect re-runs
    return () => {
      cancelled = true
    }
  }, [limit, attempt])

  const retry = useCallback(() => setAttempt((n) => n + 1), [])

  return { tracks, loading, error, retry }
}