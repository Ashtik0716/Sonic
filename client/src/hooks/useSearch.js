import { useEffect, useState } from 'react'
import { searchTracks } from '../services/jamendo'
import { useDebounce } from './useDebounce'

export function useSearch(query) {
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Only react to the query once typing pauses
  const debouncedQuery = useDebounce(query.trim(), 400)

  useEffect(() => {
    // Empty search: clear results and don't call the API
    if (!debouncedQuery) {
      setResults([])
      setLoading(false)
      setError(null)
      return
    }

    let cancelled = false // ignore answers from outdated searches

    async function run() {
      setLoading(true)
      setError(null)
      try {
        const data = await searchTracks(debouncedQuery)
        if (!cancelled) setResults(data)
      } catch (err) {
        if (!cancelled) setError(err.message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    run()
    return () => {
      cancelled = true
    }
  }, [debouncedQuery])

  return { results, loading, error, debouncedQuery }
}