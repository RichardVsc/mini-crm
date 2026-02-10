import { describe, it, expect } from 'vitest'
import { STATUS_LABELS, STATUS_COLORS } from '../../constants/lead'
import { LEAD_STATUSES } from '../../types'

describe('Lead Constants', () => {
  it('should have a label for every status', () => {
    LEAD_STATUSES.forEach((status) => {
      expect(STATUS_LABELS[status]).toBeDefined()
      expect(STATUS_LABELS[status].length).toBeGreaterThan(0)
    })
  })

  it('should have a color for every status', () => {
    LEAD_STATUSES.forEach((status) => {
      expect(STATUS_COLORS[status]).toBeDefined()
      expect(STATUS_COLORS[status].length).toBeGreaterThan(0)
    })
  })
})