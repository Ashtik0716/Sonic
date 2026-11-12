import User from '../models/User.js'
import { getTracksByIds } from '../services/jamendoService.js'

const MAX_RECENT = 30

// GET /api/history -> full track objects, newest first
export async function getHistory(req, res) {
  try {
    const ids = req.user.recentTracks
    const tracks = await getTracksByIds(ids)
    const byId = new Map(tracks.map((t) => [t.id, t]))
    res.json(ids.map((id) => byId.get(id)).filter(Boolean))
  } catch (err) {
    console.error(err.message)
    res.status(502).json({ message: 'Could not load history' })
  }
}

// PUT /api/history/:trackId
export async function record(req, res) {
  const { trackId } = req.params
  if (!/^\d+$/.test(trackId)) {
    return res.status(400).json({ message: 'Invalid track id' })
  }
  try {
    // MongoDB cannot $pull and $push the same field in one update,
    // so we do it in two quick steps
    await User.updateOne({ _id: req.user._id }, { $pull: { recentTracks: trackId } })
    await User.updateOne(
      { _id: req.user._id },
      { $push: { recentTracks: { $each: [trackId], $position: 0, $slice: MAX_RECENT } } }
    )
    res.json({ recorded: true })
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ message: 'Could not record play' })
  }
}