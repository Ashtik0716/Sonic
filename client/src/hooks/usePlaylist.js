import { useCallback, useEffect, useState } from 'react'
import { getPlaylist } from '../services/api'

export function usePlaylist(id) {
  const [playlist, setPlaylist] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    getPlaylist(id)
      .then((data) => !cancelled && setPlaylist(data))
      .catch((err) => !cancelled && setError(err.message))
      .finally(() => !cancelled && setLoading(false))
    return () => {
      cancelled = true
    }
  }, [id])

  // Lets the page edit its own copy without refetching
  const setTracks = useCallback(
    (fn) => setPlaylist((p) => (p ? { ...p, tracks: fn(p.tracks) } : p)),
    []
  )
  const setName = useCallback((name) => setPlaylist((p) => (p ? { ...p, name } : p)), [])

  return { playlist, loading, error, setTracks, setName }
}