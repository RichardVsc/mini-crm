import { Hono } from 'hono'
import { z } from 'zod'
import { leadRepository } from '../../repositories/lead.repository.js'
import { updateLeadSchema } from '../../schemas/lead.schema.js'

const route = new Hono()

route.put('/:id', async (c) => {
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

export { route as updateLead }