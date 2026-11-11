// Artists get round images: a common design convention
function ArtistCard({ artist, onPlay }) {
    return (
        <div
            onClick={onPlay}
            className="group w-36 shrink-0 cursor-pointer rounded-xl bg-surface-800 p-3 transition hover:bg-surface-700 md:w-44"
        >
            <img
                src={artist.cover}
                alt={artist.name}
                className="aspect-square w-full rounded-full object-cover"
            />
            <p className="mt-3 truncate font-semibold">{artist.name}</p>
            <p className="text-sm text-ink-300">Artist</p>
        </div>
    )
}

export default ArtistCard