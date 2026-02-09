import { Hono } from 'hono'
import { z } from 'zod'
import { contactRepository } from '../../repositories/contact.repository.js'
import { updateContactSchema } from '../../schemas/contact.schema.js'

const route = new Hono()

route.put('/:id', async (c) => {
  const id = c.req.param('id')
  const body = await c.req.json()
  const result = updateContactSchema.safeParse(body)

  if (!result.success) {
    return c.json({ error: z.treeifyError(result.error) }, 400)
  }

  const contact = contactRepository.update(id, result.data)

  if (!contact) {
    return c.json({ error: 'Contato não encontrado' }, 404)
  }

  return c.json(contact)
})

export { route as updateContact }