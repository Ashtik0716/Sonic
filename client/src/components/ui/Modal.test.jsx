import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Modal from './Modal'

describe('Modal', () => {
  it('renders its title and children', () => {
    render(<Modal title="Hello" onClose={() => {}}><p>Body text</p></Modal>)
    expect(screen.getByRole('dialog', { name: 'Hello' })).toBeInTheDocument()
    expect(screen.getByText('Body text')).toBeInTheDocument()
  })

  it('closes on Escape', () => {
    const onClose = vi.fn()
    render(<Modal title="Hello" onClose={onClose}>x</Modal>)
    fireEvent.keyDown(window, { key: 'Escape' })
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('does not close when clicking inside the card', () => {
    const onClose = vi.fn()
    render(<Modal title="Hello" onClose={onClose}><p>Inside</p></Modal>)
    fireEvent.click(screen.getByText('Inside'))
    expect(onClose).not.toHaveBeenCalled()
  })
})