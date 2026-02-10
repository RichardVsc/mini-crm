import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { contactRoutes } from './routes/contacts/index.js'
import { leadRoutes } from './routes/leads/index.js'
import { errorHandler } from './middlewares/error-handler.js'
import { seed } from './seed.js'

const app = new Hono()

app.use('*', cors())
app.use('*', errorHandler)

app.route('/contacts', contactRoutes)
app.route('/leads', leadRoutes)

seed()

const port = 3001

console.log(`🚀 API rodando em http://localhost:${port}`)

serve({
  fetch: app.fetch,
  port,
})