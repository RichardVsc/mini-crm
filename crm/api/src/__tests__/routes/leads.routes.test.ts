import { describe, it, expect, beforeEach } from 'vitest'
import { app } from '../../app.js'
import { contactRepository } from '../../repositories/contact.repository.js'
import { leadRepository } from '../../repositories/lead.repository.js'

function json(data: Record<string, unknown>) {
  return {
    method: 'POST' as const,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }
}

function patch(data: Record<string, unknown>) {
  return {
    method: 'PATCH' as const,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }
}

describe('Lead Routes', () => {
  let contactId: string

  beforeEach(async () => {
    ;[...leadRepository.findAll()].forEach((l) => leadRepository.delete(l.id))
    ;[...contactRepository.findAll()].forEach((c) => contactRepository.delete(c.id))

    const res = await app.request('/contacts', json({
      name: 'Maria Silva',
      email: 'maria@email.com',
      phone: '(47) 99999-9999',
    }))
    const contact = await res.json()
    contactId = contact.id
  })

  describe('POST /leads', () => {
    it('should create a lead and return 201', async () => {
      const res = await app.request('/leads', json({
        contactId,
        name: 'Projeto CRM',
        company: 'Empresa X',
        status: 'novo',
      }))
      const body = await res.json()

      expect(res.status).toBe(201)
      expect(body.name).toBe('Projeto CRM')
      expect(body.contactId).toBe(contactId)
      expect(body).toHaveProperty('id')
      expect(body).toHaveProperty('createdAt')
    })

    it('should return 400 for invalid data', async () => {
      const res = await app.request('/leads', json({
        contactId,
        name: 'L',
        company: 'E',
        status: 'invalido',
      }))
      expect(res.status).toBe(400)
    })

    it('should return 400 for non-existent contact', async () => {
      const res = await app.request('/leads', json({
        contactId: 'non-existent',
        name: 'Lead',
        company: 'Empresa',
        status: 'novo',
      }))
      expect(res.status).toBe(400)
    })
  })

  describe('GET /leads', () => {
    it('should list leads with contact enrichment', async () => {
      await app.request('/leads', json({ contactId, name: 'Lead 1', company: 'Empresa A', status: 'novo' }))

      const res = await app.request('/leads')
      const body = await res.json()

      expect(res.status).toBe(200)
      expect(body.data).toHaveLength(1)
      expect(body.data[0].contact).toEqual({
        id: contactId,
        name: 'Maria Silva',
        email: 'maria@email.com',
      })
    })

    it('should search by name', async () => {
      await app.request('/leads', json({ contactId, name: 'Website', company: 'Empresa A', status: 'novo' }))
      await app.request('/leads', json({ contactId, name: 'CRM', company: 'Empresa B', status: 'novo' }))

      const res = await app.request('/leads?search=website')
      const body = await res.json()

      expect(body.data).toHaveLength(1)
      expect(body.data[0].name).toBe('Website')
    })

    it('should search by company', async () => {
      await app.request('/leads', json({ contactId, name: 'Lead 1', company: 'Clinica Premium', status: 'novo' }))
      await app.request('/leads', json({ contactId, name: 'Lead 2', company: 'Estetica Plus', status: 'novo' }))

      const res = await app.request('/leads?search=premium')
      const body = await res.json()

      expect(body.data).toHaveLength(1)
      expect(body.data[0].company).toBe('Clinica Premium')
    })

    it('should filter by status', async () => {
      await app.request('/leads', json({ contactId, name: 'Lead 1', company: 'Empresa', status: 'novo' }))
      await app.request('/leads', json({ contactId, name: 'Lead 2', company: 'Empresa', status: 'convertido' }))

      const res = await app.request('/leads?status=novo')
      const body = await res.json()

      expect(body.data).toHaveLength(1)
      expect(body.data[0].name).toBe('Lead 1')
    })

    it('should combine search and status filters', async () => {
      await app.request('/leads', json({ contactId, name: 'Projeto A', company: 'Empresa', status: 'novo' }))
      await app.request('/leads', json({ contactId, name: 'Projeto B', company: 'Empresa', status: 'convertido' }))
      await app.request('/leads', json({ contactId, name: 'Automação', company: 'Empresa', status: 'novo' }))

      const res = await app.request('/leads?search=projeto&status=novo')
      const body = await res.json()

      expect(body.data).toHaveLength(1)
      expect(body.data[0].name).toBe('Projeto A')
    })

    it('should ignore invalid status filter', async () => {
      await app.request('/leads', json({ contactId, name: 'Lead 1', company: 'Empresa', status: 'novo' }))

      const res = await app.request('/leads?status=invalido')
      const body = await res.json()

      expect(body.data).toHaveLength(1)
    })

    it('should paginate results', async () => {
      for (let i = 0; i < 3; i++) {
        await app.request('/leads', json({ contactId, name: `Lead ${i}`, company: 'Empresa', status: 'novo' }))
      }

      const res = await app.request('/leads?page=1&limit=2')
      const body = await res.json()

      expect(body.data).toHaveLength(2)
      expect(body.pagination.total).toBe(3)
      expect(body.pagination.totalPages).toBe(2)
    })

    it('should sort by name', async () => {
      await app.request('/leads', json({ contactId, name: 'Beta', company: 'Empresa', status: 'novo' }))
      await app.request('/leads', json({ contactId, name: 'Alpha', company: 'Empresa', status: 'novo' }))

      const res = await app.request('/leads?sortBy=name&sortOrder=asc')
      const body = await res.json()

      expect(body.data[0].name).toBe('Alpha')
      expect(body.data[1].name).toBe('Beta')
    })
  })

  describe('PATCH /leads/:id', () => {
    it('should update a lead', async () => {
      const create = await app.request('/leads', json({ contactId, name: 'Lead 1', company: 'Empresa', status: 'novo' }))
      const { id } = await create.json()

      const res = await app.request(`/leads/${id}`, patch({ status: 'qualificado' }))
      const body = await res.json()

      expect(res.status).toBe(200)
      expect(body.status).toBe('qualificado')
      expect(body.name).toBe('Lead 1')
    })

    it('should return 404 for non-existent lead', async () => {
      const res = await app.request('/leads/non-existent', patch({ status: 'novo' }))
      expect(res.status).toBe(404)
    })

    it('should return 400 for invalid status', async () => {
      const create = await app.request('/leads', json({ contactId, name: 'Lead 1', company: 'Empresa', status: 'novo' }))
      const { id } = await create.json()

      const res = await app.request(`/leads/${id}`, patch({ status: 'invalido' }))
      expect(res.status).toBe(400)
    })
  })

  describe('DELETE /leads/:id', () => {
    it('should delete a lead', async () => {
      const create = await app.request('/leads', json({ contactId, name: 'Lead 1', company: 'Empresa', status: 'novo' }))
      const { id } = await create.json()

      const res = await app.request(`/leads/${id}`, { method: 'DELETE' })
      expect(res.status).toBe(200)

      const list = await app.request('/leads')
      const body = await list.json()
      expect(body.data).toHaveLength(0)
    })

    it('should return 404 for non-existent lead', async () => {
      const res = await app.request('/leads/non-existent', { method: 'DELETE' })
      expect(res.status).toBe(404)
    })
  })
})
