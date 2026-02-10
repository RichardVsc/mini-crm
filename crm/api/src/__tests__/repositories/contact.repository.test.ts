import { describe, it, expect, beforeEach } from 'vitest'
import { contactRepository } from '../../repositories/contact.repository.js'

describe('Contact Repository', () => {
  beforeEach(() => {
    const contacts = contactRepository.findAll()
    contacts.forEach((c) => contactRepository.delete(c.id))
  })

  it('should create a contact with id and createdAt', () => {
    const contact = contactRepository.create({
      name: 'João Silva',
      email: 'joao@email.com',
      phone: '(47) 99999-9999',
    })

    expect(contact).toHaveProperty('id')
    expect(contact).toHaveProperty('createdAt')
    expect(contact.name).toBe('João Silva')
    expect(contact.email).toBe('joao@email.com')
    expect(contact.phone).toBe('(47) 99999-9999')
  })

  it('should list all contacts', () => {
    contactRepository.create({ name: 'Maria', email: 'maria@email.com', phone: '(11) 99999-0000' })
    contactRepository.create({ name: 'João', email: 'joao@email.com', phone: '(21) 88888-0000' })

    const contacts = contactRepository.findAll()
    expect(contacts).toHaveLength(2)
  })

  it('should search by name case insensitive', () => {
    contactRepository.create({ name: 'Maria Silva', email: 'maria@email.com', phone: '(11) 99999-0000' })
    contactRepository.create({ name: 'João Santos', email: 'joao@email.com', phone: '(21) 88888-0000' })

    expect(contactRepository.findAll('maria')).toHaveLength(1)
    expect(contactRepository.findAll('MARIA')).toHaveLength(1)
  })

  it('should search by email', () => {
    contactRepository.create({ name: 'Maria', email: 'maria@clinica.com', phone: '(11) 99999-0000' })
    contactRepository.create({ name: 'João', email: 'joao@empresa.com', phone: '(21) 88888-0000' })

    const results = contactRepository.findAll('clinica')
    expect(results).toHaveLength(1)
    expect(results[0].name).toBe('Maria')
  })

  it('should find contact by id', () => {
    const created = contactRepository.create({ name: 'Maria', email: 'maria@email.com', phone: '(11) 99999-0000' })

    const found = contactRepository.findById(created.id)
    expect(found).toBeDefined()
    expect(found?.name).toBe('Maria')
  })

  it('should return undefined for non-existent id', () => {
    const found = contactRepository.findById('non-existent')
    expect(found).toBeUndefined()
  })

  it('should update a contact', () => {
    const created = contactRepository.create({ name: 'Maria', email: 'maria@email.com', phone: '(11) 99999-0000' })

    const updated = contactRepository.update(created.id, { name: 'Maria Atualizada' })
    expect(updated?.name).toBe('Maria Atualizada')
    expect(updated?.email).toBe('maria@email.com')
  })

  it('should return undefined when updating non-existent contact', () => {
    const result = contactRepository.update('non-existent', { name: 'Teste' })
    expect(result).toBeUndefined()
  })

  it('should delete a contact', () => {
    const created = contactRepository.create({ name: 'Maria', email: 'maria@email.com', phone: '(11) 99999-0000' })

    const deleted = contactRepository.delete(created.id)
    expect(deleted).toBe(true)
    expect(contactRepository.findAll()).toHaveLength(0)
  })

  it('should return false when deleting non-existent contact', () => {
    const deleted = contactRepository.delete('non-existent')
    expect(deleted).toBe(false)
  })
})