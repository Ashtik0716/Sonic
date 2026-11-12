import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

function ProtectedRoute() {
  const { user, loading } = useAuth()
  const location = useLocation()

  // Still checking the saved token: don't redirect yet
  if (loading) return <p className="mt-6 text-ink-300">Loading...</p>

  // Not logged in: go to login, remembering where we were headed
  if (!user) return <Navigate to="/login" state={{ from: location.pathname }} replace />

  // Logged in: render the protected child routes
  return <Outlet />
}

export default ProtectedRoute