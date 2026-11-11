// A tiny in-memory cache: key -> { value, expires }
const store = new Map()

// Return the cached value, or undefined if missing or expired
export function getCached(key) {
  const entry = store.get(key)
  if (!entry) return undefined
  if (Date.now() > entry.expires) {
    store.delete(key) // expired: throw it away
    return undefined
  }
  return entry.value
}

// Save a value for ttlSeconds
export function setCached(key, value, ttlSeconds) {
  // Safety valve: don't let the cache grow forever
  if (store.size > 500) store.clear()
  store.set(key, { value, expires: Date.now() + ttlSeconds * 1000 })
}

// Wrapper: return cached data, or run fetcher(), cache it, and return it
export async function cached(key, ttlSeconds, fetcher) {
  const hit = getCached(key)
  if (hit !== undefined) return hit
  const value = await fetcher()
  // Don't remember empty answers: they may be a temporary glitch
  if (Array.isArray(value) && value.length === 0) return value
  setCached(key, value, ttlSeconds)
  return value
}
