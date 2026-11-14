import { createContext, useCallback, useContext, useState } from 'react'

const ToastContext = createContext(null)

let nextId = 1 // simple unique id for each toast

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  // type: 'success' | 'error'
  const toast = useCallback((message, type = 'success') => {
    const id = nextId++
    setToasts((prev) => [...prev, { id, message, type }])
    // Remove it after 3 seconds
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3000)
  }, [])

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {/* Viewport: above the player and mobile tab bar, never blocks clicks except on the toast */}
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-40 z-50 flex flex-col items-center gap-2 px-4 md:bottom-28"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto rounded-full px-5 py-2 text-sm font-semibold shadow-xl ${
              t.type === 'error' ? 'bg-red-500 text-white' : 'bg-white text-surface-950'
            }`}
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) throw new Error('useToast must be used inside <ToastProvider>')
  return context
}