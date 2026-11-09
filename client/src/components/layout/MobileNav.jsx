import { NavLink } from 'react-router-dom'
import { Home, Search, Library } from 'lucide-react'

// Same data-driven idea as the Sidebar
const tabs = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/search', icon: Search, label: 'Search' },
  { to: '/library', icon: Library, label: 'Library' },
]

function MobileNav() {
  return (
    // md:hidden = only visible on phones and small tablets
    <nav className="flex shrink-0 items-center justify-around bg-surface-950 md:hidden">
      {tabs.map(({ to, icon: Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          // Only the Home tab needs exact matching; Library stays lit on /library/liked too
          end={to === '/'}
          // min-h-14 (56px) keeps the whole tab comfortably tappable
          className={({ isActive }) =>
            `flex min-h-14 flex-1 flex-col items-center justify-center gap-1 text-xs font-medium transition-colors ${
              isActive ? 'text-brand-400' : 'text-ink-300'
            }`
          }
        >
          <Icon size={24} />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  )
}

export default MobileNav