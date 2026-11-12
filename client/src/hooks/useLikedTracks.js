import { useEffect, useState } from 'react'
import { getLikedTracks } from '../services/api'

export function useLikedTracks() {
  const [tracks, setTracks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    getLikedTracks()
      .then((data) => !cancelled && setTracks(data))
      .catch((err) => !cancelled && setError(err.message))
      .finally(() => !cancelled && setLoading(false))
    return () => {
      cancelled = true
    }
  }, [])

  return { tracks, loading, error }
}