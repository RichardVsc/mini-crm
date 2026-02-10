import { request } from './api'
import type { Contact, Lead } from '../types'

type CreateContactData = Omit<Contact, 'id' | 'createdAt'>

interface PaginatedResponse {
  data: Contact[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export const contactService = {
  getAll: (search?: string, sortBy?: string, sortOrder?: string, page?: number, limit?: number) => {
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (sortBy) params.set('sortBy', sortBy)
    if (sortOrder) params.set('sortOrder', sortOrder)
    if (page) params.set('page', String(page))
    if (limit) params.set('limit', String(limit))
    const query = params.toString()
    return request<PaginatedResponse>(`/contacts${query ? `?${query}` : ''}`)
  },

  create: (data: CreateContactData) =>
    request<Contact>('/contacts', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: Partial<CreateContactData>) =>
    request<Contact>(`/contacts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  remove: (id: string) =>
    request<{ message: string }>(`/contacts/${id}`, { method: 'DELETE' }),

  getLeads: (contactId: string) =>
    request<Lead[]>(`/contacts/${contactId}/leads`),
}