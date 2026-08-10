import { NextResponse } from 'next/server'
import { seoAuditService } from '@/modules/seo/seo-audit.service'
import { handleApiError } from '@/shared/utils/response'

export async function GET() {
  try {
    const report = await seoAuditService.getLatestAuditReport()

    return NextResponse.json({
      success: true,
      report,
    })
  } catch (error) {
    return handleApiError(error)
  }
}

export async function POST() {
  try {
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
