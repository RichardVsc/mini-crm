import { Hono } from 'hono'
import { listContacts } from './list.js'
import { createContact } from './create.js'
import { updateContact } from './update.js'
import { removeContact } from './remove.js'
import { listContactLeads } from './leads.js'

const contactRoutes = new Hono()

contactRoutes.route('/', listContacts)
contactRoutes.route('/', createContact)
contactRoutes.route('/', updateContact)
contactRoutes.route('/', removeContact)
contactRoutes.route('/', listContactLeads)

export { contactRoutes }