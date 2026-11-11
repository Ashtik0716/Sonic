import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Search, User } from 'lucide-react'

function Navbar() {
    // useNavigate returns a function we can call to change pages
    const navigate = useNavigate()
    const location = useLocation()
    const [searchParams] = useSearchParams()

    return (
        // sticky: stays at the top while the page scrolls underneath
        <header className="sticky top-0 z-10 flex items-center gap-3 bg-transparent px-4 py-4 backdrop-blur-md md:px-6">

            {/* Logo: phones only, since the sidebar shows it on desktop */}
            <div className="flex items-center gap-2 md:hidden">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500 font-extrabold">
                    S
                </div>
                <span className="text-xl font-extrabold tracking-tight">Sonic</span>
            </div>

            {/* Back / forward: navigate(-1) and navigate(1) move through history */}
            <button
                onClick={() => navigate(-1)}
                aria-label="Go back"
                className="hidden h-10 w-10 items-center justify-center rounded-full bg-surface-950/70 text-ink-100 transition hover:bg-surface-700 md:flex"
            >
                <ChevronLeft size={22} />
            </button>
            <button
                onClick={() => navigate(1)}
                aria-label="Go forward"
                className="hidden h-10 w-10 items-center justify-center rounded-full bg-surface-950/70 text-ink-100 transition hover:bg-surface-700 md:flex"
            >
                <ChevronRight size={22} />
            </button>

            {/* Search box: clicking it jumps to the Search page */}
            <div className="relative ml-2 hidden max-w-md flex-1 md:block">
                <Search
                    size={20}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-300"
                />
                <input
                    type="text"
                    placeholder="What do you want to play?"
                    value={searchParams.get('q') ?? ''}
                    // Typing sends you to /search?q=...; on the Search page it just updates the URL
                    onChange={(e) =>
                        navigate(`/search?q=${encodeURIComponent(e.target.value)}`, {
                            replace: location.pathname === '/search',
                        })
                    }
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