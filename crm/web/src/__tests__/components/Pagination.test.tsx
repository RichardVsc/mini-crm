import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Pagination } from '../../components/Pagination'

describe('Pagination', () => {
  it('should render nothing when total is 0', () => {
    const { container } = render(
      <Pagination page={1} totalPages={0} total={0} label="lead" onPageChange={vi.fn()} />
    )
    expect(container.innerHTML).toBe('')
  })

  it('should show total count', () => {
    render(<Pagination page={1} totalPages={3} total={25} label="lead" onPageChange={vi.fn()} />)
    expect(screen.getByText('25 leads encontrados')).toBeInTheDocument()
  })

  it('should show singular form for 1 item', () => {
    render(<Pagination page={1} totalPages={1} total={1} label="lead" onPageChange={vi.fn()} />)
    expect(screen.getByText('1 lead encontrado')).toBeInTheDocument()
  })

  it('should show current page info', () => {
    render(<Pagination page={2} totalPages={5} total={50} label="lead" onPageChange={vi.fn()} />)
    expect(screen.getByText('2 de 5')).toBeInTheDocument()
  })

  it('should disable previous button on first page', () => {
    render(<Pagination page={1} totalPages={3} total={25} label="lead" onPageChange={vi.fn()} />)
    expect(screen.getByText('Anterior')).toBeDisabled()
  })

  it('should disable next button on last page', () => {
    render(<Pagination page={3} totalPages={3} total={25} label="lead" onPageChange={vi.fn()} />)
    expect(screen.getByText('Próximo')).toBeDisabled()
  })

  it('should call onPageChange with previous page', () => {
    const onPageChange = vi.fn()
    render(<Pagination page={2} totalPages={3} total={25} label="lead" onPageChange={onPageChange} />)

    fireEvent.click(screen.getByText('Anterior'))
    expect(onPageChange).toHaveBeenCalledWith(1)
  })

  it('should call onPageChange with next page', () => {
    const onPageChange = vi.fn()
    render(<Pagination page={1} totalPages={3} total={25} label="lead" onPageChange={onPageChange} />)

    fireEvent.click(screen.getByText('Próximo'))
    expect(onPageChange).toHaveBeenCalledWith(2)
  })
})
