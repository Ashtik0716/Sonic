import { createContext, useContext, useEffect, useState } from 'react'
import { getLikedIds, likeTrack, unlikeTrack } from '../services/api'
import { useAuth } from './AuthContext'

const LikesContext = createContext(null)

export function LikesProvider({ children }) {
  const { user } = useAuth()
  // A Set makes "is this id liked?" instant
  const [likedIds, setLikedIds] = useState(new Set())

  // Load likes when a user logs in; clear them when they log out
  useEffect(() => {
    if (!user) {
      setLikedIds(new Set())
      return
    }
    let cancelled = false
    getLikedIds()
      .then((ids) => !cancelled && setLikedIds(new Set(ids)))
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [user])

  const isLiked = (id) => likedIds.has(String(id))

  // Returns false if the user is logged out, so callers can redirect to login
  async function toggleLike(id) {
    if (!user) return false
    const key = String(id)
    const wasLiked = likedIds.has(key)

    // Optimistic update: change the screen first
    setLikedIds((prev) => {
      const next = new Set(prev)
      if (wasLiked) next.delete(key)
      else next.add(key)
      return next
    })

    try {
      if (wasLiked) await unlikeTrack(key)
      else await likeTrack(key)
    } catch {
      // The server refused: undo the change
      setLikedIds((prev) => {
        const next = new Set(prev)
        if (wasLiked) next.add(key)
        else next.delete(key)
        return next
      })
    }
    return true
  }

  return (
    <LikesContext.Provider value={{ likedIds, isLiked, toggleLike }}>
      {children}
    </LikesContext.Provider>
  )
}

export function useLikes() {
  const context = useContext(LikesContext)
  if (!context) throw new Error('useLikes must be used inside <LikesProvider>')
  return context
}