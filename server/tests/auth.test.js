import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest'
import request from 'supertest'
import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'

process.env.JWT_SECRET = 'test-secret'
process.env.JWT_EXPIRES_IN = '1h'

const { default: app } = await import('../app.js')
const { default: User } = await import('../models/User.js')

let mongo

beforeAll(async () => {
  mongo = await MongoMemoryServer.create()
  await mongoose.connect(mongo.getUri())
})

afterAll(async () => {
  await mongoose.disconnect()
  await mongo.stop()
})

beforeEach(async () => {
  await User.deleteMany({})
})

const creds = { name: 'Test', email: 'test@example.com', password: 'password123' }

describe('auth', () => {
  it('registers a user and returns a token without the hash', async () => {
    const res = await request(app).post('/api/auth/register').send(creds)
    expect(res.status).toBe(201)
    expect(res.body.token).toBeTruthy()
    expect(res.body.user.email).toBe('test@example.com')
    expect(res.body.user.passwordHash).toBeUndefined()
  })

  it('rejects short passwords', async () => {
    const res = await request(app).post('/api/auth/register').send({ ...creds, password: 'short' })
    expect(res.status).toBe(400)
  })

  it('rejects duplicate emails', async () => {
    await request(app).post('/api/auth/register').send(creds)
    const res = await request(app).post('/api/auth/register').send(creds)
    expect(res.status).toBe(409)
  })

  it('logs in with the right password and rejects the wrong one', async () => {
    await request(app).post('/api/auth/register').send(creds)
    const ok = await request(app).post('/api/auth/login').send({ email: creds.email, password: creds.password })
    expect(ok.status).toBe(200)
    const bad = await request(app).post('/api/auth/login').send({ email: creds.email, password: 'wrongpass1' })
    expect(bad.status).toBe(401)
  })

  it('protects /me', async () => {
    expect((await request(app).get('/api/auth/me')).status).toBe(401)
    const { body } = await request(app).post('/api/auth/register').send(creds)
    const res = await request(app).get('/api/auth/me').set('Authorization', `Bearer ${body.token}`)
    expect(res.status).toBe(200)
    expect(res.body.user.name).toBe('Test')
  })
})