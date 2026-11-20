import app from './app.js'
import { connectDB } from './config/db.js'

const PORT = process.env.PORT || 5000

connectDB()
  .then(() => app.listen(PORT, () => console.log(`Sonic API running on http://localhost:${PORT}`)))
  .catch((err) => {
    console.error('Database connection failed:', err.message)
    process.exit(1)
  })