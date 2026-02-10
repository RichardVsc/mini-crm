import { serve } from '@hono/node-server'
import { app } from './app.js'
import { seed } from './seed.js'

seed()

const port = 3001

console.log(`🚀 API rodando em http://localhost:${port}`)

serve({
  fetch: app.fetch,
  port,
})
