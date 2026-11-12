// Frontend service: talks to OUR server, never to Jamendo directly.
// In development the base is empty, so URLs are relative and Vite's proxy handles them.
// In production we will set VITE_API_URL to the deployed backend address.
const BASE_URL = import.meta.env.VITE_API_URL ?? ''

async function request(path, params = {}, options = {}) {
  const query = new URLSearchParams(params)
  const qs = query.toString() ? `?${query}` : ''
  const token = localStorage.getItem('sonic-token')

  const response = await fetch(`${BASE_URL}${path}${qs}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      // Attach the token automatically when we have one
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  })

  if (!response.ok) {
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

export function getPopularAlbums() {
  return request('/api/albums/popular')
}

export function getAlbum(id) {
  return request(`/api/albums/${id}`)
}

export function getPopularArtists() {
  return request('/api/artists/popular')
}

export function getArtist(id) {
  return request(`/api/artists/${id}`)
}

export function registerUser(name, email, password) {
  return request('/api/auth/register', {}, {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  })
}

export function loginUser(email, password) {
  return request('/api/auth/login', {}, {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
}

export function getMe() {
  return request('/api/auth/me')
}