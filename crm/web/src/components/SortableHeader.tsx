interface SortableHeaderProps {
  label: string
  field: string
  currentSort: string
  currentOrder: string
  onSort: (field: string) => void
}

export function SortableHeader({ label, field, currentSort, currentOrder, onSort }: SortableHeaderProps) {
  const isActive = currentSort === field
  const arrow = isActive ? (currentOrder === 'asc' ? ' ↑' : ' ↓') : ''

  return (
    <th
      onClick={() => onSort(field)}
      className="text-left px-4 py-3 text-sm font-medium text-gray-600 cursor-pointer hover:text-gray-900 select-none"
    >
      {label}{arrow}
    </th>
  )
}