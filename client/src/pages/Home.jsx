import { Play } from 'lucide-react'
import Section from '../components/music/Section'
import TrackCard from '../components/music/TrackCard'
import AlbumCard from '../components/music/AlbumCard'
import ArtistCard from '../components/music/ArtistCard'
import { trendingTracks, popularAlbums, featuredArtists } from '../data/mockTracks'
import { usePlayer } from '../context/PlayerContext'

// Plain helper function: picks a greeting from the current hour
function getGreeting() {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
}

function Home() {
    const { playTrack } = usePlayer()
    const quickPicks = trendingTracks.slice(0, 6)
    return (
        <div>
            <h1 className="text-3xl font-extrabold tracking-tight">{getGreeting()}</h1>

            {/* Quick picks: first 6 tracks, sliced from the array */}
            <div className="mt-4 grid grid-cols-2 gap-2 md:mt-6 md:gap-3 lg:grid-cols-3">
                {quickPicks.map((track) => (
                    <div
                        key={track.id}
                        onClick={() => playTrack(track)}
                        className="group flex cursor-pointer items-center gap-3 ..."
                    >
                        <img src={track.cover} alt="" className="h-14 w-14 shrink-0 object-cover md:h-16 md:w-16" />
                        {/* line-clamp-2 allows two lines before cutting off with "..." */}
                        <span className="line-clamp-2 flex-1 text-sm font-semibold md:text-base">{track.title}</span>
                        <span className="hidden h-10 w-10 items-center justify-center rounded-full bg-brand-500 opacity-0 shadow-lg transition group-hover:opacity-100 md:flex">
                            <Play size={18} className="ml-0.5 fill-current" />
                        </span>
                    </div>
                ))}
            </div>

            <Section title="Trending now">
                {trendingTracks.map((track) => (
                    <TrackCard key={track.id} track={track} list={trendingTracks} />
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