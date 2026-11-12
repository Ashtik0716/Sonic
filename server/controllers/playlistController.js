import mongoose from 'mongoose'
import Playlist from '../models/Playlist.js'
import { getTracksByIds } from '../services/jamendoService.js'

const MAX_PLAYLISTS = 50
const MAX_TRACKS = 200

const isTrackId = (id) => /^\d+$/.test(id)

// Shape sent to the client for list views
function summary(p) {
  return { id: p._id, name: p.name, trackCount: p.tracks.length }
}

// Find a playlist only if it belongs to the logged-in user
function findOwned(req) {
  if (!mongoose.isValidObjectId(req.params.id)) return null
  return Playlist.findOne({ _id: req.params.id, owner: req.user._id })
}

// GET /api/playlists
export async function list(req, res) {
  try {
    const playlists = await Playlist.find({ owner: req.user._id }).sort({ updatedAt: -1 })
    res.json(playlists.map(summary))
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ message: 'Could not load playlists' })
  }
}

// POST /api/playlists
export async function create(req, res) {
  const name = req.body.name?.trim()
  if (!name) return res.status(400).json({ message: 'Playlist name is required' })
  if (name.length > 100) return res.status(400).json({ message: 'Name is too long' })

  try {
    const count = await Playlist.countDocuments({ owner: req.user._id })
    if (count >= MAX_PLAYLISTS) {
      return res.status(400).json({ message: `You can have up to ${MAX_PLAYLISTS} playlists` })
    }
    const playlist = await Playlist.create({ owner: req.user._id, name })
    res.status(201).json(summary(playlist))
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ message: 'Could not create playlist' })
  }
}

// GET /api/playlists/:id  (with full track details)
export async function getOne(req, res) {
  try {
    const playlist = await findOwned(req)
    if (!playlist) return res.status(404).json({ message: 'Playlist not found' })

    const tracks = await getTracksByIds(playlist.tracks)
    // Jamendo may reorder results, so restore the playlist's own order
    const byId = new Map(tracks.map((t) => [t.id, t]))
    res.json({
      id: playlist._id,
      name: playlist.name,
      tracks: playlist.tracks.map((id) => byId.get(id)).filter(Boolean),
    })
  } catch (err) {
    console.error(err.message)
    res.status(502).json({ message: 'Could not load playlist' })
  }
}

// PATCH /api/playlists/:id
export async function rename(req, res) {
  const name = req.body.name?.trim()
  if (!name || name.length > 100) {
    return res.status(400).json({ message: 'A name up to 100 characters is required' })
  }
  try {
    const playlist = await findOwned(req)
    if (!playlist) return res.status(404).json({ message: 'Playlist not found' })
    playlist.name = name
    await playlist.save()
    res.json(summary(playlist))
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ message: 'Could not rename playlist' })
  }
}

// DELETE /api/playlists/:id
export async function remove(req, res) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).json({ message: 'Playlist not found' })
    }
    const result = await Playlist.deleteOne({ _id: req.params.id, owner: req.user._id })
    if (result.deletedCount === 0) return res.status(404).json({ message: 'Playlist not found' })
    res.json({ deleted: true })
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ message: 'Could not delete playlist' })
  }
}

// PUT /api/playlists/:id/tracks/:trackId
export async function addTrack(req, res) {
  if (!isTrackId(req.params.trackId)) {
    return res.status(400).json({ message: 'Invalid track id' })
  }
  try {
    const playlist = await findOwned(req)
    if (!playlist) return res.status(404).json({ message: 'Playlist not found' })
    if (playlist.tracks.length >= MAX_TRACKS && !playlist.tracks.includes(req.params.trackId)) {
      return res.status(400).json({ message: `A playlist can hold up to ${MAX_TRACKS} songs` })
    }
    // $addToSet: adding the same song twice is harmless
    await Playlist.updateOne({ _id: playlist._id }, { $addToSet: { tracks: req.params.trackId } })
    res.json({ added: true })
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ message: 'Could not add track' })
  }
}

// DELETE /api/playlists/:id/tracks/:trackId
export async function removeTrack(req, res) {
  if (!isTrackId(req.params.trackId)) {
    return res.status(400).json({ message: 'Invalid track id' })
  }
  try {
    const playlist = await findOwned(req)
    if (!playlist) return res.status(404).json({ message: 'Playlist not found' })
    await Playlist.updateOne({ _id: playlist._id }, { $pull: { tracks: req.params.trackId } })
    res.json({ removed: true })
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ message: 'Could not remove track' })
  }
}