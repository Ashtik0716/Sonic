import { useEffect, useState } from 'react'

// Returns "value", but only after it has stopped changing for "delay" ms
export function useDebounce(value, delay = 400) {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    // Start a timer each time value changes
    const timer = setTimeout(() => setDebounced(value), delay)
    // Cleanup cancels the previous timer, so only the last keystroke counts
    return () => clearTimeout(timer)
  }, [value, delay])

  return debounced
}