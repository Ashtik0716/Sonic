import { NavLink } from 'react-router-dom'

// Props: to = URL path, icon = a Lucide icon component, label = text
function SidebarLink({ to, icon: Icon, label }) {
  return (
    <NavLink
      to={to}
      // "end" makes "/" match only the exact home page, not every URL
      end
      // NavLink gives us isActive so we can style the current page
      className={({ isActive }) =>
        `flex items-center gap-4 rounded-lg px-3 py-2 font-semibold transition-colors ${
          isActive
            ? 'text-ink-100'
            : 'text-ink-300 hover:text-ink-100'
        }`
      }
    >
      {({ isActive }) => (
        <>
          {/* Active icon turns violet */}
          <Icon size={24} className={isActive ? 'text-brand-400' : ''} />
          <span>{label}</span>
        </>
      )}
    </NavLink>
  )
}

export default SidebarLink