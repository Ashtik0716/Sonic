import { useEffect, useState } from 'react'
import { getAlbum } from '../services/api'

export function useAlbum(id) {
  const [album, setAlbum] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    getAlbum(id)
      .then((data) => !cancelled && setAlbum(data))
      .catch((err) => !cancelled && setError(err.message))
      .finally(() => !cancelled && setLoading(false))
    return () => {
      cancelled = true
    }
  }, [id]) // re-run when the album id in the URL changes

  return { album, loading, error }
}