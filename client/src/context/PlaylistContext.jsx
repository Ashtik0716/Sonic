import { createContext, useContext, useEffect, useState } from 'react'
import { useAuth } from './AuthContext'
import { getPlaylists, createPlaylist } from '../services/api'

const PlaylistsContext = createContext(null)

export function PlaylistsProvider({ children }) {
  const { user } = useAuth()
  const [playlists, setPlaylists] = useState([])

  // Load on login, clear on logout
  useEffect(() => {
    if (!user) {
      setPlaylists([])
      return
    }
    let cancelled = false
    getPlaylists()
      .then((data) => !cancelled && setPlaylists(data))
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [user])

  async function create(name) {
    const playlist = await createPlaylist(name)
    setPlaylists((prev) => [playlist, ...prev])
    return playlist
  }

  // Keep the sidebar in sync after edits made on the playlist page
  function updateLocal(id, changes) {
    setPlaylists((prev) => prev.map((p) => (p.id === id ? { ...p, ...changes } : p)))
  }

  function removeLocal(id) {
    setPlaylists((prev) => prev.filter((p) => p.id !== id))
  }

  return (
    <PlaylistsContext.Provider value={{ playlists, create, updateLocal, removeLocal }}>
      {children}
    </PlaylistsContext.Provider>
  )
}

export function usePlaylists() {
  const context = useContext(PlaylistsContext)
  if (!context) throw new Error('usePlaylists must be used inside <PlaylistsProvider>')
  return context
}