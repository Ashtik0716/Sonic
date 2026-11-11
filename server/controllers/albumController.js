import { getPopularAlbums, getAlbum } from '../services/jamendoService.js'

// GET /api/albums/popular
export async function popular(req, res) {
  try {
    res.json(await getPopularAlbums())
  } catch (err) {
    console.error(err.message)
    res.status(502).json({ message: 'Could not load albums' })
  }
}

// GET /api/albums/:id
export async function getById(req, res) {
  // Jamendo ids are numeric: reject anything else early
  if (!/^\d+$/.test(req.params.id)) {
    return res.status(400).json({ message: 'Invalid album id' })
  }
  try {
    const album = await getAlbum(req.params.id)
    if (!album) return res.status(404).json({ message: 'Album not found' })
    res.json(album)
  } catch (err) {
    console.error(err.message)
    res.status(502).json({ message: 'Could not load album' })
  }
}