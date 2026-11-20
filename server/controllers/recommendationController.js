import { getRecommendations } from '../services/jamendoService.js'

// GET /api/recommendations
export async function forYou(req, res) {
  const liked = req.user.likedTracks // newest last
  const recent = req.user.recentTracks // newest first

  // Seeds: recent likes plus recent plays, without repeats
  const pool = [...new Set([...liked.slice(-10), ...recent.slice(0, 5)])]
  if (pool.length === 0) return res.json([]) // nothing to learn from yet

  // Pick 3 random seeds so the row changes between visits
  const seeds = pool.sort(() => Math.random() - 0.5).slice(0, 3)

  try {
    // Don't recommend what the user already liked or is seeding from
    res.json(await getRecommendations(seeds, [...liked, ...seeds]))
  } catch (err) {
    console.error(err.message)
    res.status(502).json({ message: 'Could not load recommendations' })
  }
}