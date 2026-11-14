import { Heart } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useLikes } from '../../context/LikesContext'
import { useToast } from '../../context/ToastContext'

function LikeButton({ trackId, size = 18, className = '' }) {
  const { isLiked, toggleLike } = useLikes()
  const navigate = useNavigate()
  const liked = isLiked(trackId)
  const { toast } = useToast()
  const wasLiked = liked
  

  async function handleClick(e) {
    e.stopPropagation() // don't trigger a parent's click (e.g. a row that plays the song)
    const ok = await toggleLike(trackId)
if (!ok) navigate('/login')
else toast(wasLiked ? 'Removed from Liked Songs' : 'Added to Liked Songs')
  }

  return (
    <button
      onClick={handleClick}
      aria-label={liked ? 'Remove from liked songs' : 'Add to liked songs'}
      className={`transition hover:scale-110 ${className}`}
    >
      <Heart size={size} className={liked ? 'fill-brand-400 text-brand-400' : 'text-ink-300 hover:text-ink-100'} />
    </button>
  )
}

export default LikeButton