import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { contactRoutes } from './routes/contacts/index.js'
import { leadRoutes } from './routes/leads/index.js'
import { errorHandler } from './middlewares/error-handler.js'

const app = new Hono()

app.use('*', cors())
app.use('*', errorHandler)

app.route('/contacts', contactRoutes)
app.route('/leads', leadRoutes)

export { app }
