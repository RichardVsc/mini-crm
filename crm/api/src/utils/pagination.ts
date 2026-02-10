interface PaginationParams {
  page?: string
  limit?: string
  sortBy?: string
  sortOrder?: string
}

interface PaginatedResult<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export function paginate<T>(
  items: T[],
  params: PaginationParams,
  allowedSortFields: string[]
): PaginatedResult<T> {
  const page = Math.max(1, Number(params.page) || 1)
  const limit = Math.min(50, Math.max(1, Number(params.limit) || 10))
  const sortBy = params.sortBy && allowedSortFields.includes(params.sortBy) ? params.sortBy : undefined
  const sortOrder = params.sortOrder === 'desc' ? -1 : 1

  let result = items

  if (sortBy) {
    result = [...result].sort((a, b) => {
      const aVal = (a as Record<string, unknown>)[sortBy] as string
      const bVal = (b as Record<string, unknown>)[sortBy] as string
      if (aVal < bVal) return -1 * sortOrder
      if (aVal > bVal) return 1 * sortOrder
      return 0
    })
  }

  const total = result.length
  const totalPages = Math.ceil(total / limit)
  const data = result.slice((page - 1) * limit, page * limit)

  return { data, pagination: { page, limit, total, totalPages } }
}