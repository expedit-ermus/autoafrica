import { NextRequest, NextResponse } from 'next/server';
import { financeService } from '@/modules/finance/finance.service';
import { requireAuth, requireOwnershipOrAdmin } from '@/modules/auth/auth.guard';
import { handleApiError } from '@/shared/utils/response';

type Context = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, context: Context) {
  try {
    const auth = await requireAuth(request);
    const { id } = await context.params;

    // Laisse remonter NotFoundError : une facture inexistante doit renvoyer 404,
    // jamais un document fabrique (sinon l'enumeration d'identifiants est silencieuse).
    const invoice = await financeService.getInvoiceById(id);

    // Accessible a l'acheteur, au vendeur de la facture, ou a un admin plateforme.
    requireOwnershipOrAdmin(
      auth,
      [invoice.buyerId, invoice.sellerId],
      'Acces non autorise a cette facture',
    );

    const htmlContent = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Facture ${invoice.invoiceNumber} - AutoAfrique</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; color: #090d16; background: #fff; }
    .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #FF6B35; padding-bottom: 20px; margin-bottom: 30px; }
    .logo { font-size: 28px; font-weight: 900; color: #FF6B35; }
    .title { font-size: 20px; font-weight: 800; color: #090d16; }
    .details { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px; background: #f8fafc; padding: 20px; border-radius: 12px; border: 1px solid #e2e8f0; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
    th { text-align: left; background: #f1f5f9; padding: 12px; font-size: 14px; color: #334155; }
    td { padding: 12px; border-bottom: 1px solid #e2e8f0; font-size: 14px; }
    .totals { margin-left: auto; width: 300px; text-align: right; }
    .totals div { display: flex; justify-content: space-between; padding: 6px 0; font-size: 14px; }
    .totals .grand-total { font-weight: 800; font-size: 18px; color: #ea580c; border-top: 2px solid #FF6B35; padding-top: 10px; margin-top: 10px; }
    .footer { margin-top: 50px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; padding-top: 20px; }
    @media print {
      body { padding: 0; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="no-print" style="margin-bottom: 20px; text-align: right;">
    <button onclick="window.print()" style="background: #FF6B35; color: white; border: none; padding: 10px 20px; border-radius: 8px; font-weight: bold; cursor: pointer; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">🖨️ Imprimer / Sauvegarder PDF</button>
  </div>

  <div class="header">
    <div class="logo">AutoAfrique</div>
    <div>
      <div class="title">FACTURE N° ${invoice.invoiceNumber}</div>
      <div style="font-size: 14px; color: #6b7280;">Date: ${new Date(invoice.createdAt).toLocaleDateString('fr-FR')}</div>
    </div>
  </div>

  <div class="details">
    <div>
      <strong>ÉMETTEUR (Vendeur):</strong><br>
      AutoAfrique Marketplace SAS<br>
      Abidjan, Côte d'Ivoire<br>
      NIF: 21987340-X | RCCM: CI-ABJ-2023-B<br>
      Support: contact@autoafrique.ci
    </div>
    <div>
      <strong>DESTINATAIRE (Client):</strong><br>
      ${invoice.buyerId}<br>
      Commande Réf: ${invoice.order?.id || 'DIRECT'}<br>
      Statut du Paiement: <span style="color: green; font-weight: bold;">${invoice.status}</span>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th>Description</th>
        <th>Qté</th>
        <th>Prix unitaire</th>
        <th>Total H.T.</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Achat pièces détachées - Commande ${invoice.order?.id || id}</td>
        <td>1</td>
        <td>${new Intl.NumberFormat('fr-FR').format(invoice.subtotal)} ${invoice.currency}</td>
        <td>${new Intl.NumberFormat('fr-FR').format(invoice.subtotal)} ${invoice.currency}</td>
      </tr>
    </tbody>
  </table>

  <div class="totals">
    <div><span>Sous-total H.T. :</span> <span>${new Intl.NumberFormat('fr-FR').format(invoice.subtotal)} ${invoice.currency}</span></div>
    <div><span>TVA (${invoice.taxRate}%) :</span> <span>${new Intl.NumberFormat('fr-FR').format(invoice.taxAmount)} ${invoice.currency}</span></div>
    <div class="grand-total"><span>TOTAL T.T.C. :</span> <span>${new Intl.NumberFormat('fr-FR').format(invoice.totalAmount)} ${invoice.currency}</span></div>
  </div>

  <div class="footer">
    <p>Merci pour votre confiance avec AutoAfrique, la plateforme ERP-Marketplace leader en Afrique de l'Ouest.</p>
    <p>${invoice.notes || 'Facture acquittée via Mobile Money.'}</p>
  </div>
</body>
</html>`;

    return new NextResponse(htmlContent, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
      },
    });
  } catch (error) {
    // Conserve les vrais statuts : 401 non connecte, 403 pas proprietaire, 404 introuvable.
    return handleApiError(error);
  }
}
