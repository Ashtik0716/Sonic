import { useEffect, useState } from 'react'
import { getPopularArtists } from '../services/api'

export function usePopularArtists() {
  const [artists, setArtists] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    getPopularArtists()
      .then((data) => !cancelled && setArtists(data))
      .catch(() => {}) // row simply stays empty if it fails
      .finally(() => !cancelled && setLoading(false))
    return () => {
      cancelled = true
    }
  }, [])

  return { artists, loading }
}
