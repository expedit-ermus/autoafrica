import { describe, it, expect } from 'vitest'
import { POST } from './route'
import { NextRequest } from 'next/server'

describe('Social Auth Route API', () => {
  it('registers/logs in user via Google social auth', async () => {
    const req = new NextRequest('http://localhost:3000/api/v1/auth/social', {
      method: 'POST',
      body: JSON.stringify({ provider: 'google', role: 'BUYER' }),
    })

    const res = await POST(req)
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.data.user).toBeDefined()
    expect(data.data.token).toBeDefined()
  })

  it('registers seller via Facebook social auth with PENDING_VERIFICATION status', async () => {
    const req = new NextRequest('http://localhost:3000/api/v1/auth/social', {
      method: 'POST',
      body: JSON.stringify({ provider: 'facebook', role: 'SELLER' }),
    })

    const res = await POST(req)
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.data.user.role).toBe('SELLER')
  })
})
