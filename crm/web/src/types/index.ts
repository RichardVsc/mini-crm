export interface Contact {
  id: string
  name: string
  email: string
  phone: string
  createdAt: string
}

export interface Lead {
  id: string
  contactId: string
  name: string
  company: string
  status: LeadStatus
  createdAt: string
  contact?: {
    id: string
    name: string
    email: string
  }
}

export type LeadStatus = 'novo' | 'contactado' | 'qualificado' | 'convertido' | 'perdido'

export const LEAD_STATUSES: LeadStatus[] = [
  'novo',
  'contactado',
  'qualificado',
  'convertido',
  'perdido',
]

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}