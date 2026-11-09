// Service layer: all Jamendo API knowledge lives in this one file.
const BASE_URL = 'https://api.jamendo.com/v3.0'
// Vite exposes variables that start with VITE_ through import.meta.env
const CLIENT_ID = import.meta.env.VITE_JAMENDO_CLIENT_ID

// Convert one Jamendo track into the shape our components already use
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
    duration: raw.duration, // seconds (a number)
    shareUrl: raw.shareurl,
  }
}

// Generic helper: builds the URL, calls the API, checks for errors
async function request(endpoint, params = {}) {
  if (!CLIENT_ID) {
    throw new Error('Missing VITE_JAMENDO_CLIENT_ID. Check client/.env and restart the dev server.')
  }

  // URLSearchParams safely builds "?a=1&b=2" and escapes special characters
  const query = new URLSearchParams({
    client_id: CLIENT_ID,
    format: 'json',
    ...params,
  })

  const response = await fetch(`${BASE_URL}/${endpoint}/?${query}`)
  if (!response.ok) {
    throw new Error(`Jamendo request failed (${response.status})`)
  }

  const data = await response.json()
  // Jamendo reports its own errors inside the body, even with HTTP 200
  if (data.headers.status !== 'success') {
    throw new Error(data.headers.error_message || 'Jamendo returned an error')
  }
  return data.results
}

// Most popular tracks this week
export async function getTrendingTracks(limit = 20) {
  const results = await request('tracks', {
    order: 'popularity_week',
    limit,
    imagesize: 400, // larger artwork for the cards
    audioformat: 'mp31',
  })
  return results.map(normalizeTrack)
}