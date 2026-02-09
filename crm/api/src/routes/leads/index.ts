import { Hono } from 'hono'
import { listLeads } from './list.js'
import { createLead } from './create.js'
import { updateLead } from './update.js'
import { removeLead } from './remove.js'

const leadRoutes = new Hono()

leadRoutes.route('/', listLeads)
leadRoutes.route('/', createLead)
leadRoutes.route('/', updateLead)
leadRoutes.route('/', removeLead)

export { leadRoutes }