import { Hono } from 'hono'
import { contactRepository } from '../../repositories/contact.repository.js'
import { paginate } from '../../utils/pagination.js'

const route = new Hono()

route.get('/', (c) => {
  const search = c.req.query('search')
  const contacts = contactRepository.findAll(search)

  const result = paginate(contacts, {
    page: c.req.query('page'),
    limit: c.req.query('limit'),
    sortBy: c.req.query('sortBy'),
    sortOrder: c.req.query('sortOrder'),
  }, ['name', 'createdAt'])

  return c.json(result)
})

export { route as listContacts }