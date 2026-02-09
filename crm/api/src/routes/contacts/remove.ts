import { Hono } from 'hono'
import { contactRepository } from '../../repositories/contact.repository.js'
import { leadRepository } from '../../repositories/lead.repository.js'

const route = new Hono()

route.delete('/:id', (c) => {
  const id = c.req.param('id')
  const exists = contactRepository.findById(id)

  if (!exists) {
    return c.json({ error: 'Contato não encontrado' }, 404)
  }

  leadRepository.deleteByContactId(id)
  contactRepository.delete(id)

  return c.json({ message: 'Contato removido com sucesso' })
})

export { route as removeContact }