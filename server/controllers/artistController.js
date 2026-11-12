import { getPopularArtists, getArtist } from '../services/jamendoService.js'

// GET /api/artists/popular
export async function popular(req, res) {
  try {
    res.json(await getPopularArtists())
  } catch (err) {
    console.error(err.message)
    res.status(502).json({ message: 'Could not load artists' })
  }
}

// GET /api/artists/:id
export async function getById(req, res) {
  if (!/^\d+$/.test(req.params.id)) {
    return res.status(400).json({ message: 'Invalid artist id' })
  }
  try {
    const artist = await getArtist(req.params.id)
    if (!artist) return res.status(404).json({ message: 'Artist not found' })
    res.json(artist)
  } catch (err) {
    console.error(err.message)
    res.status(502).json({ message: 'Could not load artist' })
  }
}