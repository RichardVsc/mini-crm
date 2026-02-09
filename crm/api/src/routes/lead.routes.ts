import { Hono } from 'hono'
import { leadRepository } from '../repositories/lead.repository.js'
import { contactRepository } from '../repositories/contact.repository.js'
import { createLeadSchema, updateLeadSchema } from '../schemas/lead.schema.js'
import type { LeadStatus } from '../types/index.js'
import { z } from 'zod'

const leadRoutes = new Hono()

// GET /leads
leadRoutes.get('/', (c) => {
  const search = c.req.query('search')
  const status = c.req.query('status') as LeadStatus | undefined

  const leads = leadRepository.findAll({ search, status })
  return c.json(leads)
})

// POST /leads
leadRoutes.post('/', async (c) => {
  const body = await c.req.json()
  const result = createLeadSchema.safeParse(body)

  if (!result.success) {
    return c.json({ error: z.treeifyError(result.error) }, 400)
  }

  const contact = contactRepository.findById(result.data.contactId)

  if (!contact) {
    return c.json({ error: 'Contato não encontrado' }, 400)
  }

  const lead = leadRepository.create(result.data)
  return c.json(lead, 201)
})

// PUT /leads/:id
leadRoutes.put('/:id', async (c) => {
  const id = c.req.param('id')
  const body = await c.req.json()
  const result = updateLeadSchema.safeParse(body)

  if (!result.success) {
    return c.json({ error: z.treeifyError(result.error) }, 400)
  }

  const lead = leadRepository.update(id, result.data)

  if (!lead) {
    return c.json({ error: 'Lead não encontrado' }, 404)
  }

  return c.json(lead)
})

// DELETE /leads/:id
leadRoutes.delete('/:id', (c) => {
  const id = c.req.param('id')
  const deleted = leadRepository.delete(id)

  if (!deleted) {
    return c.json({ error: 'Lead não encontrado' }, 404)
  }

  return c.json({ message: 'Lead removido com sucesso' })
})

export { leadRoutes }