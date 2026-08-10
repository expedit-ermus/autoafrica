/**
 * Service de Notification SMS & WhatsApp (Afrique de l'Ouest)
 * Simule et prépare l'envoi via les passerelles SMS locales (Orange SMS API, Termii, Twilio, Infobip)
 */

export interface SmsPayload {
  to: string;
  message: string;
  type?: 'ORDER_CONFIRMED' | 'PAYMENT_RECEIVED' | 'SHIPPED' | 'DELIVERED' | 'STOCK_ALERT';
}

export class SmsService {
  /**
   * Simule l'envoi d'un SMS de confirmation de commande
   */
  async sendOrderConfirmation(phone: string, orderNumber: string, amount: number): Promise<boolean> {
    const formattedAmount = new Intl.NumberFormat('fr-FR').format(amount);
    const message = `AutoAfrique : Votre commande #${orderNumber} d'un montant de ${formattedAmount} FCFA a été reçue et placée sous séquestre sécurisé. Suivez votre colis sur https://autoafrique.ci/dashboard/orders`;
    
    return this.sendSms({ to: phone, message, type: 'ORDER_CONFIRMED' });
  }

  /**
   * Simule l'envoi d'un SMS de confirmation de paiement
   */
  async sendPaymentNotification(phone: string, orderNumber: string, provider: string): Promise<boolean> {
    const message = `AutoAfrique : Paiement ${provider} pour la commande #${orderNumber} validé avec succès. Merci de votre confiance !`;
    return this.sendSms({ to: phone, message, type: 'PAYMENT_RECEIVED' });
  }

  /**
   * Simule l'envoi d'un SMS d'expédition / transit
   */
  async sendShippingNotification(phone: string, orderNumber: string, trackingNumber?: string): Promise<boolean> {
    const message = `AutoAfrique : Votre commande #${orderNumber} a été expédiée ! ${trackingNumber ? `N° de suivi : ${trackingNumber}.` : ''} Réception prévue sous 24-72h.`;
    return this.sendSms({ to: phone, message, type: 'SHIPPED' });
  }

  /**
   * Envoi générique SMS avec journalisation
   */
  async sendSms(payload: SmsPayload): Promise<boolean> {
    try {
      // Simulation d'envoi réseau
      console.log(`[SMS-SERVICE] [${payload.type || 'INFO'}] Envoyer SMS à ${payload.to} : "${payload.message}"`);
      return true;
    } catch (error) {
      console.error('[SMS-SERVICE] Erreur d\'envoi SMS:', error);
      return false;
    }
  }
}

export const smsService = new SmsService();
