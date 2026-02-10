import { describe, it, expect } from 'vitest'
import { createLeadSchema, updateLeadSchema } from '../../schemas/lead.schema.js'

describe('Lead Schema', () => {
  describe('createLeadSchema', () => {
    it('should validate a valid lead', () => {
      const result = createLeadSchema.safeParse({
        contactId: 'some-uuid',
        name: 'Projeto CRM',
        company: 'Clínica Beleza',
        status: 'novo',
      })
      expect(result.success).toBe(true)
    })

    it('should accept all valid statuses', () => {
      const statuses = ['novo', 'contactado', 'qualificado', 'convertido', 'perdido']
      statuses.forEach((status) => {
        const result = createLeadSchema.safeParse({
          contactId: 'some-uuid',
          name: 'Lead',
          company: 'Empresa',
          status,
        })
        expect(result.success).toBe(true)
      })
    })

    it('should reject invalid status', () => {
      const result = createLeadSchema.safeParse({
        contactId: 'some-uuid',
        name: 'Lead',
        company: 'Empresa',
        status: 'invalido',
      })
      expect(result.success).toBe(false)
    })

    it('should reject name with less than 2 characters', () => {
      const result = createLeadSchema.safeParse({
        contactId: 'some-uuid',
        name: 'L',
        company: 'Empresa',
        status: 'novo',
      })
      expect(result.success).toBe(false)
    })

    it('should reject company with less than 2 characters', () => {
      const result = createLeadSchema.safeParse({
        contactId: 'some-uuid',
        name: 'Lead',
        company: 'E',
        status: 'novo',
      })
      expect(result.success).toBe(false)
    })

    it('should reject missing contactId', () => {
      const result = createLeadSchema.safeParse({
        name: 'Lead',
        company: 'Empresa',
        status: 'novo',
      })
      expect(result.success).toBe(false)
    })

    it('should trim name and company', () => {
      const result = createLeadSchema.safeParse({
        contactId: 'some-uuid',
        name: '  Projeto CRM  ',
        company: '  Clínica  ',
        status: 'novo',
      })
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.name).toBe('Projeto CRM')
        expect(result.data.company).toBe('Clínica')
      }
    })
  })

  describe('updateLeadSchema', () => {
    it('should allow partial update', () => {
      const result = updateLeadSchema.safeParse({ status: 'convertido' })
      expect(result.success).toBe(true)
    })

    it('should allow empty object', () => {
      const result = updateLeadSchema.safeParse({})
      expect(result.success).toBe(true)
    })

    it('should not accept contactId', () => {
      const result = updateLeadSchema.safeParse({ contactId: 'new-id' })
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data).not.toHaveProperty('contactId')
      }
    })

    it('should still validate fields when provided', () => {
      const result = updateLeadSchema.safeParse({ status: 'invalido' })
      expect(result.success).toBe(false)
    })
  })
})