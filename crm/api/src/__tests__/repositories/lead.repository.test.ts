import { describe, it, expect, beforeEach } from 'vitest'
import { leadRepository } from '../../repositories/lead.repository.js'
import { contactRepository } from '../../repositories/contact.repository.js'

describe('Lead Repository', () => {
  let contactId: string

  beforeEach(() => {
    const leads = leadRepository.findAll()
    leads.forEach((l) => leadRepository.delete(l.id))

    const contacts = contactRepository.findAll()
    contacts.forEach((c) => contactRepository.delete(c.id))

    const contact = contactRepository.create({
      name: 'Maria Silva',
      email: 'maria@email.com',
      phone: '(47) 99999-9999',
    })
    contactId = contact.id
  })

  it('should create a lead with id and createdAt', () => {
    const lead = leadRepository.create({
      contactId,
      name: 'Projeto CRM',
      company: 'Clínica Beleza',
      status: 'novo',
    })

    expect(lead).toHaveProperty('id')
    expect(lead).toHaveProperty('createdAt')
    expect(lead.name).toBe('Projeto CRM')
    expect(lead.status).toBe('novo')
    expect(lead.contactId).toBe(contactId)
  })

  it('should list all leads', () => {
    leadRepository.create({ contactId, name: 'Lead 1', company: 'Empresa A', status: 'novo' })
    leadRepository.create({ contactId, name: 'Lead 2', company: 'Empresa B', status: 'convertido' })

    const leads = leadRepository.findAll()
    expect(leads).toHaveLength(2)
  })

  it('should filter by status', () => {
    leadRepository.create({ contactId, name: 'Lead 1', company: 'Empresa A', status: 'novo' })
    leadRepository.create({ contactId, name: 'Lead 2', company: 'Empresa B', status: 'convertido' })

    const results = leadRepository.findAll({ status: 'novo' })
    expect(results).toHaveLength(1)
    expect(results[0].name).toBe('Lead 1')
  })

  it('should search by name case insensitive', () => {
    leadRepository.create({ contactId, name: 'Projeto Website', company: 'Empresa A', status: 'novo' })
    leadRepository.create({ contactId, name: 'Automação CRM', company: 'Empresa B', status: 'novo' })

    expect(leadRepository.findAll({ search: 'projeto' })).toHaveLength(1)
    expect(leadRepository.findAll({ search: 'PROJETO' })).toHaveLength(1)
  })

  it('should search by company', () => {
    leadRepository.create({ contactId, name: 'Lead 1', company: 'Clínica Premium', status: 'novo' })
    leadRepository.create({ contactId, name: 'Lead 2', company: 'Estética Plus', status: 'novo' })

    const results = leadRepository.findAll({ search: 'premium' })
    expect(results).toHaveLength(1)
    expect(results[0].company).toBe('Clínica Premium')
  })

  it('should combine search and status filters', () => {
    leadRepository.create({ contactId, name: 'Projeto A', company: 'Empresa A', status: 'novo' })
    leadRepository.create({ contactId, name: 'Projeto B', company: 'Empresa B', status: 'convertido' })
    leadRepository.create({ contactId, name: 'Automação', company: 'Empresa C', status: 'novo' })

    const results = leadRepository.findAll({ search: 'projeto', status: 'novo' })
    expect(results).toHaveLength(1)
    expect(results[0].name).toBe('Projeto A')
  })

  it('should find leads by contactId', () => {
    const otherContact = contactRepository.create({
      name: 'João',
      email: 'joao@email.com',
      phone: '(11) 88888-0000',
    })

    leadRepository.create({ contactId, name: 'Lead Maria', company: 'Empresa A', status: 'novo' })
    leadRepository.create({ contactId: otherContact.id, name: 'Lead João', company: 'Empresa B', status: 'novo' })

    const results = leadRepository.findByContactId(contactId)
    expect(results).toHaveLength(1)
    expect(results[0].name).toBe('Lead Maria')
  })

  it('should update a lead', () => {
    const created = leadRepository.create({ contactId, name: 'Lead 1', company: 'Empresa A', status: 'novo' })

    const updated = leadRepository.update(created.id, { status: 'qualificado' })
    expect(updated?.status).toBe('qualificado')
    expect(updated?.name).toBe('Lead 1')
  })

  it('should return undefined when updating non-existent lead', () => {
    const result = leadRepository.update('non-existent', { status: 'novo' })
    expect(result).toBeUndefined()
  })

  it('should delete a lead', () => {
    const created = leadRepository.create({ contactId, name: 'Lead 1', company: 'Empresa A', status: 'novo' })

    expect(leadRepository.delete(created.id)).toBe(true)
    expect(leadRepository.findAll()).toHaveLength(0)
  })

  it('should return false when deleting non-existent lead', () => {
    expect(leadRepository.delete('non-existent')).toBe(false)
  })

  it('should delete all leads by contactId', () => {
    leadRepository.create({ contactId, name: 'Lead 1', company: 'Empresa A', status: 'novo' })
    leadRepository.create({ contactId, name: 'Lead 2', company: 'Empresa B', status: 'novo' })

    leadRepository.deleteByContactId(contactId)
    expect(leadRepository.findAll()).toHaveLength(0)
  })
})