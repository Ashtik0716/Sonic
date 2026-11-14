import { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react'

const ModalContext = createContext(null)

export function ModalProvider({ children }) {
  // modal = null, or { type, title, message, placeholder, initial, confirmLabel, danger, resolve }
  const [modal, setModal] = useState(null)

  const prompt = useCallback(
    (options) => new Promise((resolve) => setModal({ type: 'prompt', ...options, resolve })),
    []
  )

  const confirm = useCallback(
    (options) => new Promise((resolve) => setModal({ type: 'confirm', ...options, resolve })),
    []
  )

  // Close the modal and hand the answer back to whoever awaited it
  const close = (value) => {
    modal.resolve(value)
    setModal(null)
  }

  return (
    <ModalContext.Provider value={{ prompt, confirm }}>
      {children}
      {modal && <ModalView modal={modal} onClose={close} />}
    </ModalContext.Provider>
  )
}

function ModalView({ modal, onClose }) {
  const [value, setValue] = useState(modal.initial || '')
  const inputRef = useRef(null)
  const isPrompt = modal.type === 'prompt'

  // Autofocus the input, and close on Escape
  useEffect(() => {
    if (isPrompt) inputRef.current?.select()
    const onKey = (e) => {
      if (e.key === 'Escape') onClose(isPrompt ? null : false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const submit = () => {
    if (isPrompt) {
      const trimmed = value.trim()
      if (trimmed) onClose(trimmed)
    } else {
      onClose(true)
    }
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4"
      onClick={() => onClose(isPrompt ? null : false)}
    >
      <div
        className="w-full max-w-sm rounded-xl bg-surface-800 p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-extrabold">{modal.title}</h2>
        {modal.message && <p className="mt-2 text-ink-300">{modal.message}</p>}

        {isPrompt && (
          <input
            ref={inputRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && submit()}
            placeholder={modal.placeholder}
            maxLength={60}
            className="mt-4 w-full rounded-md bg-surface-700 px-3 py-2 outline-none focus:ring-2 focus:ring-brand-500"
          />
        )}

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={() => onClose(isPrompt ? null : false)}
            className="rounded-full px-5 py-2 text-sm font-semibold text-ink-300 transition hover:text-white"
          >
            Cancel
          </button>
          <button
            onClick={submit}
            disabled={isPrompt && !value.trim()}
            className={`rounded-full px-5 py-2 text-sm font-semibold transition disabled:opacity-50 ${
              modal.danger ? 'bg-red-600 hover:bg-red-700' : 'bg-brand-500 hover:bg-brand-600'
            }`}
          >
            {modal.confirmLabel || 'OK'}
          </button>
        </div>
      </div>
    </div>
  )
}

export const useModal = () => useContext(ModalContext)