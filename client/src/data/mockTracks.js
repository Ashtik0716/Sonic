// Mock data: replaced by real API data in Phase 6.
// picsum.photos gives a stable placeholder image for each seed.
const cover = (seed) => `https://picsum.photos/seed/${seed}/400`
// Free sample songs for testing. Replaced by Jamendo tracks in Phase 6.
const audio = (n) => `https://www.soundhelix.com/examples/mp3/SoundHelix-Song-${n}.mp3`

export const nowPlaying = {
  id: 1,
  title: 'Midnight Drive',
  artist: 'Neon Atlas',
  cover: cover('sonic1'),
  duration: '3:42',
}

export const trendingTracks = [
  { id: 1, title: 'Midnight Drive', artist: 'Neon Atlas', cover: cover('sonic1'), audioUrl: audio(1) },
  { id: 2, title: 'Golden Hour', artist: 'Luna Park', cover: cover('sonic2'), audioUrl: audio(2) },
  { id: 3, title: 'Monsoon Nights', artist: 'Aarav Sen', cover: cover('sonic3'), audioUrl: audio(3) },
  { id: 4, title: 'Paper Planes', artist: 'The Hollow Keys', cover: cover('sonic4'), audioUrl: audio(4) },
  { id: 5, title: 'Echoes', artist: 'Mira Vale', cover: cover('sonic5'), audioUrl: audio(5) },
  { id: 6, title: 'Neon Rain', artist: 'Kairo', cover: cover('sonic6'), audioUrl: audio(6) },
  { id: 7, title: 'Slow Burn', artist: 'Ria & The Wolves', cover: cover('sonic7'), audioUrl: audio(7) },
  { id: 8, title: 'Skyline', artist: 'Neon Atlas', cover: cover('sonic8'), audioUrl: audio(8) },
]

export const popularAlbums = [
  { id: 1, title: 'After Hours Radio', artist: 'Neon Atlas', year: 2024, cover: cover('album1') },
  { id: 2, title: 'Chai & Vinyl', artist: 'Aarav Sen', year: 2023, cover: cover('album2') },
  { id: 3, title: 'Glass Gardens', artist: 'Mira Vale', year: 2025, cover: cover('album3') },
  { id: 4, title: 'Wolves at Dawn', artist: 'Ria & The Wolves', year: 2022, cover: cover('album4') },
  { id: 5, title: 'Static Hearts', artist: 'Kairo', year: 2024, cover: cover('album5') },
  { id: 6, title: 'Soft Machines', artist: 'Luna Park', year: 2023, cover: cover('album6') },
]

export const featuredArtists = [
  { id: 1, name: 'Neon Atlas', cover: cover('artist1') },
  { id: 2, name: 'Aarav Sen', cover: cover('artist2') },
  { id: 3, name: 'Mira Vale', cover: cover('artist3') },
  { id: 4, name: 'Luna Park', cover: cover('artist4') },
  { id: 5, name: 'Kairo', cover: cover('artist5') },
  { id: 6, name: 'The Hollow Keys', cover: cover('artist6') },
]