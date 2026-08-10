export interface SmsWhatsAppPayload {
  phone: string
  message: string
  channel: 'sms' | 'whatsapp'
  metadata?: Record<string, unknown>
}

export interface PaymentConfirmationPayload {
  phone: string
  orderNumber: string
  amount: number
  currency: string
  method: string
  customerName?: string
}

export class SmsWhatsAppProvider {
  /**
   * Masks a mobile phone number for privacy compliant logging (e.g. +225 07****1234)
   */
  maskPhoneNumber(phone: string): string {
    const cleaned = phone.trim()
    if (cleaned.length <= 6) return '***'
    const start = cleaned.slice(0, 6)
    const end = cleaned.slice(-4)
    return `${start}****${end}`
  }

  /**
   * Sends an SMS message to a phone number.
   */
  async sendSms(phone: string, message: string): Promise<{ success: boolean; messageId: string; channel: 'sms' }> {
    const maskedPhone = this.maskPhoneNumber(phone)
    const messageId = `sms_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`

    // In production, integrate Twilio / Infobip / Orange SMS API:
    // const res = await fetch(process.env.SMS_API_URL, { method: 'POST', body: ... })

    console.log(`[SMS SENT] To: ${maskedPhone} | ID: ${messageId} | Text: "${message}"`)

    return {
      success: true,
      messageId,
      channel: 'sms',
    }
  }

  /**
   * Sends a WhatsApp template message to a phone number.
   */
  async sendWhatsApp(
    phone: string,
    message: string,
  ): Promise<{ success: boolean; messageId: string; channel: 'whatsapp' }> {
    const maskedPhone = this.maskPhoneNumber(phone)
    const messageId = `wa_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`

    // In production, integrate Meta WhatsApp Cloud API:
    // const res = await fetch(`https://graph.facebook.com/v18.0/${process.env.WA_PHONE_NUMBER_ID}/messages`, { ... })

    console.log(`[WHATSAPP SENT] To: ${maskedPhone} | ID: ${messageId} | Text: "${message}"`)

    return {
      success: true,
      messageId,
      channel: 'whatsapp',
    }
  }

  /**
   * Sends payment confirmation alerts over SMS and WhatsApp post-payment.
   */
  async sendPaymentConfirmation(payload: PaymentConfirmationPayload) {
    const text = `AutoAfrique: Votre paiement de ${payload.amount} ${payload.currency} (${payload.method}) pour la commande N° ${payload.orderNumber} a été confirmé. Merci de votre confiance !`

    const [smsResult, waResult] = await Promise.all([
      this.sendSms(payload.phone, text),
      this.sendWhatsApp(payload.phone, text),
    ])

    return {
      success: smsResult.success && waResult.success,
      sms: smsResult,
      whatsapp: waResult,
    }
  }
}

export const smsWhatsAppProvider = new SmsWhatsAppProvider()
