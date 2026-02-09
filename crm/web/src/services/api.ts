const API_URL = 'http://localhost:3001'

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Erro na requisição')
  }

  return response.json()
}

export const api = {
  // Contacts
  getContacts: (search?: string) => {
    const params = search ? `?search=${encodeURIComponent(search)}` : ''
    return request<Contact[]>(`/contacts${params}`)
  },

  createContact: (data: CreateContactData) =>
    request<Contact>('/contacts', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateContact: (id: string, data: Partial<CreateContactData>) =>
    request<Contact>(`/contacts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  deleteContact: (id: string) =>
    request<{ message: string }>(`/contacts/${id}`, { method: 'DELETE' }),

  getContactLeads: (contactId: string) =>
    request<Lead[]>(`/contacts/${contactId}/leads`),

  // Leads
  getLeads: (search?: string, status?: string) => {
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (status) params.set('status', status)
    const query = params.toString()
    return request<Lead[]>(`/leads${query ? `?${query}` : ''}`)
  },

  createLead: (data: CreateLeadData) =>
    request<Lead>('/leads', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateLead: (id: string, data: Partial<CreateLeadData>) =>
    request<Lead>(`/leads/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  deleteLead: (id: string) =>
    request<{ message: string }>(`/leads/${id}`, { method: 'DELETE' }),
}

// Tipos para criação
import type { Contact, Lead } from '../types'

type CreateContactData = Omit<Contact, 'id' | 'createdAt'>
type CreateLeadData = Omit<Lead, 'id' | 'createdAt'>