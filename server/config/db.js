import mongoose from 'mongoose'

// Connect once at startup; every model then uses this connection
export async function connectDB() {
  const uri = process.env.MONGODB_URI
  if (!uri) {
    throw new Error('Missing MONGODB_URI in server/.env')
  }
  await mongoose.connect(uri)
  console.log('MongoDB connected')
}