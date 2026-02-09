import { Hono } from 'hono'
import { contactRepository } from '../repositories/contact.repository.js'
import { leadRepository } from '../repositories/lead.repository.js'
import { createContactSchema, updateContactSchema } from '../schemas/contact.schema.js'

const contactRoutes = new Hono()

// GET /contacts
contactRoutes.get('/', (c) => {
  const search = c.req.query('search')
  const contacts = contactRepository.findAll(search)
  return c.json(contacts)
})

// POST /contacts
contactRoutes.post('/', async (c) => {
  const body = await c.req.json()
  const result = createContactSchema.safeParse(body)

  if (!result.success) {
    return c.json({ error: result.error.flatten().fieldErrors }, 400)
  }

  const contact = contactRepository.create(result.data)
  return c.json(contact, 201)
})

// PUT /contacts/:id
contactRoutes.put('/:id', async (c) => {
  const id = c.req.param('id')
  const body = await c.req.json()
  const result = updateContactSchema.safeParse(body)

  if (!result.success) {
    return c.json({ error: result.error.flatten().fieldErrors }, 400)
  }

  const contact = contactRepository.update(id, result.data)

  if (!contact) {
    return c.json({ error: 'Contato não encontrado' }, 404)
  }

  return c.json(contact)
})

// DELETE /contacts/:id
contactRoutes.delete('/:id', (c) => {
  const id = c.req.param('id')
  const exists = contactRepository.findById(id)

  if (!exists) {
    return c.json({ error: 'Contato não encontrado' }, 404)
  }

  leadRepository.deleteByContactId(id)
  contactRepository.delete(id)

  return c.json({ message: 'Contato removido com sucesso' })
})

// GET /contacts/:contactId/leads
contactRoutes.get('/:contactId/leads', (c) => {
  const contactId = c.req.param('contactId')
  const contact = contactRepository.findById(contactId)

  if (!contact) {
    return c.json({ error: 'Contato não encontrado' }, 404)
  }

  const leads = leadRepository.findByContactId(contactId)
  return c.json(leads)
})

export { contactRoutes }