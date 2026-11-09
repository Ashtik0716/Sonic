import { Play } from 'lucide-react'

// Props: a track object ({ title, artist, cover })
function TrackCard({ track }) {
  return (
    // "group" lets child elements react when the whole card is hovered
    <div className="group w-44 shrink-0 cursor-pointer rounded-xl bg-surface-800 p-3 transition hover:bg-surface-700">
      <div className="relative">
        <img
          src={track.cover}
          alt={`${track.title} cover`}
          className="aspect-square w-full rounded-lg object-cover"
        />
        {/* Play button: invisible until the card is hovered */}
        <button
          aria-label={`Play ${track.title}`}
          className="absolute bottom-2 right-2 flex h-11 w-11 translate-y-2 items-center justify-center rounded-full bg-brand-500 text-white opacity-0 shadow-lg transition group-hover:translate-y-0 group-hover:opacity-100 hover:scale-105"
        >
          <Play size={20} className="ml-0.5 fill-current" />
        </button>
      </div>
      <p className="mt-3 truncate font-semibold">{track.title}</p>
      <p className="truncate text-sm text-ink-300">{track.artist}</p>
    </div>
  )
}

export default TrackCard