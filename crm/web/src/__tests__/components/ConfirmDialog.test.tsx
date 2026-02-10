import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ConfirmDialog } from '../../components/ConfirmDialog'

const defaultProps = {
  open: true,
  title: 'Remover Item',
  message: 'Deseja realmente remover?',
  onConfirm: vi.fn(),
  onCancel: vi.fn(),
}

describe('ConfirmDialog', () => {
  it('should render nothing when closed', () => {
    const { container } = render(<ConfirmDialog {...defaultProps} open={false} />)
    expect(container.innerHTML).toBe('')
  })

  it('should render title and message when open', () => {
    render(<ConfirmDialog {...defaultProps} />)

    expect(screen.getByText('Remover Item')).toBeInTheDocument()
    expect(screen.getByText('Deseja realmente remover?')).toBeInTheDocument()
  })

  it('should call onConfirm when confirm button is clicked', () => {
    const onConfirm = vi.fn()
    render(<ConfirmDialog {...defaultProps} onConfirm={onConfirm} />)

    fireEvent.click(screen.getByText('Remover'))
    expect(onConfirm).toHaveBeenCalledOnce()
  })

  it('should call onCancel when cancel button is clicked', () => {
    const onCancel = vi.fn()
    render(<ConfirmDialog {...defaultProps} onCancel={onCancel} />)

    fireEvent.click(screen.getByText('Cancelar'))
    expect(onCancel).toHaveBeenCalledOnce()
  })

  it('should call onCancel on Escape key', () => {
    const onCancel = vi.fn()
    render(<ConfirmDialog {...defaultProps} onCancel={onCancel} />)

    fireEvent.keyDown(document, { key: 'Escape' })
    expect(onCancel).toHaveBeenCalledOnce()
  })

  it('should call onCancel on backdrop click', () => {
    const onCancel = vi.fn()
    render(<ConfirmDialog {...defaultProps} onCancel={onCancel} />)

    fireEvent.click(screen.getByRole('presentation'))
    expect(onCancel).toHaveBeenCalledOnce()
  })

  it('should not call onCancel when clicking inside the dialog', () => {
    const onCancel = vi.fn()
    render(<ConfirmDialog {...defaultProps} onCancel={onCancel} />)

    fireEvent.click(screen.getByRole('alertdialog'))
    expect(onCancel).not.toHaveBeenCalled()
  })

  it('should show loading state', () => {
    render(<ConfirmDialog {...defaultProps} loading />)

    expect(screen.getByText('Removendo...')).toBeInTheDocument()
    expect(screen.getByText('Removendo...')).toBeDisabled()
    expect(screen.getByText('Cancelar')).toBeDisabled()
  })

  it('should use custom confirm label', () => {
    render(<ConfirmDialog {...defaultProps} confirmLabel="Excluir" />)
    expect(screen.getByText('Excluir')).toBeInTheDocument()
  })
})
