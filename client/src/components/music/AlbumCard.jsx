// Same idea as TrackCard, but shows the year under the title
function AlbumCard({ album, onPlay }) {
    return (
        <div
            onClick={onPlay}
            className="group w-36 shrink-0 cursor-pointer rounded-xl bg-surface-800 p-3 transition hover:bg-surface-700 md:w-44"
        >
            <img
                src={album.cover}
                alt={`${album.title} cover`}
                className="aspect-square w-full rounded-lg object-cover"
            />
            <p className="mt-3 truncate font-semibold">{album.title}</p>
            <p className="truncate text-sm text-ink-300">
                {album.year} · {album.artist}
            </p>
        </div>
    )
}

export default AlbumCard