import { randomUUID } from 'node:crypto'
import type { Contact } from '../types/index.js'

const contacts: Contact[] = []

export const contactRepository = {
  findAll(search?: string): Contact[] {
    if (!search) return contacts

    const term = search.toLowerCase()
    return contacts.filter(
      (c) =>
        c.name.toLowerCase().includes(term) ||
        c.email.toLowerCase().includes(term)
    )
  },

  findById(id: string): Contact | undefined {
    return contacts.find((c) => c.id === id)
  },

  create(data: Omit<Contact, 'id' | 'createdAt'>): Contact {
    const contact: Contact = {
      ...data,
      id: randomUUID(),
      createdAt: new Date().toISOString(),
    }
    contacts.push(contact)
    return contact
  },

  update(id: string, data: Partial<Omit<Contact, 'id' | 'createdAt'>>): Contact | undefined {
    const index = contacts.findIndex((c) => c.id === id)
    if (index === -1) return undefined

    contacts[index] = { ...contacts[index], ...data }
    return contacts[index]
  },

  delete(id: string): boolean {
    const index = contacts.findIndex((c) => c.id === id)
    if (index === -1) return false

    contacts.splice(index, 1)
    return true
  },
}