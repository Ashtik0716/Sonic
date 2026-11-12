import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'


// Create a signed token containing the user's id
function signToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  })
}

// Only these fields ever leave the server (never the hash)
function publicUser(user) {
  return { id: user._id, name: user.name, email: user.email }
}

// POST /api/auth/register
export async function register(req, res) {
  const { name, email, password } = req.body

  // Validate input: never trust the client
  if (!name?.trim() || !email?.trim() || !password) {
    return res.status(400).json({ message: 'Name, email and password are required' })
  }
  if (password.length < 8) {
    return res.status(400).json({ message: 'Password must be at least 8 characters' })
  }

  try {
    const existing = await User.findOne({ email: email.toLowerCase().trim() })
    if (existing) {
      return res.status(409).json({ message: 'An account with this email already exists' })
    }

    // 10 = cost factor: how much work the hash takes
    const passwordHash = await bcrypt.hash(password, 10)
    const user = await User.create({ name, email, passwordHash })

    res.status(201).json({ token: signToken(user._id), user: publicUser(user) })
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ message: 'Registration failed' })
  }
}

// POST /api/auth/login
export async function login(req, res) {
  const { email, password } = req.body
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' })
  }

  try {
    // passwordHash is select:false, so we must ask for it explicitly
    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+passwordHash')

    // Same message for "no such user" and "wrong password", so attackers can't
    // discover which emails are registered
    const valid = user && (await bcrypt.compare(password, user.passwordHash))
    if (!valid) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    res.json({ token: signToken(user._id), user: publicUser(user) })
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ message: 'Login failed' })
  }
}

// GET /api/auth/me  (protected): returns the logged-in user
export function me(req, res) {
  res.json({ user: publicUser(req.user) })
}