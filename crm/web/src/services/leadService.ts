import { request } from './api'
import type { Lead, PaginatedResponse } from '../types'

type CreateLeadData = Omit<Lead, 'id' | 'createdAt' | 'contact'>

export const leadService = {
  getAll: (search?: string, status?: string, sortBy?: string, sortOrder?: string, page?: number, limit?: number) => {
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (status) params.set('status', status)
    if (sortBy) params.set('sortBy', sortBy)
    if (sortOrder) params.set('sortOrder', sortOrder)
    if (page) params.set('page', String(page))
    if (limit) params.set('limit', String(limit))
    const query = params.toString()
    return request<PaginatedResponse<Lead>>(`/leads${query ? `?${query}` : ''}`)
  },

  create: (data: CreateLeadData) =>
    request<Lead>('/leads', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: Partial<CreateLeadData>) =>
    request<Lead>(`/leads/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  remove: (id: string) =>
    request<{ message: string }>(`/leads/${id}`, { method: 'DELETE' }),
}
