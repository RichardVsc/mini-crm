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
}

export const LEAD_STATUSES = [
  'novo',
  'contactado',
  'qualificado',
  'convertido',
  'perdido',
] as const

export type LeadStatus = (typeof LEAD_STATUSES)[number]