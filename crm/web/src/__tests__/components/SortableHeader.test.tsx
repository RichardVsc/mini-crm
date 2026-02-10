import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { SortableHeader } from '../../components/SortableHeader'

function renderInTable(ui: React.ReactElement) {
  return render(<table><thead><tr>{ui}</tr></thead></table>)
}

describe('SortableHeader', () => {
  it('should render the label', () => {
    renderInTable(<SortableHeader label="Nome" field="name" currentSort="" currentOrder="asc" onSort={vi.fn()} />)
    expect(screen.getByText('Nome')).toBeInTheDocument()
  })

  it('should show up arrow when sorted ascending', () => {
    renderInTable(<SortableHeader label="Nome" field="name" currentSort="name" currentOrder="asc" onSort={vi.fn()} />)
    expect(screen.getByText(/Nome/)).toHaveTextContent('Nome ↑')
  })

  it('should show down arrow when sorted descending', () => {
    renderInTable(<SortableHeader label="Nome" field="name" currentSort="name" currentOrder="desc" onSort={vi.fn()} />)
    expect(screen.getByText(/Nome/)).toHaveTextContent('Nome ↓')
  })

  it('should show no arrow when not active sort', () => {
    renderInTable(<SortableHeader label="Nome" field="name" currentSort="createdAt" currentOrder="asc" onSort={vi.fn()} />)
    expect(screen.getByText('Nome')).toHaveTextContent('Nome')
  })

  it('should call onSort with field when clicked', () => {
    const onSort = vi.fn()
    renderInTable(<SortableHeader label="Nome" field="name" currentSort="" currentOrder="asc" onSort={onSort} />)

    fireEvent.click(screen.getByText('Nome'))
    expect(onSort).toHaveBeenCalledWith('name')
  })
})
