import type { LeadStatus } from '../types'

export const STATUS_LABELS: Record<LeadStatus, string> = {
  novo: 'Novo',
  contactado: 'Contactado',
  qualificado: 'Qualificado',
  convertido: 'Convertido',
  perdido: 'Perdido',
}

export const STATUS_COLORS: Record<LeadStatus, string> = {
  novo: 'bg-blue-100 text-blue-700',
  contactado: 'bg-yellow-100 text-yellow-700',
  qualificado: 'bg-purple-100 text-purple-700',
  convertido: 'bg-green-100 text-green-700',
  perdido: 'bg-red-100 text-red-700',
}