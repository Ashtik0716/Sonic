import { Link } from 'react-router-dom'

function AlbumCard({ album }) {
  return (
    <Link
      to={`/album/${album.id}`}
      className="group block w-36 shrink-0 rounded-xl bg-surface-800 p-3 transition hover:bg-surface-700 md:w-44"
    >
      <img
        src={album.cover}
        alt={`${album.title} cover`}
        loading="lazy"
        className="aspect-square w-full rounded-lg object-cover"
      />
      <p className="mt-3 truncate font-semibold">{album.title}</p>
      <p className="truncate text-sm text-ink-300">
        {album.year} · {album.artist}
      </p>
    </Link>
  )
}

export default AlbumCard