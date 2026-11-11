// Frontend service: talks to OUR server, never to Jamendo directly.
// In development the base is empty, so URLs are relative and Vite's proxy handles them.
// In production we will set VITE_API_URL to the deployed backend address.
const BASE_URL = import.meta.env.VITE_API_URL ?? ''

async function request(path, params = {}) {
  const query = new URLSearchParams(params)
  const response = await fetch(`${BASE_URL}${path}?${query}`)

  if (!response.ok) {
    // Our server sends { message } on errors
    const body = await response.json().catch(() => ({}))
    throw new Error(body.message || `Request failed (${response.status})`)
  }
  return response.json()
}

export function getTrendingTracks(limit = 20) {
  return request('/api/tracks/trending', { limit })
}

export function searchTracks(query, limit = 20) {
  return request('/api/tracks/search', { q: query, limit })
}