import { describe, it, expect } from 'vitest'
import { auditService } from './audit.service'
import { prisma } from '@/lib/prisma'

describe('AuditService', () => {
  it('creates an audit log entry with an existing user or system log', async () => {
    const user = await prisma.user.findFirst()

    const log = await auditService.log({
      userId: user?.id,
      action: 'USER_ACTIVATED',
      entity: 'User',
      entityId: user?.id || 'sys_123',
      oldValues: { status: 'PENDING_VERIFICATION' },
      newValues: { status: 'ACTIVE' },
    })

    expect(log).not.toBeNull()
    expect(log?.action).toBe('USER_ACTIVATED')
    expect(log?.entity).toBe('User')
  })

  it('lists audit log entries', async () => {
    const logs = await auditService.list({ entity: 'User' })
    expect(Array.isArray(logs)).toBe(true)
  })
})
