import { describe, it, expect } from 'vitest'
import { phoneMask } from '../../utils/masks'

describe('phoneMask', () => {
  it('should return empty for empty input', () => {
    expect(phoneMask('')).toBe('')
  })

  it('should show only digits for 2 or less characters', () => {
    expect(phoneMask('4')).toBe('4')
    expect(phoneMask('47')).toBe('47')
  })

  it('should add parentheses after 2 digits', () => {
    expect(phoneMask('479')).toBe('(47) 9')
  })

  it('should format partial number', () => {
    expect(phoneMask('4799999')).toBe('(47) 99999')
  })

  it('should format complete number with dash', () => {
    expect(phoneMask('47999999999')).toBe('(47) 99999-9999')
  })

  it('should strip non-digit characters', () => {
    expect(phoneMask('(47) 99999-9999')).toBe('(47) 99999-9999')
  })

  it('should limit to 11 digits', () => {
    expect(phoneMask('479999999991234')).toBe('(47) 99999-9999')
  })
})