import { cached } from './cache.js'

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

export function getTrendingTracks(limit = 20) {
  // 5 minutes: trending changes slowly
  return cached(`trending:${limit}`, 300, async () => {
    const results = await request('tracks', {
      order: 'popularity_week',
      limit,
      imagesize: 400,
      audioformat: 'mp31',
    })
    return results.map(normalizeTrack)
  })
}

export function searchTracks(query, limit = 20) {
  // Lowercase the key so "Piano" and "piano" share one entry. 2 minutes.
  const key = `search:${query.toLowerCase()}:${limit}`
  return cached(key, 120, async () => {
    const results = await request('tracks', {
      search: query,
      limit,
      imagesize: 400,
      audioformat: 'mp31',
    })
    return results.map(normalizeTrack)
  })
}

// Convert one Jamendo album (with nested tracks) into our shape
function normalizeAlbum(raw) {
  return {
    id: raw.id,
    title: raw.name,
    artist: raw.artist_name,
    artistId: raw.artist_id,
    cover: raw.image,
    year: raw.releasedate ? raw.releasedate.slice(0, 4) : '',
    // Tracks inside an album lack artist and cover, so we fill them in
    tracks: (raw.tracks ?? []).map((t) =>
      normalizeTrack({
        ...t,
        artist_name: raw.artist_name,
        artist_id: raw.artist_id,
        album_name: raw.name,
        album_id: raw.id,
        image: raw.image,
        audio: t.audio,
        shareurl: t.shareurl ?? '',
      })
    ),
  }
}

export function getPopularAlbums(limit = 12) {
  return cached(`albums:popular:${limit}`, 600, async () => {
    const results = await request('albums/tracks', {
      order: 'popularity_week',
      limit,
      imagesize: 400,
      audioformat: 'mp31',
    })
    return results.map(normalizeAlbum)
  })
}

export function getAlbum(id) {
  return cached(`albums:${id}`, 600, async () => {
    const results = await request('albums/tracks', {
      id,
      imagesize: 400,
      audioformat: 'mp31',
    })
    return results.length ? normalizeAlbum(results[0]) : null
  })
}

// Convert one Jamendo artist into our shape
function normalizeArtist(raw) {
  return {
    id: raw.id,
    name: raw.name,
    cover: raw.image,
  }
}

export function getPopularArtists(limit = 12) {
  return cached(`artists:popular:${limit}`, 600, async () => {
    const results = await request('artists', {
      order: 'popularity_week',
      limit,
      imagesize: 400,
    })
    return results.map(normalizeArtist)
  })
}

// One artist: profile + their top tracks + their albums, fetched in parallel
export function getArtist(id) {
  return cached(`artists:${id}`, 600, async () => {
    const [profile, tracks, albums] = await Promise.all([
      request('artists', { id, imagesize: 400 }),
      request('tracks', {
        artist_id: id,
        order: 'popularity_total',
        limit: 10,
        imagesize: 400,
        audioformat: 'mp31',
      }),
      request('albums/tracks', {
        artist_id: id,
        order: 'popularity_total',
        limit: 10,
        imagesize: 400,
        audioformat: 'mp31',
      }),
    ])
    if (profile.length === 0) return null
    return {
      ...normalizeArtist(profile[0]),
      tracks: tracks.map(normalizeTrack),
      albums: albums.map(normalizeAlbum),
    }
  })
}

// Look up many tracks at once by id (Jamendo accepts ids joined with "+")
export async function getTracksByIds(ids) {
  if (ids.length === 0) return []
  const results = await request('tracks', {
    id: ids.join('+'),
    limit: ids.length,
    imagesize: 400,
    audioformat: 'mp31',
  })
  return results.map(normalizeTrack)
}

// Search artists by name
function searchArtists(query, limit = 8) {
  return cached(`search:artists:${query.toLowerCase()}:${limit}`, 120, async () => {
    const results = await request('artists', { namesearch: query, limit, imagesize: 400 })
    return results.map(normalizeArtist)
  })
}

// Search albums by name
function searchAlbums(query, limit = 8) {
  return cached(`search:albums:${query.toLowerCase()}:${limit}`, 120, async () => {
    const results = await request('albums', { namesearch: query, limit, imagesize: 400 })
    return results.map((a) => ({
      id: a.id,
      title: a.name,
      artist: a.artist_name,
      artistId: a.artist_id,
      cover: a.image,
      year: a.releasedate ? a.releasedate.slice(0, 4) : '',
    }))
  })
}

// Run all three searches at once; a failed one becomes an empty list
export async function searchAll(query) {
  const [tracks, artists, albums] = await Promise.allSettled([
    searchTracks(query, 20),
    searchArtists(query),
    searchAlbums(query),
  ])
  const value = (r) => (r.status === 'fulfilled' ? r.value : [])

  // If everything failed, that is a real error worth reporting
  if ([tracks, artists, albums].every((r) => r.status === 'rejected')) {
    throw new Error('All searches failed')
  }
  return { tracks: value(tracks), artists: value(artists), albums: value(albums) }
}