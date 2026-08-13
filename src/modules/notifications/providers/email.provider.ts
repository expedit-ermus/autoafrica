/**
 * src/modules/notifications/providers/email.provider.ts
 * ──────────────────────────────────────────────────────────
 * Provider Email Universel (Resend / SendGrid / Mode Dev).
 *
 * Supporte :
 * 1. Resend (https://resend.com) via RESEND_API_KEY (Recommandé)
 * 2. SendGrid via SENDGRID_API_KEY
 * 3. Mode Dev / Console Fallback lorsque les clés API sont absentes.
 * ──────────────────────────────────────────────────────────
 */

export interface SendEmailPayload {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

export interface SendEmailResult {
  success: boolean;
  messageId?: string;
  provider: 'resend' | 'sendgrid' | 'dev-console';
  error?: string;
}

const DEFAULT_FROM = process.env.EMAIL_FROM || 'AutoAfrique SaaS <noreply@autoafrique.com>';

export async function sendEmail(payload: SendEmailPayload): Promise<SendEmailResult> {
  const from = payload.from || DEFAULT_FROM;
  const resendApiKey = process.env.RESEND_API_KEY;
  const sendgridApiKey = process.env.SENDGRID_API_KEY;

  // ── 1. Resend API ──────────────────────────────────────────────────────────
  if (resendApiKey) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from,
          to: [payload.to],
          subject: payload.subject,
          html: payload.html,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        console.error('❌ [Resend Email Error]', data);
        return { success: false, provider: 'resend', error: data.message || 'Resend API failure' };
      }

      console.log(`✉️ [Resend Email Sent] ID: ${data.id} -> ${payload.to}`);
      return { success: true, messageId: data.id, provider: 'resend' };
    } catch (err) {
      console.error('❌ [Resend Network Exception]', err);
      return { success: false, provider: 'resend', error: String(err) };
    }
  }

  // ── 2. SendGrid API ────────────────────────────────────────────────────────
  if (sendgridApiKey) {
    try {
      const res = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${sendgridApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          personalizations: [{ to: [{ email: payload.to }] }],
          from: { email: from.includes('<') ? from.split('<')[1].replace('>', '').trim() : from },
          subject: payload.subject,
          content: [{ type: 'text/html', value: payload.html }],
        }),
      });

      if (!res.ok) {
        const errText = await res.text();
        console.error('❌ [SendGrid Email Error]', errText);
        return { success: false, provider: 'sendgrid', error: errText };
      }

      console.log(`✉️ [SendGrid Email Sent] -> ${payload.to}`);
      return { success: true, provider: 'sendgrid' };
    } catch (err) {
      console.error('❌ [SendGrid Network Exception]', err);
      return { success: false, provider: 'sendgrid', error: String(err) };
    }
  }

  // ── 3. Dev Fallback (Console Log Output) ──────────────────────────────────
  console.log(`
┌────────────────────────────────────────────────────────────────────────┐
│ ✉️ [DEV EMAIL SIMULATOR]                                              │
├────────────────────────────────────────────────────────────────────────┤
│ To:      ${payload.to}
│ From:    ${from}
│ Subject: ${payload.subject}
├────────────────────────────────────────────────────────────────────────┤
│ Body Snippet:
│ ${payload.html.replace(/<[^>]*>/g, ' ').substring(0, 200).trim()}...
└────────────────────────────────────────────────────────────────────────┘
  `);

  return { success: true, messageId: `mock_${Date.now()}`, provider: 'dev-console' };
}

// ─── Templates HTML Métier ───────────────────────────────────────────────────

function emailWrapper(content: string, title: string) {
  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>${title}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0F172A; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #F8FAFC;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #0F172A; padding: 40px 10px;">
    <tr>
      <td align="center">
        <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #1E293B; border-radius: 16px; overflow: hidden; border: 1px solid rgba(255,255,255,0.1);">
          <!-- Header -->
          <tr>
            <td style="padding: 30px 40px; background: linear-gradient(135deg, #E85D04 0%, #D00000 100%); text-align: center;">
              <h1 style="margin: 0; color: #FFFFFF; font-size: 26px; font-weight: 800; letter-spacing: -0.5px;">AutoAfrique</h1>
              <p style="margin: 5px 0 0 0; color: rgba(255,255,255,0.85); font-size: 13px; text-transform: uppercase; font-weight: 600;">SaaS ERP & Marketplace Automobile</p>
            </td>
          </tr>
          <!-- Body Content -->
          <tr>
            <td style="padding: 40px; color: #E2E8F0; font-size: 15px; line-height: 1.6;">
              ${content}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding: 20px 40px; background-color: #0F172A; border-top: 1px solid rgba(255,255,255,0.05); text-align: center; color: #64748B; font-size: 12px;">
              <p style="margin: 0 0 5px 0;">AutoAfrique SaaS — Plateforme Automobile d'Afrique de l'Ouest</p>
              <p style="margin: 0;">Besoin d'aide ? <a href="mailto:support@autoafrique.com" style="color: #E85D04; text-decoration: none;">support@autoafrique.com</a></p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

/**
 * 1. Email de Bienvenue lors de l'Inscription
 */
export async function sendWelcomeEmail(user: { email: string; firstName: string; role: string }) {
  const isSeller = user.role === 'SELLER';

  const html = emailWrapper(`
    <h2 style="color: #FFFFFF; margin-top: 0;">Bienvenue sur AutoAfrique, ${user.firstName} ! 👋</h2>
    <p>Nous sommes ravis de vous compter parmi les membres de la première communauté automobile d'Afrique de l'Ouest.</p>

    ${isSeller ? `
      <div style="background-color: rgba(234, 179, 8, 0.1); border-left: 4px solid #EAB308; padding: 16px; margin: 20px 0; border-radius: 8px;">
        <h4 style="margin: 0 0 6px 0; color: #FACC15;">⏳ Compte Vendeur en cours de vérification</h4>
        <p style="margin: 0; font-size: 14px; color: #CBD5E1;">
          Votre compte vendeur a été créé avec succès. Notre équipe examine actuellement vos informations. Vous serez notifié par email dès que votre compte sera pleinement activé.
        </p>
      </div>
    ` : `
      <p>Votre compte Acheteur est désormais actif. Vous pouvez dès à présent parcourir le catalogue de pièces détachées et véhicules vérifiés.</p>
    `}

    <div style="text-align: center; margin: 30px 0;">
      <a href="https://autoafrique.com/dashboard" style="background: linear-gradient(135deg, #E85D04, #FF8C00); color: #FFFFFF; padding: 14px 28px; text-decoration: none; border-radius: 12px; font-weight: 700; display: inline-block;">
        Accéder à mon Espace
      </a>
    </div>
  `, 'Bienvenue sur AutoAfrique');

  return sendEmail({
    to: user.email,
    subject: `Bienvenue sur AutoAfrique, ${user.firstName} !`,
    html,
  });
}

/**
 * 2. Email de Confirmation de Validation Vendeur par l'Admin
 */
export async function sendSellerApprovedEmail(user: { email: string; firstName: string }) {
  const html = emailWrapper(`
    <h2 style="color: #4ADE80; margin-top: 0;">🎉 Votre compte Vendeur a été validé !</h2>
    <p>Bonjour ${user.firstName},</p>
    <p>Bonne nouvelle ! L'équipe d'administration AutoAfrique a vérifié et validé votre profil vendeur.</p>
    <p>Vous avez désormais un accès complet pour :</p>
    <ul>
      <li>Publier vos pièces détachées et véhicules sur le catalogue public</li>
      <li>Gérer vos stocks et bons de commande</li>
      <li>Recevoir des devis et paiements Mobile Money (Orange Money, Wave)</li>
    </ul>

    <div style="text-align: center; margin: 30px 0;">
      <a href="https://autoafrique.com/dashboard/inventory" style="background: #22C55E; color: #FFFFFF; padding: 14px 28px; text-decoration: none; border-radius: 12px; font-weight: 700; display: inline-block;">
        Commencer à Vendre
      </a>
    </div>
  `, 'Compte Vendeur Validé');

  return sendEmail({
    to: user.email,
    subject: '🎉 Votre compte Vendeur AutoAfrique est validé !',
    html,
  });
}

/**
 * 3. Email d'Alerte pour Compte Suspendu ou Banni
 */
export async function sendAccountStatusAlertEmail(user: { email: string; firstName: string; status: 'SUSPENDED' | 'BANNED' }) {
  const isBanned = user.status === 'BANNED';

  const html = emailWrapper(`
    <h2 style="color: ${isBanned ? '#EF4444' : '#F59E0B'}; margin-top: 0;">
      ${isBanned ? '🚫 Notification de Bannissement de Compte' : '⚠️ Notification de Suspension de Compte'}
    </h2>
    <p>Bonjour ${user.firstName},</p>
    <p>
      ${isBanned
        ? "Nous vous informons que votre compte AutoAfrique a été banni définitivement suite à un non-respect de nos Conditions Générales d'Utilisation."
        : "Nous vous informons que votre compte AutoAfrique a été temporairement suspendu par notre équipe de modération."}
    </p>

    <div style="background-color: rgba(239, 68, 68, 0.1); border-left: 4px solid #EF4444; padding: 16px; margin: 20px 0; border-radius: 8px; color: #FCA5A5;">
      ${isBanned
        ? "L'accès à votre tableau de bord et la publication d'annonces sont totalement bloqués."
        : "Vous ne pouvez plus accéder à votre tableau de bord pendant la durée de la suspension."}
    </div>

    <p>Si vous souhaitez contester cette décision ou obtenir des précisions, merci de contacter notre support avec votre référence email.</p>

    <div style="text-align: center; margin: 30px 0;">
      <a href="mailto:support@autoafrique.com" style="background: rgba(255,255,255,0.1); color: #FFFFFF; padding: 12px 24px; text-decoration: none; border-radius: 10px; font-weight: 600; display: inline-block;">
        Contacter le Support Client
      </a>
    </div>
  `, isBanned ? 'Compte Banni' : 'Compte Suspendu');

  return sendEmail({
    to: user.email,
    subject: isBanned ? '🚫 Votre compte AutoAfrique a été banni' : '⚠️ Suspension de votre compte AutoAfrique',
    html,
  });
}
