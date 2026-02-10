import { useEffect, useState } from 'react'
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

  async function fetchLeads() {
    setLoading(true)
    setError('')
    try {
      const response = await leadService.getAll(
        debouncedSearch || undefined,
        statusFilter || undefined,
        sortBy || undefined,
        sortOrder,
        page,
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
  }

  async function deleteLead(lead: Lead) {
    if (!confirm(`Deseja realmente remover o lead "${lead.name}"?`)) return

    try {
      await leadService.remove(lead.id)
      fetchLeads()
    } catch {
      alert('Erro ao remover lead')
    }
  }

  useEffect(() => {
    setPage(1)
  }, [debouncedSearch, statusFilter, sortBy, sortOrder])

  useEffect(() => {
    fetchLeads()
  }, [debouncedSearch, statusFilter, sortBy, sortOrder, page])

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
    setPage,
    totalPages,
    total,
    deleteLead,
    refetch: fetchLeads,
  }
}