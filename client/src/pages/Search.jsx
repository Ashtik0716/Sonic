import { useSearchParams } from 'react-router-dom'
import { Search as SearchIcon } from 'lucide-react'
import TrackCard from '../components/music/TrackCard'
import TrackCardSkeleton from '../components/music/TrackCardSkeleton'
import AlbumCard from '../components/music/AlbumCard'
import ArtistCard from '../components/music/ArtistCard'
import Section from '../components/music/Section'
import { useSearch } from '../hooks/useSearch'

const TABS = [
  { id: 'all', label: 'All' },
  { id: 'songs', label: 'Songs' },
  { id: 'artists', label: 'Artists' },
  { id: 'albums', label: 'Albums' },
]

function Search() {
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get('q') ?? ''
  // Unknown tab values fall back to "all"
  const tabParam = searchParams.get('tab')
  const tab = TABS.some((t) => t.id === tabParam) ? tabParam : 'all'

  const { results, loading, error, debouncedQuery } = useSearch(query)
  const { tracks, artists, albums } = results

  // Update one param without losing the other
  function update(changes) {
    const next = new URLSearchParams(searchParams)
    Object.entries(changes).forEach(([k, v]) => (v ? next.set(k, v) : next.delete(k)))
    setSearchParams(next, { replace: true })
  }

  const show = (section) => tab === 'all' || tab === section
  const nothingFound =
    debouncedQuery && !loading && !error &&
    tracks.length + artists.length + albums.length === 0

  return (
    <div>
      {/* Phones have no navbar search box */}
      <div className="relative mt-2 md:hidden">
        <SearchIcon size={20} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-300" />
        <input
          type="text"
          value={query}
          onChange={(e) => update({ q: e.target.value })}
          placeholder="What do you want to play?"
          className="h-11 w-full rounded-full bg-surface-700 pl-12 pr-4 text-sm outline-none placeholder:text-ink-500 focus:ring-2 focus:ring-brand-500"
        />
      </div>

      <h1 className="mt-6 text-2xl font-extrabold tracking-tight md:text-3xl">
        {debouncedQuery ? `Results for "${debouncedQuery}"` : 'Search'}
      </h1>

      {!query.trim() && <p className="mt-4 text-ink-300">Type a song, artist or album to find music.</p>}
      {error && <p className="mt-4 text-ink-300">Search failed: {error}</p>}

      {query.trim() && (
        <div className="mt-4 flex gap-2 overflow-x-auto">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => update({ tab: t.id === 'all' ? '' : t.id })}
              className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-semibold transition ${
                tab === t.id ? 'bg-brand-500 text-white' : 'bg-surface-700 text-ink-300 hover:text-ink-100'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      )}

      {loading && (
        <div className="mt-6 flex flex-wrap gap-4">
          {Array.from({ length: 8 }, (_, i) => <TrackCardSkeleton key={i} />)}
        </div>
      )}

      {!loading && (
        <>
          {show('artists') && artists.length > 0 && (
            <Section title="Artists">
              {artists.map((a) => <ArtistCard key={a.id} artist={a} />)}
            </Section>
          )}
          {show('albums') && albums.length > 0 && (
            <Section title="Albums">
              {albums.map((a) => <AlbumCard key={a.id} album={a} />)}
            </Section>
          )}
          {show('songs') && tracks.length > 0 && (
            <section className="mt-8">
              <h2 className="mb-4 text-2xl font-bold tracking-tight">Songs</h2>
              <div className="flex flex-wrap gap-4">
                {tracks.map((t) => <TrackCard key={t.id} track={t} list={tracks} />)}
              </div>
            </section>
          )}
        </>
      )}

      {nothingFound && <p className="mt-6 text-ink-300">No results found. Try a different word.</p>}
    </div>
  )
}

export default Search