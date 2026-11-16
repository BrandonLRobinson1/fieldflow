import { describe, it, expect } from 'vitest'
import { waitlistSchema } from './validation'

describe('Waitlist validation', () => {
  it('accepts a valid email', () => {
    const result = waitlistSchema.safeParse({
      email: 'test@example.com',
    })
    expect(result.success).toBe(true)
  })

  it('does not accept invalid email', () => {
    const result = waitlistSchema.safeParse({
      email: 'test.com',
    })
    expect(result.success).toBe(false)
  })

  it('does not accept missing email', () => {
    const result = waitlistSchema.safeParse({})
    expect(result.success).toBe(false)
  })

  it('does not accept empty email', () => {
    const result = waitlistSchema.safeParse({
      email: '',
    })
    expect(result.success).toBe(false)
  })
})
