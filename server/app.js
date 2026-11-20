import 'dotenv/config' // loads .env into process.env (must run first)
import express from 'express'
import cors from 'cors'
import trackRoutes from './routes/trackRoutes.js'
import albumRoutes from './routes/albumRoutes.js'
import artistRoutes from './routes/artistRoutes.js'
import authRoutes from './routes/authRoutes.js'
import likeRoutes from './routes/likeRoutes.js'
import playlistRoutes from './routes/playlistRoutes.js'
import historyRoutes from './routes/historyRoutes.js'
import searchRoutes from './routes/searchRoutes.js'
import { authLimiter, apiLimiter } from './middleware/rateLimit.js'
import recommendationRoutes from './routes/recommendationRoutes.js'

const app = express()

// Middleware: functions that run on every request before your routes
// Only the real frontend may call this API from a browser
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' })) // allow requests from the frontend
app.use(express.json()) // parse JSON request bodies (needed later for login)
// Everything in trackRoutes lives under /api/tracks


// Render sits behind a proxy; without this every user looks like the same IP
app.set('trust proxy', 1)
app.use('/api', apiLimiter)
app.use('/api/tracks', trackRoutes)
app.use('/api/albums', albumRoutes)
app.use('/api/artists', artistRoutes)
app.use('/api/auth/login', authLimiter)
app.use('/api/auth/register', authLimiter)
app.use('/api/auth/google', authLimiter)
app.use('/api/auth', authRoutes)
app.use('/api/likes', likeRoutes)
app.use('/api/playlists', playlistRoutes)
app.use('/api/history', historyRoutes)
app.use('/api/search', searchRoutes)
app.use('/api/recommendations', recommendationRoutes)

// A route: GET /api/health -> JSON response
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', app: 'Sonic API' })
})

export default app