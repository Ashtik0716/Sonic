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
- **Autoplay:** when the queue ends, similar songs are fetched and played
- **Lock-screen controls** through the Media Session API
- **Accounts:** register and login with JWT authentication and protected routes
- **Library:** liked songs, playlists and recently played history
- **Resilience:** unplayable tracks are detected, removed from the queue and hidden
- **Responsive and installable:** mobile tab bar, PWA with offline app shell

## Tech stack

| Area | Technology |
|---|---|
| Frontend | React, Vite, Tailwind CSS v4, React Router, Context API |
| Backend | Node.js, Express, Mongoose |
| Database | MongoDB Atlas |
| Auth | JWT, bcrypt |
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
- Playlist queries always filter by owner, so users cannot access each other's data.
- Likes use idempotent `PUT` and `DELETE` routes, and the UI updates optimistically
  with rollback on failure.

## Run locally

Requirements: Node.js 20+, a free [MongoDB Atlas](https://www.mongodb.com/atlas)
cluster and a free [Jamendo API](https://devportal.jamendo.com) client ID.

```bash
git clone https://github.com/YOUR_USERNAME/sonic.git
cd sonic

# Backend
cd server
npm install
cp .env.example .env      # then fill in your own values
npm run dev

# Frontend (in a second terminal)
cd client
npm install
npm run dev
```

Open http://localhost:5173. The Vite dev server proxies `/api` to the backend.

### Environment variables (`server/.env`)

| Variable | Purpose |
|---|---|
| `MONGODB_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Long random string used to sign tokens |
| `JWT_EXPIRES_IN` | Token lifetime, for example `7d` |
| `JAMENDO_CLIENT_ID` | Jamendo API client ID |
| `CLIENT_URL` | Allowed frontend origin for CORS |

In production, the client reads `VITE_API_URL` (the backend address).

## API overview

| Route | Description |
|---|---|
| `POST /api/auth/register`, `POST /api/auth/login` | Create account / log in |
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
- Password hashing and JWT authentication, plus route guards on the client
- Authorisation checks that prevent users from touching each other's data
- Global state with React Context (player, auth, likes, playlists)
- Optimistic updates, debounced search and URL-driven state
- In-memory caching and handling unreliable third-party data
- Building a PWA and deploying across Vercel, Render and Atlas (including CORS)

## Roadmap

- Sign in with Google
- Rate limiting and automated tests
- "Made for you" recommendations based on liked songs
- Drag-and-drop queue reordering
