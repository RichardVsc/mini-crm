import type { Context, Next } from 'hono'

export async function errorHandler(c: Context, next: Next) {
  try {
    await next()
  } catch (error) {
    console.error('[API Error]', error)

    if (error instanceof SyntaxError) {
      return c.json({ error: 'JSON inválido' }, 400)
    }

    return c.json({ error: 'Erro interno do servidor' }, 500)
  }
}