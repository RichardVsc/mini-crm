interface PaginationProps {
  page: number
  totalPages: number
  total: number
  label: string
  onPageChange: (page: number) => void
}

export function Pagination({ page, totalPages, total, label, onPageChange }: PaginationProps) {
  if (total === 0) return null

  return (
    <div className="flex items-center justify-between">
      <p className="text-sm text-gray-500">
        {total} {total === 1 ? label : `${label}s`} encontrado{total === 1 ? '' : 's'}
      </p>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Anterior
        </button>
        <span className="text-sm text-gray-600">
          {page} de {totalPages}
        </span>
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Próximo
        </button>
      </div>
    </div>
  )
}