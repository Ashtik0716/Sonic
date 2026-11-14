import { X } from 'lucide-react'
import { usePlayer } from '../../context/PlayerContext'

function QueuePanel({ onClose }) {
  const { queue, currentIndex, isPlaying, playFromQueue } = usePlayer()
  const current = queue[currentIndex]
  const upNext = queue.slice(currentIndex + 1)

  return (
    <aside className="fixed bottom-24 right-2 top-2 z-30 flex w-80 max-w-[calc(100vw-1rem)] flex-col rounded-xl bg-surface-800 shadow-2xl md:bottom-28">
      <div className="flex items-center justify-between p-4">
        <h2 className="text-lg font-bold">Queue</h2>
        <button onClick={onClose} aria-label="Close queue" className="text-ink-300 hover:text-ink-100">
          <X size={20} />
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-2 pb-4">
        {!current ? (
          <p className="px-2 text-sm text-ink-300">Nothing queued yet.</p>
        ) : (
          <>
            <p className="px-2 pb-1 text-xs font-semibold uppercase tracking-wider text-ink-500">Now playing</p>
            <Row track={current} active playing={isPlaying} />

            <p className="px-2 pb-1 pt-4 text-xs font-semibold uppercase tracking-wider text-ink-500">Next up</p>
            {upNext.length === 0 && <p className="px-2 text-sm text-ink-300">End of queue.</p>}
            {upNext.map((t, i) => (
              <Row key={t.id} track={t} onClick={() => playFromQueue(currentIndex + 1 + i)} />
            ))}
          </>
        )}
      </div>
    </aside>
  )
}

function Row({ track, active = false, playing = false, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left transition hover:bg-surface-700"
    >
      <img src={track.cover} alt="" className="h-10 w-10 rounded object-cover" />
      <span className="min-w-0 flex-1">
        <span className={`block truncate text-sm font-medium ${active ? 'text-brand-400' : ''}`}>{track.title}</span>
        <span className="block truncate text-xs text-ink-300">{track.artist}</span>
      </span>
      {active && playing && <span className="text-xs text-brand-400">▶</span>}
    </button>
  )
}

export default QueuePanel