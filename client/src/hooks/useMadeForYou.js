import { useEffect, useState } from 'react'
import { getRecommendations } from '../services/api'
import { useAuth } from '../context/AuthContext'

export function useMadeForYou() {
  const { user } = useAuth()
  const [tracks, setTracks] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!user) {
      setTracks([])
      return
    }
    let cancelled = false
    setLoading(true)
    getRecommendations()
      .then((data) => !cancelled && setTracks(data))
      .catch(() => {}) // optional row: fail quietly
      .finally(() => !cancelled && setLoading(false))
    return () => {
      cancelled = true
    }
  }, [user])

  return { tracks, loading }
}