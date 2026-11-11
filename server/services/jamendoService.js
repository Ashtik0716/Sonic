// Service layer: the only file that knows how Jamendo's API works
const BASE_URL = 'https://api.jamendo.com/v3.0'

// Convert one Jamendo track into the shape our frontend already uses
function normalizeTrack(raw) {
  return {
    id: raw.id,
    title: raw.name,
    artist: raw.artist_name,
    album: raw.album_name,
    artistId: raw.artist_id,
    albumId: raw.album_id,
    cover: raw.image,
    audioUrl: raw.audio,
    duration: raw.duration,
    shareUrl: raw.shareurl,
  }
}

async function request(endpoint, params = {}) {
  // Read at call time, so dotenv has definitely loaded by now
  const clientId = process.env.JAMENDO_CLIENT_ID
  if (!clientId) {
    throw new Error('Missing JAMENDO_CLIENT_ID in server/.env')
  }

  const query = new URLSearchParams({ client_id: clientId, format: 'json', ...params })
  const response = await fetch(`${BASE_URL}/${endpoint}/?${query}`)
  if (!response.ok) {
    throw new Error(`Jamendo request failed (${response.status})`)
  }

  const data = await response.json()
  if (data.headers.status !== 'success') {
    throw new Error(data.headers.error_message || 'Jamendo returned an error')
  }
  return data.results
}

export async function getTrendingTracks(limit = 20) {
  const results = await request('tracks', {
    order: 'popularity_week',
    limit,
    imagesize: 400,
    audioformat: 'mp31',
  })
  return results.map(normalizeTrack)
}

export async function searchTracks(query, limit = 20) {
  const results = await request('tracks', {
    search: query,
    limit,
    imagesize: 400,
    audioformat: 'mp31',
  })
  return results.map(normalizeTrack)
}