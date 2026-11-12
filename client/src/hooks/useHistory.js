import { useEffect, useState } from 'react'
import { getHistory } from '../services/api'
import { useAuth } from '../context/AuthContext'

export function useHistory() {
  const { user } = useAuth()
  const [tracks, setTracks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      setTracks([])
      setLoading(false)
      return
    }
    let cancelled = false
    getHistory()
      .then((data) => !cancelled && setTracks(data))
      .catch(() => {})
      .finally(() => !cancelled && setLoading(false))
    return () => {
      cancelled = true
    }
  }, [user])

  return { tracks, loading }
}