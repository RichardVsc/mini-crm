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

const validContact = {
  name: 'Maria Silva',
  email: 'maria@email.com',
  phone: '(47) 99999-9999',
}

describe('Contact Routes', () => {
  beforeEach(() => {
    leadRepository.clear()
    contactRepository.clear()
  })

  describe('POST /contacts', () => {
    it('should create a contact and return 201', async () => {
      const res = await app.request('/contacts', json(validContact))
      const body = await res.json()

      expect(res.status).toBe(201)
      expect(body.name).toBe('Maria Silva')
      expect(body.email).toBe('maria@email.com')
      expect(body).toHaveProperty('id')
      expect(body).toHaveProperty('createdAt')
    })

    it('should return 400 for invalid data', async () => {
      const res = await app.request('/contacts', json({ name: 'M', email: 'bad', phone: '123' }))
      expect(res.status).toBe(400)
    })

    it('should return 400 for missing fields', async () => {
      const res = await app.request('/contacts', json({}))
      expect(res.status).toBe(400)
    })
  })

  describe('GET /contacts', () => {
    it('should list all contacts', async () => {
      await app.request('/contacts', json(validContact))
      await app.request('/contacts', json({ ...validContact, name: 'João', email: 'joao@email.com' }))

      const res = await app.request('/contacts')
      const body = await res.json()

      expect(res.status).toBe(200)
      expect(body.data).toHaveLength(2)
      expect(body.pagination.total).toBe(2)
    })

    it('should search by name', async () => {
      await app.request('/contacts', json(validContact))
      await app.request('/contacts', json({ ...validContact, name: 'João', email: 'joao@email.com' }))

      const res = await app.request('/contacts?search=maria')
      const body = await res.json()

      expect(body.data).toHaveLength(1)
      expect(body.data[0].name).toBe('Maria Silva')
    })

    it('should search by email', async () => {
      await app.request('/contacts', json(validContact))
      await app.request('/contacts', json({ ...validContact, name: 'João', email: 'joao@empresa.com' }))

      const res = await app.request('/contacts?search=empresa')
      const body = await res.json()

      expect(body.data).toHaveLength(1)
      expect(body.data[0].name).toBe('João')
    })

    it('should paginate results', async () => {
      for (let i = 0; i < 3; i++) {
        await app.request('/contacts', json({ ...validContact, name: `User ${i}`, email: `u${i}@email.com` }))
      }

      const res = await app.request('/contacts?page=1&limit=2')
      const body = await res.json()

      expect(body.data).toHaveLength(2)
      expect(body.pagination.total).toBe(3)
      expect(body.pagination.totalPages).toBe(2)
    })

    it('should sort by name', async () => {
      await app.request('/contacts', json({ ...validContact, name: 'Carlos', email: 'c@email.com' }))
      await app.request('/contacts', json({ ...validContact, name: 'Ana', email: 'a@email.com' }))

      const res = await app.request('/contacts?sortBy=name&sortOrder=asc')
      const body = await res.json()

      expect(body.data[0].name).toBe('Ana')
      expect(body.data[1].name).toBe('Carlos')
    })
  })

  describe('PATCH /contacts/:id', () => {
    it('should update a contact', async () => {
      const create = await app.request('/contacts', json(validContact))
      const { id } = await create.json()

      const res = await app.request(`/contacts/${id}`, patch({ name: 'Maria Atualizada' }))
      const body = await res.json()

      expect(res.status).toBe(200)
      expect(body.name).toBe('Maria Atualizada')
      expect(body.email).toBe('maria@email.com')
    })

    it('should return 404 for non-existent contact', async () => {
      const res = await app.request('/contacts/non-existent', patch({ name: 'Test' }))
      expect(res.status).toBe(404)
    })

    it('should return 400 for invalid data', async () => {
      const create = await app.request('/contacts', json(validContact))
      const { id } = await create.json()

      const res = await app.request(`/contacts/${id}`, patch({ email: 'invalido' }))
      expect(res.status).toBe(400)
    })
  })

  describe('DELETE /contacts/:id', () => {
    it('should delete a contact', async () => {
      const create = await app.request('/contacts', json(validContact))
      const { id } = await create.json()

      const res = await app.request(`/contacts/${id}`, { method: 'DELETE' })
      expect(res.status).toBe(200)

      const list = await app.request('/contacts')
      const body = await list.json()
      expect(body.data).toHaveLength(0)
    })

    it('should return 404 for non-existent contact', async () => {
      const res = await app.request('/contacts/non-existent', { method: 'DELETE' })
      expect(res.status).toBe(404)
    })

    it('should cascade delete associated leads', async () => {
      const create = await app.request('/contacts', json(validContact))
      const { id } = await create.json()

      await app.request('/leads', json({ contactId: id, name: 'Lead 1', company: 'Empresa', status: 'novo' }))
      await app.request('/leads', json({ contactId: id, name: 'Lead 2', company: 'Empresa', status: 'novo' }))

      await app.request(`/contacts/${id}`, { method: 'DELETE' })

      const leads = await app.request('/leads')
      const body = await leads.json()
      expect(body.data).toHaveLength(0)
    })
  })

  describe('GET /contacts/:contactId/leads', () => {
    it('should list leads for a contact', async () => {
      const create = await app.request('/contacts', json(validContact))
      const { id } = await create.json()

      await app.request('/leads', json({ contactId: id, name: 'Lead 1', company: 'Empresa', status: 'novo' }))

      const res = await app.request(`/contacts/${id}/leads`)
      const body = await res.json()

      expect(res.status).toBe(200)
      expect(body).toHaveLength(1)
      expect(body[0].name).toBe('Lead 1')
    })

    it('should return 404 for non-existent contact', async () => {
      const res = await app.request('/contacts/non-existent/leads')
      expect(res.status).toBe(404)
    })
  })
})
