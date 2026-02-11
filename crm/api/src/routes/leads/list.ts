import { Hono } from 'hono'
import { leadRepository } from '../../repositories/lead.repository.js'
import { contactRepository } from '../../repositories/contact.repository.js'
import { paginate } from '../../utils/pagination.js'
import { LEAD_STATUSES } from '../../types/index.js'

const route = new Hono()

route.get('/', (c) => {
  const search = c.req.query('search')
  const status = LEAD_STATUSES.find((s) => s === c.req.query('status'))

  const leads = leadRepository.findAll({ search, status })

  const result = paginate(leads, {
    page: c.req.query('page'),
    limit: c.req.query('limit'),
    sortBy: c.req.query('sortBy'),
    sortOrder: c.req.query('sortOrder'),
  }, ['name', 'createdAt'])

  const dataWithContact = result.data.map((lead) => {
    const contact = contactRepository.findById(lead.contactId)
    if (!contact) {
      throw new Error(`Contact ${lead.contactId} not found for lead ${lead.id}`)
    }
    return {
      ...lead,
      contact: { id: contact.id, name: contact.name, email: contact.email },
    }
  })

  return c.json({ ...result, data: dataWithContact })
})

export { route as listLeads }