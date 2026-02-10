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

  async function deleteLead(lead: Lead) {
    if (!confirm(`Deseja realmente remover o lead "${lead.name}"?`)) return

    try {
      await leadService.remove(lead.id)
      fetchLeads(page)
    } catch {
      alert('Erro ao remover lead')
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
    deleteLead,
    refetch: () => fetchLeads(page),
  }
}
