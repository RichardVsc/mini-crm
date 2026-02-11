import { randomUUID } from 'node:crypto'
import type { Lead, LeadStatus } from '../types/index.js'

const leads: Lead[] = []

interface FindAllFilters {
  search?: string
  status?: LeadStatus
}

export const leadRepository = {
  findAll(filters: FindAllFilters = {}): Lead[] {
    let result = leads

    if (filters.search) {
      const term = filters.search.toLowerCase()
      result = result.filter(
        (l) =>
          l.name.toLowerCase().includes(term) ||
          l.company.toLowerCase().includes(term)
      )
    }

    if (filters.status) {
      result = result.filter((l) => l.status === filters.status)
    }

    return result
  },

  findById(id: string): Lead | undefined {
    return leads.find((l) => l.id === id)
  },

  findByContactId(contactId: string): Lead[] {
    return leads.filter((l) => l.contactId === contactId)
  },

  create(data: Omit<Lead, 'id' | 'createdAt'>): Lead {
    const lead: Lead = {
      ...data,
      id: randomUUID(),
      createdAt: new Date().toISOString(),
    }
    leads.push(lead)
    return lead
  },

  update(id: string, data: Partial<Omit<Lead, 'id' | 'createdAt' | 'contactId'>>): Lead | undefined {
    const index = leads.findIndex((l) => l.id === id)
    if (index === -1) return undefined

    leads[index] = { ...leads[index], ...data }
    return leads[index]
  },

  delete(id: string): boolean {
    const index = leads.findIndex((l) => l.id === id)
    if (index === -1) return false

    leads.splice(index, 1)
    return true
  },

  deleteByContactId(contactId: string): void {
    const toRemove = leads.filter((l) => l.contactId === contactId)
    toRemove.forEach((l) => {
      const index = leads.indexOf(l)
      if (index !== -1) leads.splice(index, 1)
    })
  },

  clear(): void {
    leads.length = 0
  },
}