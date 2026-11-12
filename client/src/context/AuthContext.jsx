import { createContext, useContext, useEffect, useState } from 'react'
import { getMe, loginUser, registerUser } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  // true until we know whether a saved token is still valid
  const [loading, setLoading] = useState(true)

  // On startup: if a token is saved, ask the server who it belongs to
  useEffect(() => {
    if (!localStorage.getItem('sonic-token')) {
      setLoading(false)
      return
    }
    getMe()
      .then((data) => setUser(data.user))
      .catch(() => localStorage.removeItem('sonic-token')) // expired or invalid
      .finally(() => setLoading(false))
  }, [])

  // Save the token and user after a successful login or registration
  function handleAuth(data) {
    localStorage.setItem('sonic-token', data.token)
    setUser(data.user)
  }

  async function login(email, password) {
    handleAuth(await loginUser(email, password))
  }

  async function register(name, email, password) {
    handleAuth(await registerUser(name, email, password))
  }

  function logout() {
    localStorage.removeItem('sonic-token')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used inside <AuthProvider>')
  return context
}