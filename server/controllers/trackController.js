import { getTrendingTracks, searchTracks } from '../services/jamendoService.js'

// Keep limit between 1 and 50 so nobody can request thousands of tracks
function parseLimit(value) {
  const n = Number(value)
  if (!Number.isInteger(n) || n < 1) return 20
  return Math.min(n, 50)
}

// GET /api/tracks/trending?limit=20
export async function trending(req, res) {
  try {
    const tracks = await getTrendingTracks(parseLimit(req.query.limit))
    res.json(tracks)
  } catch (err) {
    console.error(err.message)
    // 502 = "bad gateway": our server is fine, the upstream API failed
    res.status(502).json({ message: 'Could not load trending tracks' })
  }
}

// GET /api/tracks/search?q=chill&limit=20
export async function search(req, res) {
  const q = (req.query.q ?? '').trim()
  // 400 = the client sent a bad request
  if (!q) return res.status(400).json({ message: 'Query parameter "q" is required' })

  try {
    const tracks = await searchTracks(q, parseLimit(req.query.limit))
    res.json(tracks)
  } catch (err) {
    console.error(err.message)
    res.status(502).json({ message: 'Search failed' })
  }
}