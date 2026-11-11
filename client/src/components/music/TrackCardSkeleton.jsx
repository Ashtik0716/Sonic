function TrackCardSkeleton() {
  return (
    // animate-pulse is a built-in Tailwind fade-in-and-out animation
    <div className="w-36 shrink-0 animate-pulse rounded-xl bg-surface-800 p-3 md:w-44">
      <div className="aspect-square w-full rounded-lg bg-surface-700" />
      <div className="mt-3 h-4 w-3/4 rounded bg-surface-700" />
      <div className="mt-2 h-3 w-1/2 rounded bg-surface-700" />
    </div>
  )
}

export default TrackCardSkeleton