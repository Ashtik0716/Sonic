// Turns seconds (e.g. 125.4) into "2:05"
export function formatTime(seconds) {
  // Before metadata loads, duration can be NaN
  if (!Number.isFinite(seconds)) return '0:00'
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  // padStart adds a leading zero: 5 -> "05"
  return `${mins}:${String(secs).padStart(2, '0')}`
}