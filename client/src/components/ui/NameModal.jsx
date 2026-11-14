import { useState } from 'react'
import Modal from './Modal'

function NameModal({ title, initialValue = '', submitLabel = 'Save', onSubmit, onClose }) {
  const [name, setName] = useState(initialValue)
  const [error, setError] = useState(null)
  const [busy, setBusy] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) return setError('Please enter a name')
    setBusy(true)
    try {
      await onSubmit(trimmed)
      onClose()
    } catch (err) {
      setError(err.message)
      setBusy(false)
    }
  }

  return (
    <Modal title={title} onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <input
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={100}
          placeholder="Playlist name"
          className="h-11 w-full rounded-lg bg-surface-700 px-4 text-sm outline-none placeholder:text-ink-500 focus:ring-2 focus:ring-brand-500"
        />
        {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
        <div className="mt-5 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="rounded-full px-5 py-2 text-sm font-semibold text-ink-300 hover:text-ink-100">
            Cancel
          </button>
          <button type="submit" disabled={busy} className="rounded-full bg-brand-500 px-5 py-2 text-sm font-semibold transition hover:bg-brand-600 disabled:opacity-60">
            {busy ? 'Saving...' : submitLabel}
          </button>
        </div>
      </form>
    </Modal>
  )
}

export default NameModal