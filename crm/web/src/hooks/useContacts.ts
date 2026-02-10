import { useCallback, useEffect, useState } from 'react'
import { contactService } from '../services/contactService'
import { useDebounce } from './useDebounce'
import type { Contact, Lead } from '../types'

const CONTACTS_PER_PAGE = 10

export function useContacts() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [sortBy, setSortBy] = useState('')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [contactLeads, setContactLeads] = useState<Lead[]>([])
  const [loadingLeads, setLoadingLeads] = useState(false)

  const debouncedSearch = useDebounce(search)

  function handleSort(field: string) {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('asc')
    }
  }

  const fetchContacts = useCallback(async (fetchPage: number) => {
    setLoading(true)
    setError('')
    setSelectedContact(null)
    setContactLeads([])
    try {
      const response = await contactService.getAll(
        debouncedSearch || undefined,
        sortBy || undefined,
        sortOrder,
        fetchPage,
        CONTACTS_PER_PAGE
      )
      setContacts(response.data)
      setTotalPages(response.pagination.totalPages)
      setTotal(response.pagination.total)
    } catch {
      setError('Erro ao carregar contatos')
    } finally {
      setLoading(false)
    }
  }, [debouncedSearch, sortBy, sortOrder])

  useEffect(() => {
    setPage(1)
    fetchContacts(1)
  }, [fetchContacts])

  function handlePageChange(newPage: number) {
    setPage(newPage)
    fetchContacts(newPage)
  }

  async function fetchContactLeads(contact: Contact) {
    if (selectedContact?.id === contact.id) {
      setSelectedContact(null)
      setContactLeads([])
      return
    }

    setSelectedContact(contact)
    setLoadingLeads(true)
    try {
      const data = await contactService.getLeads(contact.id)
      setContactLeads(data)
    } catch {
      setContactLeads([])
    } finally {
      setLoadingLeads(false)
    }
  }

  async function deleteContact(contact: Contact) {
    if (!confirm(`Deseja realmente remover o contato "${contact.name}"? Os leads vinculados também serão removidos.`)) {
      return
    }
    try {
      await contactService.remove(contact.id)
      if (selectedContact?.id === contact.id) {
        setSelectedContact(null)
        setContactLeads([])
      }
      fetchContacts(page)
    } catch {
      alert('Erro ao remover contato')
    }
  }

  return {
    contacts,
    search,
    setSearch,
    loading,
    error,
    sortBy,
    sortOrder,
    handleSort,
    page,
    setPage: handlePageChange,
    totalPages,
    total,
    selectedContact,
    contactLeads,
    loadingLeads,
    fetchContactLeads,
    deleteContact,
    refetch: () => fetchContacts(page),
  }
}
