import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { contactRoutes } from './routes/contact.routes.js'
import { leadRoutes } from './routes/lead.routes.js'

const app = new Hono()

app.use('*', cors())

app.route('/contacts', contactRoutes)
app.route('/leads', leadRoutes)

const port = 3001

console.log(`🚀 API rodando em http://localhost:${port}`)

serve({
  fetch: app.fetch,
  port,
})