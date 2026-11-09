import { useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Search, User } from 'lucide-react'

function Navbar() {
  // useNavigate returns a function we can call to change pages
  const navigate = useNavigate()

  return (
    // sticky: stays at the top while the page scrolls underneath
    <header className="sticky top-0 z-10 flex items-center gap-3 bg-surface-900/80 px-6 py-4 backdrop-blur-md">
      {/* Back / forward: navigate(-1) and navigate(1) move through history */}
      <button
        onClick={() => navigate(-1)}
        aria-label="Go back"
        className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-950/70 text-ink-100 transition hover:bg-surface-700"
      >
        <ChevronLeft size={22} />
      </button>
      <button
        onClick={() => navigate(1)}
        aria-label="Go forward"
        className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-950/70 text-ink-100 transition hover:bg-surface-700"
      >
        <ChevronRight size={22} />
      </button>

      {/* Search box: clicking it jumps to the Search page */}
      <div className="relative ml-2 max-w-md flex-1">
        <Search
          size={20}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-300"
        />
        <input
          type="text"
          placeholder="What do you want to play?"
          onFocus={() => navigate('/search')}
          className="h-11 w-full rounded-full bg-surface-700 pl-12 pr-4 text-sm text-ink-100 placeholder:text-ink-500 outline-none transition focus:ring-2 focus:ring-brand-500"
        />
      </div>

      {/* Profile button: placeholder until authentication exists */}
      <button
        aria-label="Profile"
        className="ml-auto flex h-10 w-10 items-center justify-center rounded-full bg-brand-500 text-white transition hover:scale-105 hover:bg-brand-600"
      >
        <User size={20} />
      </button>
    </header>
  )
}

export default Navbar