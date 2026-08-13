import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  sendEmail,
  sendWelcomeEmail,
  sendSellerApprovedEmail,
  sendAccountStatusAlertEmail,
} from './email.provider'

describe('EmailProvider', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    delete process.env.RESEND_API_KEY
    delete process.env.SENDGRID_API_KEY
  })

  it('uses dev-console provider when no API keys are configured', async () => {
    const result = await sendEmail({
      to: 'test@autoafrique.com',
      subject: 'Test Subject',
      html: '<p>Test body</p>',
    })

    expect(result.success).toBe(true)
    expect(result.provider).toBe('dev-console')
    expect(result.messageId).toContain('mock_')
  })

  it('uses Resend API when RESEND_API_KEY is present', async () => {
    process.env.RESEND_API_KEY = 're_test_key_123'
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ id: 'resend_msg_999' }),
    })
    vi.stubGlobal('fetch', mockFetch)

    const result = await sendEmail({
      to: 'buyer@autoafrique.com',
      subject: 'Welcome',
      html: '<p>Welcome</p>',
    })

    expect(result.success).toBe(true)
    expect(result.provider).toBe('resend')
    expect(result.messageId).toBe('resend_msg_999')
    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.resend.com/emails',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          Authorization: 'Bearer re_test_key_123',
        }),
      })
    )
  })

  it('uses SendGrid API when SENDGRID_API_KEY is present and Resend is not', async () => {
    process.env.SENDGRID_API_KEY = 'SG.test_key_456'
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      text: async () => '',
    })
    vi.stubGlobal('fetch', mockFetch)

    const result = await sendEmail({
      to: 'seller@autoafrique.com',
      subject: 'Verification',
      html: '<p>Verified</p>',
    })

    expect(result.success).toBe(true)
    expect(result.provider).toBe('sendgrid')
    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.sendgrid.com/v3/mail/send',
      expect.objectContaining({
        method: 'POST',
      })
    )
  })

  it('sends welcome email for new user', async () => {
    const result = await sendWelcomeEmail({
      email: 'newuser@autoafrique.com',
      firstName: 'Koffi',
      role: 'BUYER',
    })

    expect(result.success).toBe(true)
  })

  it('sends seller approval email', async () => {
    const result = await sendSellerApprovedEmail({
      email: 'seller@autoafrique.com',
      firstName: 'Moussa',
    })

    expect(result.success).toBe(true)
  })

  it('sends account status alert email for banned user', async () => {
    const result = await sendAccountStatusAlertEmail({
      email: 'banned@autoafrique.com',
      firstName: 'Jean',
      status: 'BANNED',
    })

    expect(result.success).toBe(true)
  })
})
