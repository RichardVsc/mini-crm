import { describe, it, expect } from 'vitest'
import { createContactSchema, updateContactSchema } from '../../schemas/contact.schema.js'

describe('Contact Schema', () => {
  describe('createContactSchema', () => {
    it('should validate a valid contact', () => {
      const result = createContactSchema.safeParse({
        name: 'Maria Silva',
        email: 'maria@email.com',
        phone: '(47) 99999-9999',
      })
      expect(result.success).toBe(true)
    })

    it('should accept phone without formatting', () => {
      const result = createContactSchema.safeParse({
        name: 'Maria Silva',
        email: 'maria@email.com',
        phone: '47999999999',
      })
      expect(result.success).toBe(true)
    })

    it('should reject name with less than 2 characters', () => {
      const result = createContactSchema.safeParse({
        name: 'M',
        email: 'maria@email.com',
        phone: '(47) 99999-9999',
      })
      expect(result.success).toBe(false)
    })

    it('should reject invalid email', () => {
      const result = createContactSchema.safeParse({
        name: 'Maria',
        email: 'invalido',
        phone: '(47) 99999-9999',
      })
      expect(result.success).toBe(false)
    })

    it('should reject invalid phone format', () => {
      const result = createContactSchema.safeParse({
        name: 'Maria',
        email: 'maria@email.com',
        phone: '123',
      })
      expect(result.success).toBe(false)
    })

    it('should reject missing fields', () => {
      const result = createContactSchema.safeParse({})
      expect(result.success).toBe(false)
    })

    it('should trim name', () => {
      const result = createContactSchema.safeParse({
        name: '  Maria Silva  ',
        email: 'maria@email.com',
        phone: '(47) 99999-9999',
      })
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.name).toBe('Maria Silva')
      }
    })
  })

  describe('updateContactSchema', () => {
    it('should allow partial update', () => {
      const result = updateContactSchema.safeParse({ name: 'Novo Nome' })
      expect(result.success).toBe(true)
    })

    it('should allow empty object', () => {
      const result = updateContactSchema.safeParse({})
      expect(result.success).toBe(true)
    })

    it('should still validate fields when provided', () => {
      const result = updateContactSchema.safeParse({ email: 'invalido' })
      expect(result.success).toBe(false)
    })
  })
})