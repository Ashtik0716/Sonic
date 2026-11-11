import { Link } from 'react-router-dom'

function ArtistCard({ artist }) {
  return (
    <Link
      to={`/artist/${artist.id}`}
      className="group block w-36 shrink-0 rounded-xl bg-surface-800 p-3 transition hover:bg-surface-700 md:w-44"
    >
      <img
        src={artist.cover}
        alt={artist.name}
        loading="lazy"
        className="aspect-square w-full rounded-full object-cover"
      />
      <p className="mt-3 truncate font-semibold">{artist.name}</p>
      <p className="text-sm text-ink-300">Artist</p>
    </Link>
  )
}

export default ArtistCard