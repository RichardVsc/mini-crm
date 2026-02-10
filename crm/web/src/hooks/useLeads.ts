import { useCallback, useEffect, useState } from 'react'
import { leadService } from '../services/leadService'
import { useDebounce } from './useDebounce'
import type { Lead } from '../types'

const LEADS_PER_PAGE = 10

export function useLeads() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [sortBy, setSortBy] = useState('')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [pendingDelete, setPendingDelete] = useState<Lead | null>(null)
  const [deleting, setDeleting] = useState(false)

  const debouncedSearch = useDebounce(search)

  function handleSort(field: string) {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('asc')
    }
  }

  const fetchLeads = useCallback(async (fetchPage: number) => {
    setLoading(true)
    setError('')
    try {
      const response = await leadService.getAll(
        debouncedSearch || undefined,
        statusFilter || undefined,
        sortBy || undefined,
        sortOrder,
        fetchPage,
        LEADS_PER_PAGE
      )
      setLeads(response.data)
      setTotalPages(response.pagination.totalPages)
      setTotal(response.pagination.total)
    } catch {
      setError('Erro ao carregar leads')
    } finally {
      setLoading(false)
    }
  }, [debouncedSearch, statusFilter, sortBy, sortOrder])

  useEffect(() => {
    setPage(1)
    fetchLeads(1)
  }, [fetchLeads])

  function handlePageChange(newPage: number) {
    setPage(newPage)
    fetchLeads(newPage)
  }

  function requestDelete(lead: Lead) {
    setPendingDelete(lead)
  }

  function cancelDelete() {
    setPendingDelete(null)
  }

  async function confirmDelete() {
    if (!pendingDelete) return
    setDeleting(true)
    try {
      await leadService.remove(pendingDelete.id)
      setPendingDelete(null)
      fetchLeads(page)
    } catch {
      setPendingDelete(null)
      setError('Erro ao remover lead')
    } finally {
      setDeleting(false)
    }
  }

  return {
    leads,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    loading,
    error,
    sortBy,
    sortOrder,
    handleSort,
    page,
    setPage: handlePageChange,
    totalPages,
    total,
    pendingDelete,
    deleting,
    requestDelete,
    confirmDelete,
    cancelDelete,
    refetch: () => fetchLeads(page),
  }
}
