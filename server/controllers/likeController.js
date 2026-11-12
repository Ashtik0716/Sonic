import User from '../models/User.js'

// Jamendo ids are numeric strings; reject anything else
const isValidId = (id) => /^\d+$/.test(id)

// GET /api/likes  -> ["123", "456"]
export function getLikes(req, res) {
  res.json(req.user.likedTracks)
}

// PUT /api/likes/:trackId
export async function like(req, res) {
  const { trackId } = req.params
  if (!isValidId(trackId)) {
    return res.status(400).json({ message: 'Invalid track id' })
  }
  try {
    // $addToSet adds the id only if it is not already there
    await User.updateOne({ _id: req.user._id }, { $addToSet: { likedTracks: trackId } })
    res.json({ trackId, liked: true })
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ message: 'Could not like track' })
  }
}

// DELETE /api/likes/:trackId
export async function unlike(req, res) {
  const { trackId } = req.params
  if (!isValidId(trackId)) {
    return res.status(400).json({ message: 'Invalid track id' })
  }
  try {
    // $pull removes every matching value from the array
    await User.updateOne({ _id: req.user._id }, { $pull: { likedTracks: trackId } })
    res.json({ trackId, liked: false })
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ message: 'Could not unlike track' })
  }
}