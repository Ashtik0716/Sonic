import jwt from 'jsonwebtoken'
import User from '../models/User.js'

export async function protect(req, res, next) {
  const header = req.headers.authorization ?? ''
  // Expect: "Bearer <token>"
  const [scheme, token] = header.split(' ')

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ message: 'Not authenticated' })
  }

  try {
    // Throws if the token is forged, malformed or expired
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(payload.id)
    // Token valid but user was deleted
    if (!user) return res.status(401).json({ message: 'Not authenticated' })

    req.user = user // later handlers can read req.user
    next() // continue to the route handler
  } catch {
    res.status(401).json({ message: 'Invalid or expired token' })
  }
}