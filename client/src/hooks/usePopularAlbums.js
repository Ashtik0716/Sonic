import { useEffect, useState } from 'react'
import { getPopularAlbums } from '../services/api'

export function usePopularAlbums() {
  const [albums, setAlbums] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    getPopularAlbums()
      .then((data) => !cancelled && setAlbums(data))
      .catch((err) => !cancelled && setError(err.message))
      .finally(() => !cancelled && setLoading(false))
    return () => {
      cancelled = true
    }
  }, [])

  return { albums, loading, error }
}