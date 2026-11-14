import 'dotenv/config' // loads .env into process.env (must run first)
import express from 'express'
import cors from 'cors'
import trackRoutes from './routes/trackRoutes.js'
import albumRoutes from './routes/albumRoutes.js'
import artistRoutes from './routes/artistRoutes.js'
import { connectDB } from './config/db.js'
import authRoutes from './routes/authRoutes.js'
import likeRoutes from './routes/likeRoutes.js'
import playlistRoutes from './routes/playlistRoutes.js'
import historyRoutes from './routes/historyRoutes.js'
import searchRoutes from './routes/searchRoutes.js'

const app = express()
const PORT = process.env.PORT || 5000

// Middleware: functions that run on every request before your routes
// Only the real frontend may call this API from a browser
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' })) // allow requests from the frontend
app.use(express.json()) // parse JSON request bodies (needed later for login)
// Everything in trackRoutes lives under /api/tracks
app.use('/api/tracks', trackRoutes)
app.use('/api/albums', albumRoutes)
app.use('/api/artists', artistRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/likes', likeRoutes)
app.use('/api/playlists', playlistRoutes)
app.use('/api/history', historyRoutes)
app.use('/api/search', searchRoutes)

// A route: GET /api/health -> JSON response
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', app: 'Sonic API' })
})

// Connect to the database first; only start listening if it works
connectDB()
  .then(() => {
    import('./models/User.js').then(async ({ default: User }) => {
      const count = await User.countDocuments()
      console.log('Users in database:', count)
    })
    app.listen(PORT, () => {
      console.log(`Sonic API running on http://localhost:${PORT}`)
    })
  })
  .catch((err) => {
    console.error('Database connection failed:', err.message)
    process.exit(1)
  })