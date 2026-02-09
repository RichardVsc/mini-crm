import { request } from './api'
import type { Lead } from '../types'

type CreateLeadData = Omit<Lead, 'id' | 'createdAt'>

export const leadService = {
  getAll: (search?: string, status?: string) => {
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (status) params.set('status', status)
    const query = params.toString()
    return request<Lead[]>(`/leads${query ? `?${query}` : ''}`)
  },

  create: (data: CreateLeadData) =>
    request<Lead>('/leads', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: Partial<CreateLeadData>) =>
    request<Lead>(`/leads/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  remove: (id: string) =>
    request<{ message: string }>(`/leads/${id}`, { method: 'DELETE' }),
}