import { useState } from 'react'
import Modal from './Modal'

function ConfirmModal({ title, message, confirmLabel = 'Delete', onConfirm, onClose }) {
  const [busy, setBusy] = useState(false)

  async function handleConfirm() {
    setBusy(true)
    try {
      await onConfirm()
    } finally {
      onClose()
    }
  }

  return (
    <Modal title={title} onClose={onClose}>
      <p className="text-sm text-ink-300">{message}</p>
      <div className="mt-5 flex justify-end gap-3">
        <button onClick={onClose} className="rounded-full px-5 py-2 text-sm font-semibold text-ink-300 hover:text-ink-100">
          Cancel
        </button>
        <button onClick={handleConfirm} disabled={busy} className="rounded-full bg-red-500 px-5 py-2 text-sm font-semibold transition hover:bg-red-600 disabled:opacity-60">
          {confirmLabel}
        </button>
      </div>
    </Modal>
  )
}

export default ConfirmModal