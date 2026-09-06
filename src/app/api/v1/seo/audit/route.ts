import { NextRequest, NextResponse } from 'next/server'
import { seoAuditService } from '@/modules/seo/seo-audit.service'
import { requireRole } from '@/modules/auth/auth.guard'
import { handleApiError } from '@/shared/utils/response'

export async function GET(request: NextRequest) {
  try {
    // Rapport d'audit interne : admins uniquement.
    await requireRole(request, ['SUPER_ADMIN', 'TENANT_ADMIN'])

    const report = await seoAuditService.getLatestAuditReport()

    return NextResponse.json({
      success: true,
      report,
    })
  } catch (error) {
    return handleApiError(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireRole(request, ['SUPER_ADMIN', 'TENANT_ADMIN'])

    const report = await seoAuditService.runNewAudit()

    return NextResponse.json({
      success: true,
      message: 'Audit SEO Search Console & GA4 exécuté avec succès',
      report,
    })
  } catch (error) {
    return handleApiError(error)
  }
}
