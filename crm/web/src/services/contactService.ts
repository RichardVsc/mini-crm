import { request } from './api'
import type { Contact, Lead, PaginatedResponse } from '../types'

type CreateContactData = Omit<Contact, 'id' | 'createdAt'>

export const contactService = {
  getAll: (search?: string, sortBy?: string, sortOrder?: string, page?: number, limit?: number, signal?: AbortSignal) => {
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (sortBy) params.set('sortBy', sortBy)
    if (sortOrder) params.set('sortOrder', sortOrder)
    if (page) params.set('page', String(page))
    if (limit) params.set('limit', String(limit))
    const query = params.toString()
    return request<PaginatedResponse<Contact>>(`/contacts${query ? `?${query}` : ''}`, { signal })
  },

  create: (data: CreateContactData) =>
    request<Contact>('/contacts', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: Partial<CreateContactData>) =>
    request<Contact>(`/contacts/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  remove: (id: string) =>
    request<{ message: string }>(`/contacts/${id}`, { method: 'DELETE' }),

  getLeads: (contactId: string) =>
    request<Lead[]>(`/contacts/${contactId}/leads`),
}
