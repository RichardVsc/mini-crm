const API_URL = import.meta.env.VITE_API_URL

if (!API_URL) {
  throw new Error('VITE_API_URL is not defined. Check your .env file.')
}

export async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      ...(options?.body ? { 'Content-Type': 'application/json' } : {}),
      ...options?.headers,
    },
  })

  if (!response.ok) {
    const body = await response.json()
    const error = body.error

    if (typeof error === 'string') {
      throw new Error(error)
    }

    if (error?.properties) {
      const messages = Object.values(error.properties)
        .flatMap((field: unknown) => {
          const f = field as { errors?: string[] }
          return f.errors ?? []
        })
      throw new Error(messages.join('. ') || 'Erro de validação')
    }

    throw new Error('Erro na requisição')
  }

  return response.json()
}