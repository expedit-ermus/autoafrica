import { describe, it, expect, vi } from 'vitest'
import { SmsWhatsAppProvider } from './sms-whatsapp.provider'

describe('SmsWhatsAppProvider', () => {
  const provider = new SmsWhatsAppProvider()

  it('masks mobile phone numbers correctly for privacy compliance', () => {
    expect(provider.maskPhoneNumber('+2250708091011')).toBe('+22507****1011')
    expect(provider.maskPhoneNumber('12345')).toBe('***')
  })

  it('sends an SMS message successfully', async () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

    const result = await provider.sendSms('+2250708091011', 'Test SMS')

    expect(result.success).toBe(true)
    expect(result.channel).toBe('sms')
    expect(result.messageId).toContain('sms_')
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('[SMS SENT]'))

    consoleSpy.mockRestore()
  })

  it('sends a WhatsApp message successfully', async () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

    const result = await provider.sendWhatsApp('+2250708091011', 'Test WA')

    expect(result.success).toBe(true)
    expect(result.channel).toBe('whatsapp')
    expect(result.messageId).toContain('wa_')
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('[WHATSAPP SENT]'))

    consoleSpy.mockRestore()
  })

  it('sends dual SMS and WhatsApp payment confirmation alerts', async () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

    const result = await provider.sendPaymentConfirmation({
      phone: '+2250708091011',
      orderNumber: 'AAF-999',
      amount: 25000,
      currency: 'XOF',
      method: 'Wave',
    })

    expect(result.success).toBe(true)
    expect(result.sms.success).toBe(true)
    expect(result.whatsapp.success).toBe(true)

    consoleSpy.mockRestore()
  })
})
