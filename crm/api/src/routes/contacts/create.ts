import { Hono } from 'hono'
import { z } from 'zod'
import { contactRepository } from '../../repositories/contact.repository.js'
import { createContactSchema } from '../../schemas/contact.schema.js'

const route = new Hono()

route.post('/', async (c) => {
  const body = await c.req.json()
  const result = createContactSchema.safeParse(body)

  if (!result.success) {
    return c.json({ error: z.treeifyError(result.error) }, 400)
  }

  const contact = contactRepository.create(result.data)
  return c.json(contact, 201)
})

export { route as createContact }