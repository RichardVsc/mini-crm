import { Hono } from 'hono'
import { leadRepository } from '../../repositories/lead.repository.js'
import type { LeadStatus } from '../../types/index.js'

const route = new Hono()

route.get('/', (c) => {
  const search = c.req.query('search')
  const status = c.req.query('status') as LeadStatus | undefined

  const leads = leadRepository.findAll({ search, status })
  return c.json(leads)
})

export { route as listLeads }