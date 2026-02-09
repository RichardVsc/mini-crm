import { request } from './api'
import type { Contact } from '../types'

type CreateContactData = Omit<Contact, 'id' | 'createdAt'>

export const contactService = {
  getAll: (search?: string) => {
    const params = search ? `?search=${encodeURIComponent(search)}` : ''
    return request<Contact[]>(`/contacts${params}`)
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
    request<import('../types').Lead[]>(`/contacts/${contactId}/leads`),
}