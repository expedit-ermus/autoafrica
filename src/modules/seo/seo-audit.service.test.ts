import { describe, it, expect } from 'vitest'
import { SeoAuditService } from './seo-audit.service'

describe('SeoAuditService', () => {
  const service = new SeoAuditService()

  it('returns complete SEO audit report with Search Console metrics', async () => {
    const report = await service.getLatestAuditReport()

    expect(report.siteUrl).toBe('https://autoafrique-saas.vercel.app')
    expect(report.totalIndexedPages).toBe(80)
    expect(report.totalSearchConsoleClicks).toBeGreaterThan(0)
    expect(report.coreWebVitals.status).toBe('GOOD')
  })

  it('returns tracked keyword positions with search volume', async () => {
    const report = await service.getLatestAuditReport()

    expect(report.keywords.length).toBeGreaterThan(0)
    const topKeyword = report.keywords.find((k) => k.position === 1)
    expect(topKeyword).toBeDefined()
    expect(topKeyword?.keyword).toContain('mobile money')
  })

  it('triggers a fresh SEO audit and returns report', async () => {
    const report = await service.runNewAudit()

    expect(report.alerts.length).toBeGreaterThan(0)
    expect(report.generatedAt).toBeDefined()
  })
})
