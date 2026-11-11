import { useSearchParams } from 'react-router-dom'
import { Search as SearchIcon } from 'lucide-react'
import TrackCard from '../components/music/TrackCard'
import TrackCardSkeleton from '../components/music/TrackCardSkeleton'
import { useSearch } from '../hooks/useSearch'

function Search() {
  // The URL holds the search text: /search?q=chill
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get('q') ?? ''
  const { results, loading, error, debouncedQuery } = useSearch(query)

  return (
    <div>
      {/* Phones have no navbar search box, so the page has its own */}
      <div className="relative mt-2 md:hidden">
        <SearchIcon
          size={20}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-300"
        />
        <input
          type="text"
          value={query}
          // replace: true updates the URL without adding a history entry per keystroke
          onChange={(e) => setSearchParams({ q: e.target.value }, { replace: true })}
          placeholder="What do you want to play?"
          className="h-11 w-full rounded-full bg-surface-700 pl-12 pr-4 text-sm outline-none placeholder:text-ink-500 focus:ring-2 focus:ring-brand-500"
        />
      </div>

      <h1 className="mt-6 text-2xl font-extrabold tracking-tight md:text-3xl">
        {debouncedQuery ? `Results for "${debouncedQuery}"` : 'Search'}
      </h1>

      {/* Nothing typed yet */}
      {!query.trim() && (
        <p className="mt-4 text-ink-300">Type a song, artist or genre to find music.</p>
      )}

      {error && <p className="mt-4 text-ink-300">Search failed: {error}</p>}

      {/* Results grid; wraps onto new lines instead of scrolling sideways */}
      <div className="mt-6 flex flex-wrap gap-4">
        {loading
          ? Array.from({ length: 8 }, (_, i) => <TrackCardSkeleton key={i} />)
          : results.map((track) => <TrackCard key={track.id} track={track} list={results} />)}
      </div>

      {/* Searched, finished, found nothing */}
      {debouncedQuery && !loading && !error && results.length === 0 && (
        <p className="mt-4 text-ink-300">No tracks found. Try a different word.</p>
      )}
    </div>
  )
}

export default Search