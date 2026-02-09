import { z } from 'zod'

export const createContactSchema = z.object({
  name: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
  email: z.email('Email inválido'),
  phone: z.string().min(1, 'Telefone é obrigatório'),
})

export const updateContactSchema = createContactSchema.partial()