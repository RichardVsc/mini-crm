import { z } from 'zod'
import { LEAD_STATUSES } from '../types/index.js'

export const createLeadSchema = z.object({
  contactId: z.string().min(1, 'contactId é obrigatório'),
  name: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
  company: z.string().min(2, 'Empresa deve ter no mínimo 2 caracteres'),
  status: z.enum(LEAD_STATUSES, {
    message: `Status deve ser: ${LEAD_STATUSES.join(', ')}`,
  }),
})

export const updateLeadSchema = createLeadSchema
  .omit({ contactId: true })
  .partial()