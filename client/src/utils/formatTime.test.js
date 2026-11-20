import { describe, it, expect } from 'vitest'
import { formatTime } from './formatTime'

describe('formatTime', () => {
  it('formats seconds as m:ss', () => {
    expect(formatTime(0)).toBe('0:00')
    expect(formatTime(65)).toBe('1:05')
    expect(formatTime(216)).toBe('3:36')
  })

  it('floors fractional seconds', () => {
    expect(formatTime(125.9)).toBe('2:05')
  })

  it('returns 0:00 for invalid values', () => {
    expect(formatTime(NaN)).toBe('0:00')
    expect(formatTime(undefined)).toBe('0:00')
  })
})