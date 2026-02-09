import { Hono } from 'hono'
import { z } from 'zod'
import { leadRepository } from '../../repositories/lead.repository.js'
import { contactRepository } from '../../repositories/contact.repository.js'
import { createLeadSchema } from '../../schemas/lead.schema.js'

const route = new Hono()

route.post('/', async (c) => {
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

export { route as createLead }