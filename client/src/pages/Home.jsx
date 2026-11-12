import { Play } from 'lucide-react'
import Section from '../components/music/Section'
import TrackCard from '../components/music/TrackCard'
import TrackCardSkeleton from '../components/music/TrackCardSkeleton'
import AlbumCard from '../components/music/AlbumCard'
import ArtistCard from '../components/music/ArtistCard'
import { usePlayer } from '../context/PlayerContext'
import { useTrending } from '../hooks/useTrending'
import { usePopularAlbums } from '../hooks/usePopularAlbums'
import { usePopularArtists } from '../hooks/usePopularArtists'
import { useHistory } from '../hooks/useHistory'

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}

function Home() {
  const { playTrack } = usePlayer()
  const { tracks, loading, error, retry } = useTrending(20)
  const { albums, loading: albumsLoading } = usePopularAlbums()
  const { artists, loading: artistsLoading } = usePopularArtists()
  const { tracks: recent } = useHistory()

  // First six real tracks become the quick picks
  const quickPicks = tracks.slice(0, 6)

  return (
    <div>
      <h1 className="text-2xl font-extrabold tracking-tight md:text-3xl">{getGreeting()}</h1>

      {/* Error state: message plus a way to try again */}
      {error && (
        <div className="mt-6 rounded-lg bg-surface-800 p-4">
          <p className="text-ink-300">Could not load music: {error}</p>
          <button
            onClick={retry}
            className="mt-3 rounded-full bg-brand-500 px-5 py-2 text-sm font-semibold transition hover:bg-brand-600"
          >
            Retry
          </button>
        </div>
      )}

      {/* Quick picks: only shown once we have tracks */}
      {quickPicks.length > 0 && (
        <div className="mt-4 grid grid-cols-2 gap-2 md:mt-6 md:gap-3 lg:grid-cols-3">
          {quickPicks.map((track) => (
            <div
              key={track.id}
              onClick={() => playTrack(track, quickPicks)}
              className="group flex cursor-pointer items-center gap-3 overflow-hidden rounded-lg bg-surface-700/60 pr-2 transition hover:bg-surface-600 md:gap-4 md:pr-4"
            >
              <img src={track.cover} alt="" className="h-14 w-14 shrink-0 object-cover md:h-16 md:w-16" />
              <span className="line-clamp-2 flex-1 text-sm font-semibold md:text-base">{track.title}</span>
              <span className="hidden h-10 w-10 items-center justify-center rounded-full bg-brand-500 opacity-0 shadow-lg transition group-hover:opacity-100 md:flex">
                <Play size={18} className="ml-0.5 fill-current" />
              </span>
            </div>
          ))}
        </div>
      )}
      {recent.length > 0 && (
        <Section title="Recently played">
          {recent.slice(0, 10).map((track) => (
            <TrackCard key={track.id} track={track} list={recent} />
          ))}
        </Section>
      )}

      <Section title="Trending now">
        {loading
          ?
          Array.from({ length: 8 }, (_, i) => <TrackCardSkeleton key={i} />)
          : tracks.map((track) => <TrackCard key={track.id} track={track} list={tracks} />)}
      </Section>

      <Section title="Popular albums">
        {albumsLoading
          ? Array.from({ length: 6 }, (_, i) => <TrackCardSkeleton key={i} />)
          : albums.map((album) => <AlbumCard key={album.id} album={album} />)}
      </Section>

      <Section title="Featured artists">
        {artistsLoading
          ? Array.from({ length: 6 }, (_, i) => <TrackCardSkeleton key={i} />)
          : artists.map((artist) => <ArtistCard key={artist.id} artist={artist} />)}
      </Section>
    </div>
  )
}

export default Home