# Sonic

A full-stack music streaming web app inspired by Spotify. It streams licensed
independent music, supports accounts, playlists and likes, and installs on your
phone as a PWA.

**Live demo:** https://sonic-sandy-omega.vercel.app

> The backend runs on a free tier, so the first load after a quiet period can
> take up to a minute while the server wakes up.

<p>
  <img src="assets/Screenshot From 2026-11-14 21-33-43.png" width="500" alt="Mobile view" />
  <img src="assets/WhatsApp Image 2026-11-14 at 22.12.30.jpeg" width="240" alt="Player with queue" />
</p>

## Features

- **Discovery:** trending tracks, popular albums and featured artists
- **Search:** songs, artists and albums with tabs; the query lives in the URL
- **Player:** queue, shuffle, repeat, seek, volume and persistent playback across pages
- **Autoplay:** when the queue ends, similar songs are found by genre tags and played
- **Smart shuffle:** plays every song once before repeating any
- **Lock-screen controls** through the Media Session API
- **Accounts:** email/password and Sign in with Google (OAuth), JWT sessions, protected routes
- **Library:** liked songs, playlists and recently played history
- **Resilience:** unplayable tracks are detected, removed from the queue and hidden
- **Security:** bcrypt password hashing, rate limiting, strict CORS, ownership checks
- **Responsive and installable:** mobile tab bar, PWA with offline app shell
- **Made for you:** a Home row built from your liked and recent songs, merged from similar-track lookups

## Tech stack

| Area | Technology |
|---|---|
| Frontend | React, Vite, Tailwind CSS v4, React Router, Context API |
| Backend | Node.js, Express, Mongoose |
| Database | MongoDB Atlas |
| Auth | JWT, bcrypt, Google Identity Services |
| Music data | Jamendo API (Creative Commons) |
| PWA | vite-plugin-pwa |
| Hosting | Vercel (client), Render (server) |

## Architecture

```
Browser (React) --> Express API --> Jamendo API
                        |
                        +--> MongoDB (users, likes, playlists, history)
```

- All secrets, including the Jamendo key, stay on the server.
- The API caches Jamendo responses in memory to keep pages fast.
- The server follows a route, controller, service structure.
- Google ID tokens are verified on the server; the app then issues its own JWT,
  so email and Google logins share one session system.
- Playlist queries always filter by owner, so users cannot access each other's data.
- Likes use idempotent `PUT` and `DELETE` routes, and the UI updates optimistically
  with rollback on failure.
- Login and register routes are rate limited per IP.

## Run locally

Requirements: Node.js 20+, a free [MongoDB Atlas](https://www.mongodb.com/atlas)
cluster, a free [Jamendo API](https://devportal.jamendo.com) client ID, and
(optional) a Google OAuth web client ID.

```bash
git clone https://github.com/Ashtik0716/Sonic.git
cd Sonic

# Backend
cd server
npm install
cp .env.example .env      # then fill in your own values
npm run dev

# Frontend (in a second terminal)
cd client
npm install
cp .env.example .env      # optional: Google client ID
npm run dev
```

Open http://localhost:5173. The Vite dev server proxies `/api` to the backend.

### Environment variables

**`server/.env`**

| Variable | Purpose |
|---|---|
| `MONGODB_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Long random string used to sign tokens |
| `JWT_EXPIRES_IN` | Token lifetime, for example `7d` |
| `JAMENDO_CLIENT_ID` | Jamendo API client ID |
| `CLIENT_URL` | Allowed frontend origin for CORS |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID (for token verification) |

**`client/.env`**

| Variable | Purpose |
|---|---|
| `VITE_GOOGLE_CLIENT_ID` | Same Google client ID (public; shows the button) |
| `VITE_API_URL` | Backend address, needed in production only |


## API overview

| Route | Description |
|---|---|
| `POST /api/auth/register`, `/login`, `/google` | Create account, log in, Google sign-in |
| `GET /api/auth/me` | Current user (protected) |
| `GET /api/tracks/trending`, `GET /api/search?q=` | Discovery and search |
| `GET /api/tracks/:id/similar` | Recommendations for autoplay |
| `GET /api/albums/:id`, `GET /api/artists/:id` | Album and artist pages |
| `/api/likes`, `/api/playlists`, `/api/history` | User data (protected) |

## Music licensing

Sonic plays independent music from Jamendo under Creative Commons licences.
It does not stream mainstream catalogue songs, because those require licences
from the labels.

## What I learned

- Designing a REST API with layered structure and input validation
- Password hashing, JWTs, and OAuth token verification with Google
- Authorisation checks that prevent users from touching each other's data
- Global state with React Context (player, auth, likes, playlists)
- Optimistic updates, debounced search and URL-driven state
- In-memory caching, rate limiting and handling unreliable third-party data
- Building a PWA and deploying across Vercel, Render and Atlas (including CORS)

## Roadmap

- Automated tests (Vitest, Supertest)
- Drag-and-drop queue reordering
