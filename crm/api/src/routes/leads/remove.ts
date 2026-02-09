import { Hono } from 'hono'
import { leadRepository } from '../../repositories/lead.repository.js'

const route = new Hono()

route.delete('/:id', (c) => {
  const id = c.req.param('id')
  const deleted = leadRepository.delete(id)

  if (!deleted) {
    return c.json({ error: 'Lead não encontrado' }, 404)
  }

  return c.json({ message: 'Lead removido com sucesso' })
})

export { route as removeLead }