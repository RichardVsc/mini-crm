import { describe, it, expect } from 'vitest'
import { paginate } from '../../utils/pagination.js'

const items = [
  { name: 'Carlos', createdAt: '2026-01-03' },
  { name: 'Ana', createdAt: '2026-01-01' },
  { name: 'Bruno', createdAt: '2026-01-02' },
  { name: 'Diana', createdAt: '2026-01-04' },
  { name: 'Eduardo', createdAt: '2026-01-05' },
]

describe('Paginate Utility', () => {
  it('should return first page with default params', () => {
    const result = paginate(items, {}, [])
    expect(result.data).toHaveLength(5)
    expect(result.pagination.page).toBe(1)
    expect(result.pagination.total).toBe(5)
  })

  it('should paginate correctly', () => {
    const result = paginate(items, { page: '1', limit: '2' }, [])
    expect(result.data).toHaveLength(2)
    expect(result.pagination.totalPages).toBe(3)
    expect(result.pagination.total).toBe(5)
  })

  it('should return second page', () => {
    const page1 = paginate(items, { page: '1', limit: '2' }, [])
    const page2 = paginate(items, { page: '2', limit: '2' }, [])

    expect(page1.data[0].name).toBe('Carlos')
    expect(page2.data[0].name).toBe('Bruno')
  })

  it('should return empty data for page beyond total', () => {
    const result = paginate(items, { page: '10', limit: '2' }, [])
    expect(result.data).toHaveLength(0)
  })

  it('should sort by name ascending', () => {
    const result = paginate(items, { sortBy: 'name', sortOrder: 'asc' }, ['name', 'createdAt'])
    expect(result.data[0].name).toBe('Ana')
    expect(result.data[4].name).toBe('Eduardo')
  })

  it('should sort by name descending', () => {
    const result = paginate(items, { sortBy: 'name', sortOrder: 'desc' }, ['name', 'createdAt'])
    expect(result.data[0].name).toBe('Eduardo')
    expect(result.data[4].name).toBe('Ana')
  })

  it('should sort by createdAt', () => {
    const result = paginate(items, { sortBy: 'createdAt', sortOrder: 'asc' }, ['name', 'createdAt'])
    expect(result.data[0].name).toBe('Ana')
    expect(result.data[4].name).toBe('Eduardo')
  })

  it('should ignore invalid sortBy field', () => {
    const result = paginate(items, { sortBy: 'invalid' }, ['name', 'createdAt'])
    expect(result.data[0].name).toBe('Carlos')
  })

  it('should combine sorting and pagination', () => {
    const result = paginate(items, { sortBy: 'name', sortOrder: 'asc', page: '2', limit: '2' }, ['name', 'createdAt'])
    expect(result.data[0].name).toBe('Carlos')
    expect(result.data[1].name).toBe('Diana')
  })

  it('should enforce minimum page of 1', () => {
    const result = paginate(items, { page: '0' }, [])
    expect(result.pagination.page).toBe(1)
  })

  it('should enforce maximum limit of 50', () => {
    const result = paginate(items, { limit: '100' }, [])
    expect(result.pagination.limit).toBe(50)
  })

  it('should enforce minimum limit of 1', () => {
    const result = paginate(items, { limit: '0' }, [])
    expect(result.pagination.limit).toBe(1)
  })
})