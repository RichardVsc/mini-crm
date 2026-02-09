import { Hono } from 'hono'
import { contactRepository } from '../../repositories/contact.repository.js'
import { leadRepository } from '../../repositories/lead.repository.js'

const route = new Hono()

route.get('/:contactId/leads', (c) => {
  const contactId = c.req.param('contactId')
  const contact = contactRepository.findById(contactId)

  if (!contact) {
    return c.json({ error: 'Contato não encontrado' }, 404)
  }

  const leads = leadRepository.findByContactId(contactId)
  return c.json(leads)
})

export { route as listContactLeads }