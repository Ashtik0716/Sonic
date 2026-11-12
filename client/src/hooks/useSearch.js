import { useEffect, useState } from 'react'
import { searchAll } from '../services/api'
import { useDebounce } from './useDebounce'

const EMPTY = { tracks: [], artists: [], albums: [] }

export function useSearch(query) {
  const [results, setResults] = useState(EMPTY)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const debouncedQuery = useDebounce(query.trim(), 400)

  useEffect(() => {
    if (!debouncedQuery) {
      setResults(EMPTY)
      setLoading(false)
      setError(null)
      return
    }

    let cancelled = false

    async function run() {
      setLoading(true)
      setError(null)
      try {
        const data = await searchAll(debouncedQuery)
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