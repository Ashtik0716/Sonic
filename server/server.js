import 'dotenv/config' // loads .env into process.env (must run first)
import express from 'express'
import cors from 'cors'
import trackRoutes from './routes/trackRoutes.js'
import albumRoutes from './routes/albumRoutes.js'

const app = express()
const PORT = process.env.PORT || 5000

// Middleware: functions that run on every request before your routes
app.use(cors()) // allow requests from the frontend
app.use(express.json()) // parse JSON request bodies (needed later for login)
// Everything in trackRoutes lives under /api/tracks
app.use('/api/tracks', trackRoutes)
app.use('/api/albums', albumRoutes)

// A route: GET /api/health -> JSON response
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', app: 'Sonic API' })
})

app.listen(PORT, () => {
  console.log(`Sonic API running on http://localhost:${PORT}`)
})