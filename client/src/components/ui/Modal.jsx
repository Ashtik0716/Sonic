import { useEffect } from 'react'

function Modal({ title, onClose, children }) {
  // Close on Escape; remove the listener when the modal goes away
  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    // Overlay: clicking it closes the modal
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
    >
      {/* Card: stopPropagation so clicks inside don't reach the overlay */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm rounded-2xl bg-surface-800 p-6 shadow-2xl"
      >
        <h2 className="text-xl font-bold tracking-tight">{title}</h2>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  )
}

export default Modal