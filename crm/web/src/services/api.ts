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
    let error: unknown

    try {
      const body = await response.json()
      error = body.error
    } catch {
      throw new Error(`Erro no servidor (${response.status})`)
    }

    if (typeof error === 'string') {
      throw new Error(error)
    }

    if (error && typeof error === 'object' && 'properties' in error) {
      const props = error as { properties: Record<string, { errors?: string[] }> }
      const messages = Object.values(props.properties)
        .flatMap((field) => field.errors ?? [])
      throw new Error(messages.join('. ') || 'Erro de validação')
    }

    throw new Error(`Erro na requisição (${response.status})`)
  }

  return response.json()
}