import { useEffect, useState } from 'react'
import { getArtist } from '../services/api'

export function useArtist(id) {
  const [artist, setArtist] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    getArtist(id)
      .then((data) => !cancelled && setArtist(data))
      .catch((err) => !cancelled && setError(err.message))
      .finally(() => !cancelled && setLoading(false))
    return () => {
      cancelled = true
    }
  }, [id])

  return { artist, loading, error }
}