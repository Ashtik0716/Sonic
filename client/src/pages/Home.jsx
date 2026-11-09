import { Play } from 'lucide-react'
import Section from '../components/music/Section'
import TrackCard from '../components/music/TrackCard'
import AlbumCard from '../components/music/AlbumCard'
import ArtistCard from '../components/music/ArtistCard'
import { trendingTracks, popularAlbums, featuredArtists } from '../data/mockTracks'

// Plain helper function: picks a greeting from the current hour
function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}

function Home() {
  return (
    <div>
      <h1 className="text-3xl font-extrabold tracking-tight">{getGreeting()}</h1>

      {/* Quick picks: first 6 tracks, sliced from the array */}
      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {trendingTracks.slice(0, 6).map((track) => (
          <div
            key={track.id}
            className="group flex cursor-pointer items-center gap-4 overflow-hidden rounded-lg bg-surface-700/60 pr-4 transition hover:bg-surface-600"
          >
            <img src={track.cover} alt="" className="h-16 w-16 object-cover" />
            <span className="flex-1 truncate font-semibold">{track.title}</span>
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-500 opacity-0 shadow-lg transition group-hover:opacity-100">
              <Play size={18} className="ml-0.5 fill-current" />
            </span>
          </div>
        ))}
      </div>

      <Section title="Trending now">
        {trendingTracks.map((track) => (
          <TrackCard key={track.id} track={track} />
        ))}
      </Section>

      <Section title="Popular albums">
        {popularAlbums.map((album) => (
          <AlbumCard key={album.id} album={album} />
        ))}
      </Section>

      <Section title="Featured artists">
        {featuredArtists.map((artist) => (
          <ArtistCard key={artist.id} artist={artist} />
        ))}
      </Section>
    </div>
  )
}

export default Home