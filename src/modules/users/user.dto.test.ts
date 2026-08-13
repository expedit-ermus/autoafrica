import { describe, it, expect } from 'vitest'
import { updateUserDto } from './dto/user.dto'

describe('UserDTO Zod Validation', () => {
  it('validates a valid update payload', () => {
    const payload = {
      status: 'ACTIVE',
      role: 'SELLER',
      firstName: 'Koffi',
      country: 'CI',
    }

    const parsed = updateUserDto.parse(payload)
    expect(parsed.status).toBe('ACTIVE')
    expect(parsed.role).toBe('SELLER')
  })

  it('rejects an invalid status', () => {
    const payload = {
      status: 'INVALID_STATUS',
    }

    expect(() => updateUserDto.parse(payload)).toThrow()
  })

  it('rejects an invalid role', () => {
    const payload = {
      role: 'HACKER_ROLE',
    }

    expect(() => updateUserDto.parse(payload)).toThrow()
  })

  it('allows optional fields', () => {
    const payload = {}
    const parsed = updateUserDto.parse(payload)
    expect(parsed).toEqual({})
  })
})
