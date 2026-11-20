import { X, GripVertical } from 'lucide-react'
import {
  DndContext, closestCenter, PointerSensor, TouchSensor, KeyboardSensor, useSensor, useSensors,
} from '@dnd-kit/core'
import {
  SortableContext, verticalListSortingStrategy, useSortable, sortableKeyboardCoordinates,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { usePlayer } from '../../context/PlayerContext'

function SortableRow({ track, onPlay }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: track.id })

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`flex items-center gap-1 rounded-lg px-1 ${isDragging ? 'z-10 bg-surface-600 shadow-lg' : 'hover:bg-surface-700'}`}
    >
      {/* Only the handle starts a drag, so tapping the row still plays it */}
      <button
        {...attributes}
        {...listeners}
        aria-label={`Reorder ${track.title}`}
        className="touch-none p-2 text-ink-500 hover:text-ink-100"
      >
        <GripVertical size={16} />
      </button>
      <button onClick={onPlay} className="flex min-w-0 flex-1 items-center gap-3 py-2 text-left">
        <img src={track.cover || undefined} alt="" className="h-10 w-10 rounded object-cover" />
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-medium">{track.title}</span>
          <span className="block truncate text-xs text-ink-300">{track.artist}</span>
          {track.recommended && <span className="text-xs text-brand-400">Recommended</span>}
        </span>
      </button>
    </div>
  )
}

function QueuePanel({ onClose }) {
  const { queue, currentIndex, isPlaying, playFromQueue, moveInQueue } = usePlayer()
  const current = queue[currentIndex]
  const upNext = queue.slice(currentIndex + 1)

  // Distance and delay thresholds stop accidental drags while scrolling on touch screens
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  function handleDragEnd({ active, over }) {
  if (!over || active.id === over.id) return
  moveInQueue(active.id, over.id)
}

  return (
    <aside className="fixed bottom-24 right-2 top-2 z-30 flex w-80 max-w-[calc(100vw-1rem)] animate-slide-in flex-col rounded-xl bg-surface-800 shadow-2xl md:bottom-28">
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
            <div className="flex items-center gap-3 rounded-lg px-2 py-2">
              <img src={current.cover || undefined} alt="" className="h-10 w-10 rounded object-cover" />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium text-brand-400">{current.title}</span>
                <span className="block truncate text-xs text-ink-300">{current.artist}</span>
              </span>
              {isPlaying && <span className="text-xs text-brand-400">▶</span>}
            </div>

            <p className="px-2 pb-1 pt-4 text-xs font-semibold uppercase tracking-wider text-ink-500">Next up</p>
            {upNext.length === 0 && <p className="px-2 text-sm text-ink-300">End of queue.</p>}

            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={upNext.map((t) => t.id)} strategy={verticalListSortingStrategy}>
                {upNext.map((t, i) => (
                  <SortableRow key={t.id} track={t} onPlay={() => playFromQueue(currentIndex + 1 + i)} />
                ))}
              </SortableContext>
            </DndContext>
          </>
        )}
      </div>
    </aside>
  )
}

export default QueuePanel