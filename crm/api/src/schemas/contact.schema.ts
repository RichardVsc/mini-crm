import { z } from 'zod'

const phoneRegex = /^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/

export const createContactSchema = z.object({
  name: z.string().trim().min(2, 'Nome deve ter no mínimo 2 caracteres'),
  email: z.string().email('Email inválido'),
  phone: z.string().regex(phoneRegex, 'Telefone inválido. Use o formato (00) 00000-0000'),
})

export const updateContactSchema = createContactSchema.partial()