import { Hono } from 'hono'
import { contactRepository } from '../../repositories/contact.repository.js'

const route = new Hono()

route.get('/', (c) => {
  const search = c.req.query('search')
  const contacts = contactRepository.findAll(search)
  return c.json(contacts)
})

export { route as listContacts }